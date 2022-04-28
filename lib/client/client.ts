import React from 'react';
import { Logger } from '../logger';
import { CHECK_TIMEOUT, MAX_TIMEOUT, SOCKET_WAIT_TIMEOUT } from './constants';
import { initWebSocket } from './websocket';
import { SOCKET_CLIENT_RESPONSE, SOCKET_TEST_REQUEST } from '../websocketTypes';

import { add, get, TrackedElementData, exists } from './trackedElements';
import { handleAction } from './handleAction';

const logger = new Logger(true);

let isReactUpdating = true;

let owlClient: WebSocket;

export const initClient = () => {
  logger.info('[OWL - Client] Initialising OWL client');

  patchReact();
  waitForWebSocket();
};

/**
 * We patch react so that we can maintain a list of elements that have testID's
 * We can then use this list to find the element when we receive an action
 */
const patchReact = () => {
  const originalReactCreateElement: typeof React.createElement =
    React.createElement;
  let automateTimeout: number;

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

/**
 * When we receive a message, we need to find the element that corresponds to the testID,
 * then attempt to handle the requested action on it.
 */
const handleMessage = async (message: string) => {
  const socketEvent = JSON.parse(message) as SOCKET_TEST_REQUEST;
  const testID = socketEvent.testID;

  let element;

  try {
    element = await getElementByTestId(testID);
  } catch (error) {
    sendNotFound(testID);
  }

  if (element) {
    try {
      if (socketEvent.type === 'ACTION') {
        handleAction(
          logger,
          testID,
          element,
          socketEvent.action,
          socketEvent.value
        );

        setTimeout(sendDone, 100);
      } else {
        sendDone();
      }
    } catch (error) {
      let message = 'Unknown error';
      if (error instanceof Error) {
        message = error.message;
      }

      sendError(testID, message);
    }
  }
};

const sendEvent = (event: SOCKET_CLIENT_RESPONSE) =>
  owlClient.send(JSON.stringify(event));

const sendNotFound = (testID: string) =>
  sendEvent({ type: 'NOT_FOUND', testID });

const sendDone = () => sendEvent({ type: 'DONE' });

const sendError = (testID: string, message: string) =>
  sendEvent({ type: 'ERROR', testID, message });

/**
 * This function resolves the tracked element by its testID, so that we can handle events on it.
 * If the element is not immedietly available, we wait for it to be available for some time.
 */
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
