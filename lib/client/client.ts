// @ts-ignore
import React from 'react';
import { Logger } from '../logger';
import { CHECK_TIMEOUT, MAX_TIMEOUT } from './constants';
import { initWebSocket } from './rn-websocket';
import { ACTION, SOCKET_EVENT } from '../actions/types';

import { add, get, ElementActions } from './tracked-elements';

// @ts-ignore
const logger = new Logger(true); // !!(process.env.OWL_DEBUG === 'true') || __DEV__);

let automateTimeout: NodeJS.Timeout;
let isReactUpdating = true;

// @ts-ignore
let owlClient: WebSocket;

// @ts-ignore
const originalReactCreateElement = React.createElement;

const SOCKET_WAIT_TIMEOUT = 300;

export const initClient = () => {
  logger.info('Initialising OWL client');

  patchReact();
  waitForWebSocket();
};

const patchReact = () => {
  // @ts-ignore
  React.createElement = (...args) => {
    if (args[1]?.testID) {
      const testID = args[1].testID;

      // @ts-ignore
      const newRef = React.createRef();

      args[1].ref = newRef;
      // args[1].onLayout = (e) => testOnLayout(testID, e);

      add(logger, testID, {
        ref: newRef,
        onPress: args[1].onPress,
        // onChangeText: args[1].onChangeText,
      });
    }

    clearTimeout(automateTimeout);

    automateTimeout = setTimeout(() => {
      isReactUpdating = false;
    }, CHECK_TIMEOUT);

    isReactUpdating = true;

    return originalReactCreateElement(...args);
  };
}

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
      type === 'ACTION' ? handleAction(element, socketEvent.action) : undefined;

    sendEvent({ type: 'DONE', data });
  } catch {
    sendEvent({ type: 'NOT_FOUND' });
  }
};

const sendEvent = async (event: SOCKET_EVENT) => {
  owlClient.send(JSON.stringify(event));
};

const handleAction = (element: ElementActions, action: ACTION) => {
  switch (action as ACTION) {
    case 'TAP':
      element.onPress();
  }

  return undefined;
};

const getElementByTestId = async (testID: string): Promise<ElementActions> => {
  return new Promise((resolve, reject) => {
    logger.info(`Looking for Element with testID ${testID}`);

    const rejectTimeout = setTimeout(() => {
      const message = `Element with testID ${testID} not found`;

      clearInterval(checkInterval);
      reject(new Error(message));
    }, MAX_TIMEOUT);

    const checkInterval = setInterval(() => {
      if (isReactUpdating || get(testID) == null) {
        return;
      }

      clearInterval(checkInterval);
      clearTimeout(rejectTimeout);
      resolve(get(testID));
    }, CHECK_TIMEOUT);
  });
};
