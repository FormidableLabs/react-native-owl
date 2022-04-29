import React from 'react';
import { Platform } from 'react-native';
import { Logger } from '../logger';
import { CHECK_TIMEOUT, MAX_TIMEOUT, SOCKET_WAIT_TIMEOUT } from './constants';
import { initWebSocket } from './websocket';
import { SOCKET_CLIENT_RESPONSE, SOCKET_TEST_REQUEST } from '../websocketTypes';

import { add, get, TrackedElementData } from './trackedElements';
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
 * Based on an elements props, store element tracking data and return updated props
 */
export const applyElementTracking = (
  props: any
): {
  [key: string]: any;
  ref?: React.RefObject<unknown>;
  showsHorizontalScrollIndicator: false;
  showsVerticalScrollIndicator: false;
} => {
  const testID = props?.testID;

  const returnProps = {
    ...props,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
  };

  if (!testID) {
    return returnProps;
  }

  const existingTrackedElement = get(testID);

  const ref =
    (props?.ref as React.RefObject<unknown> | undefined) || React.createRef();

  // Either use the already tracked data, if we have any, otherwise create new tracking data
  const trackData: TrackedElementData = existingTrackedElement || {
    ref,
    onPress: props?.onPress,
    onLongPress: props?.onLongPress,
    onChangeText: props?.onChangeText,
    testCallbacks: props?.owlTestCallbacks,
  };

  add(logger, testID, trackData);

  return {
    ...returnProps,
    ref,
  };
};

/**
 * We patch react so that we can maintain a list of elements that have testID's
 * We can then use this list to find the element when we receive an action
 */
export const patchReact = () => {
  const originalReactCreateElement: typeof React.createElement =
    React.createElement;
  let automateTimeout: number;

  // @ts-ignore
  React.createElement = (type, props, ...children) => {
    const newProps = applyElementTracking(props);

    clearTimeout(automateTimeout);

    automateTimeout = setTimeout(() => {
      isReactUpdating = false;
    }, CHECK_TIMEOUT);

    isReactUpdating = true;

    return originalReactCreateElement(type, newProps, ...children);
  };
};

/**
 * The app might launch before the OWL server starts, so we need to keep trying...
 */
export const waitForWebSocket = async () => {
  try {
    owlClient = await initWebSocket(
      logger,
      Platform.OS === 'android' ? 'android' : 'ios',
      handleMessage
    );

    logger.info('[OWL - Websocket] Connection established');
  } catch {
    setTimeout(waitForWebSocket, SOCKET_WAIT_TIMEOUT);
  }
};

/**
 * When we receive a message, we need to find the element that corresponds to the testID,
 * then attempt to handle the requested action on it.
 */
export const handleMessage = async (message: string) => {
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
      const element = get(testID);
      if (isReactUpdating || !element) {
        return;
      }

      logger.info(`[OWL - Client] ✓ found`);

      clearInterval(checkInterval);
      clearTimeout(rejectTimeout);
      resolve(element);
    }, CHECK_TIMEOUT);
  });
