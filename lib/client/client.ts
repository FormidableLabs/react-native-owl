import React from 'react';
import { Logger } from '../logger';
import { CHECK_TIMEOUT, MAX_TIMEOUT, SOCKET_WAIT_TIMEOUT } from './constants';
import { initWebSocket } from './websocket';
import { SOCKET_EVENT } from '../actions/types';

import { add, get, TrackedElementData, exists } from './trackedElements';
import { handleAction } from './handleAction';

const logger = new Logger(true);

let automateTimeout: number;
let isReactUpdating = true;

let owlClient: WebSocket;

const originalReactCreateElement: typeof React.createElement =
  React.createElement;

export const initClient = () => {
  logger.info('[OWL - Client] Initialising OWL client');

  patchReact();
  waitForWebSocket();
};

const patchReact = () => {
  // @ts-ignore
  React.createElement = (type, props, ...children) => {
    const testID = props?.testID;
    const shouldTrack = testID && !exists(testID);

    const trackingRef =
      (props?.ref as React.RefObject<unknown> | undefined) || React.createRef();

    if (shouldTrack) {
      const trackData: TrackedElementData = {
        ref: trackingRef,
        onPress: props?.onPress,
        onLongPress: props?.onLongPress,
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
      {
        ...props,
        ref: trackingRef,
        showsHorizontalScrollIndicator: false,
        showsVerticalScrollIndicator: false,
      },
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

    logger.info('[OWL - Websocket] Connection established');
  } catch {
    setTimeout(waitForWebSocket, SOCKET_WAIT_TIMEOUT);
  }
};

const handleMessage = async (message: string) => {
  const socketEvent = JSON.parse(message) as SOCKET_EVENT;
  const testID = socketEvent.type === 'DONE' ? '' : socketEvent.testID;

  let element;

  try {
    element = await getElementByTestId(testID);
  } catch (error) {
    sendEvent({ type: 'NOT_FOUND', testID });
  }

  if (element) {
    try {
      socketEvent.type === 'ACTION' &&
        handleAction(
          logger,
          testID,
          element,
          socketEvent.action,
          socketEvent.value
        );

      setTimeout(() => sendEvent({ type: 'DONE' }), 100);
    } catch (error) {
      let message = 'Unknown error';
      if (error instanceof Error) {
        message = error.message;
      }

      sendEvent({ type: 'ERROR', testID, message });
    }
  }
};

const sendEvent = (event: SOCKET_EVENT) =>
  owlClient.send(JSON.stringify(event));

const getElementByTestId = async (testID: string) =>
  new Promise<TrackedElementData>((resolve, reject) => {
    logger.info(`[OWL - Client] Looking for Element with testID ${testID}`);

    const rejectTimeout = setTimeout(() => {
      logger.error(`[OWL - Client] ❌ not found`);

      clearInterval(checkInterval);
      reject(new Error(`Element with testID ${testID} not found`));
    }, MAX_TIMEOUT);

    const checkInterval = setInterval(() => {
      if (isReactUpdating || !exists(testID)) {
        return;
      }

      logger.info(`[OWL - Client] ✓ found`);

      clearInterval(checkInterval);
      clearTimeout(rejectTimeout);
      resolve(get(testID));
    }, CHECK_TIMEOUT);
  });
