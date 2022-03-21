// @ts-ignore
import React from 'react';
import { Logger } from '../logger';
import { CHECK_TIMEOUT, MAX_TIMEOUT } from './constants';
import { initWebSocket } from './rn-websocket';
import { ACTION } from '../actions/types';

import { get, exists, add, ElementActions } from './tracked-elements';

// @ts-ignore
const logger = new Logger(true); // !!(process.env.OWL_DEBUG === 'true') || __DEV__);

let automateTimeout: NodeJS.Timeout;
let isReactUpdating = true;
const SOCKET_WAIT_TIMEOUT = 300;

export const initClient = async () => {
  logger.info('Initialising OWL client');

  patchReacth();
  waitForWebSocket();
};

const patchReacth = () => {
  // @ts-ignore
  const originalReactCreateElement = React.createElement;

  // @ts-ignore
  React.createElement = (...args) => {
    if (args[1]?.testID) {
      const testID = args[1].testID;

      if (!exists(testID)) {
        // @ts-ignore
        const newRef = React.createRef();

        args[1].ref = newRef;
        // args[1].onLayout = (e) => testOnLayout(testID, e);

        add(testID, {
          ref: newRef,
          onPress: args[1].onPress,
          // onChangeText: args[1].onChangeText,
        });
      }
    }

    clearTimeout(automateTimeout);

    automateTimeout = setTimeout(() => {
      isReactUpdating = false;
    }, CHECK_TIMEOUT);

    isReactUpdating = true;

    return originalReactCreateElement(...args);
  };
};

/**
 * The app might launch before the OWL server starts, so we need to keep trying...
 */
const waitForWebSocket = async () => {
  try {
    const client = await initWebSocket(logger, handleMessage);

    logger.info('[OWL] Connection established');

    // @ts-ignore
    global.__owl_client = client;
  } catch {
    setTimeout(waitForWebSocket, SOCKET_WAIT_TIMEOUT);
  }
};

const handleMessage = async (message: string) => {
  const { action, testID } = JSON.parse(message);
  const element = await getElementByTestId(testID);

  switch (action as ACTION) {
    case 'TAP':
      element.onPress();
  }
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
