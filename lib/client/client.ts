// @ts-ignore
import React from 'react';
import { Logger } from '../logger';
import { CHECK_TIMEOUT, MAX_TIMEOUT } from './constants';
import { initWebSocket } from './rn-websocket';
import { ACTION, SOCKET_EVENT } from '../actions/types';

import { add, get, ElementActions, exists } from './tracked-elements';
import WebSocket from 'ws';

const logger = new Logger(true); // !!(process.env.OWL_DEBUG === 'true') || __DEV__);

let automateTimeout: NodeJS.Timeout;
let isReactUpdating = true;

let owlClient: WebSocket;

const originalReactCreateElement: typeof React.createElement =
  React.createElement;

const SOCKET_WAIT_TIMEOUT = 300;

export const initClient = () => {
  logger.info('Initialising OWL client');

  patchReact();
  waitForWebSocket();
};

const patchReact = () => {
  // @ts-ignore
  React.createElement = (type, props, ...children) => {
    const shouldTrack = props?.testID && !exists(props.testID);

    if (shouldTrack) {
      const testID = props.testID;

      const newRef = React.createRef();

      props.ref = newRef;
      // props.onLayout = (e) => testOnLayout(testID, e);

      const trackData = {
        ref: newRef,
        onPress: props.onPress,
        // onChangeText: props.onChangeText,
      };

      add(logger, testID, trackData);
    }

    clearTimeout(automateTimeout);

    automateTimeout = setTimeout(() => {
      isReactUpdating = false;
    }, CHECK_TIMEOUT);

    isReactUpdating = true;

    return originalReactCreateElement(type, props, ...children);
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

  try {
    const element = await getElementByTestId(testID);
    const data =
      type === 'ACTION'
        ? handleAction(testID, element, socketEvent.action)
        : undefined;

    sendEvent({ type: 'DONE', data });
  } catch (e) {
    sendEvent({ type: 'NOT_FOUND' });
  }
};

const sendEvent = async (event: SOCKET_EVENT) => {
  owlClient.send(JSON.stringify(event));
};

const handleAction = (
  testID: string,
  element: ElementActions,
  action: ACTION
) => {
  logger.info(`Execution ${action} on element with testID ${testID}`);

  switch (action as ACTION) {
    case 'TAP':
      element.onPress();

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
