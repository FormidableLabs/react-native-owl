import React from 'react';
import { Logger } from '../logger';
import { CHECK_TIMEOUT, MAX_TIMEOUT, SOCKET_WAIT_TIMEOUT } from './constants';
import { initWebSocket } from './rn-websocket';
import { ACTION, SOCKET_EVENT } from '../actions/types';

import { add, get, ElementActions, exists } from './tracked-elements';

const logger = new Logger(true); // !!(process.env.OWL_DEBUG === 'true') || __DEV__);

let automateTimeout: number;
let isReactUpdating = true;

let owlClient: WebSocket;

const originalReactCreateElement: typeof React.createElement =
  React.createElement;

export const initClient = () => {
  logger.info('Initialising OWL client');

  patchReact();
  waitForWebSocket();
};

const patchReact = () => {
  // @ts-ignore
  React.createElement = (type, props, ...children) => {
    const testID = props?.testID;
    const shouldTrack = testID && !exists(testID);

    const trackingRef = props?.ref || React.createRef();

    if (shouldTrack) {
      const trackData: ElementActions = {
        ref: trackingRef,
        onPress: props?.onPress,
        onChangeText: props?.onChangeText,
      };

      add(logger, testID, trackData);
    }

    clearTimeout(automateTimeout);

    automateTimeout = setTimeout(() => {
      isReactUpdating = false;
    }, CHECK_TIMEOUT);

    isReactUpdating = true;

    return originalReactCreateElement(
      type,
      { ...props, ref: trackingRef },
      ...children
    );
  };
};

/**
 * The app might launch before the OWL server starts, so we need to keep trying...
 */
const waitForWebSocket = async () => {
  try {
    owlClient = await initWebSocket(logger, handleMessage);

    logger.info('[OWL] Connection established');
  } catch {
    setTimeout(waitForWebSocket, SOCKET_WAIT_TIMEOUT);
  }
};

const handleMessage = async (message: string) => {
  const socketEvent = JSON.parse(message) as SOCKET_EVENT;
  // @ts-ignore
  const { type, testID } = socketEvent;

  let element;

  try {
    element = await getElementByTestId(testID);
  } catch (error) {
    sendEvent({ type: 'NOT_FOUND', testID });
  }

  if (element) {
    try {
      const data =
        type === 'ACTION'
          ? handleAction(testID, element, socketEvent.action, socketEvent.value)
          : undefined;

      sendEvent({ type: 'DONE', data });
    } catch (error) {
      let message = 'Unknown error';
      if (error instanceof Error) {
        message = error.message;
      }

      sendEvent({ type: 'ERROR', testID, message });
    }
  }
};

const sendEvent = async (event: SOCKET_EVENT) => {
  owlClient.send(JSON.stringify(event));
};

const handleAction = (
  testID: string,
  element: ElementActions,
  action: ACTION,
  value?: string
) => {
  logger.info(`Executing ${action} on element with testID ${testID}`);

  switch (action as ACTION) {
    case 'TAP':
      element.onPress?.();
      break;

    case 'CLEAR_TEXT':
      element.ref.current?.clear();
      break;

    case 'ENTER_TEXT':
      element.onChangeText?.(typeof value === 'undefined' ? '' : value);
      break;

    default:
      logger.error(`Action not supported ${action}`);
  }

  return undefined;
};

const getElementByTestId = async (testID: string): Promise<ElementActions> => {
  return new Promise((resolve, reject) => {
    logger.info(`Looking for Element with testID ${testID}`);

    const rejectTimeout = setTimeout(() => {
      const message = `Element with testID ${testID} not found`;

      logger.error(`\t ❌ not found`);

      clearInterval(checkInterval);
      reject(new Error(message));
    }, MAX_TIMEOUT);

    const checkInterval = setInterval(() => {
      if (isReactUpdating || get(testID) == null) {
        return;
      }

      logger.info(`\t ✓ found`);

      clearInterval(checkInterval);
      clearTimeout(rejectTimeout);
      resolve(get(testID));
    }, CHECK_TIMEOUT);
  });
};
