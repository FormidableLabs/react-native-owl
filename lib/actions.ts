import WebSocket from 'ws';
import { Logger } from './logger';
import { createWebSocketClient } from './websocket';
import {
  SOCKET_TEST_REQUEST,
  SOCKET_SCROLL_TO_VALUE,
  SOCKET_CLIENT_RESPONSE,
} from './websocketTypes';

const logger = new Logger(process.env.OWL_DEBUG === 'true');

let actionsWebSocketClient: WebSocket | undefined;
let resolve: (value: unknown) => void;
let reject: (reason?: any) => void;

const sendEvent = async (event: SOCKET_TEST_REQUEST) => {
  // Make sure we have a websocket client setup
  if (actionsWebSocketClient === undefined) {
    actionsWebSocketClient = await createWebSocketClient(logger, handleMessage);
  }

  actionsWebSocketClient.send(JSON.stringify(event));

  return new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
};

const handleMessage = (message: string) => {
  // The message received here indicates the outcome of the action we sent to the app client
  const event = JSON.parse(message) as SOCKET_CLIENT_RESPONSE;

  switch (event.type) {
    case 'DONE':
      resolve(true);
      break;
    case 'NOT_FOUND':
      reject(new Error(`Element not found: ${event.testID}`));
      break;
    case 'ERROR':
      reject(new Error(`Element error: ${event.testID} - ${event.message}`));
      break;
  }
};

export const press = (testID: string) =>
  sendEvent({ type: 'ACTION', action: 'PRESS', testID });

export const longPress = (testID: string) =>
  sendEvent({ type: 'ACTION', action: 'LONG_PRESS', testID });

export const enterText = (testID: string, value: string) =>
  sendEvent({ type: 'ACTION', action: 'ENTER_TEXT', testID, value });

export const scrollTo = (testID: string, value: SOCKET_SCROLL_TO_VALUE) =>
  sendEvent({ type: 'ACTION', action: 'SCROLL_TO', testID, value });

export const scrollToEnd = (testID: string) =>
  sendEvent({ type: 'ACTION', action: 'SCROLL_TO_END', testID });

export const toExist = (testID: string) =>
  sendEvent({ type: 'LAYOUT', action: 'EXISTS', testID });

export const disconnectServer = () => {
  actionsWebSocketClient?.close();

  actionsWebSocketClient = undefined;
};
