import WebSocket from 'ws';
import { Logger } from '../logger';
import { createWebSocketClient } from '../websocket';
import { SOCKET_EVENT } from './types';

const logger = new Logger(process.env.OWL_DEBUG === 'true');

let actionsClient: WebSocket | undefined;
let resolve: Function;
let reject: Function;

const sendEvent = async (event: SOCKET_EVENT) => {
  if (actionsClient === undefined) {
    actionsClient = await createWebSocketClient(logger, handleMessage);
  }

  actionsClient.send(JSON.stringify(event));

  return new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
};

const handleMessage = (message: string) => {
  const event = JSON.parse(message) as SOCKET_EVENT;

  switch (event.type) {
    case 'DONE':
      resolve(event.data);
      return;
    case 'NOT_FOUND':
      reject(new Error(`Element not found: ${event.testID}`));
      return;
    case 'ERROR':
      reject(new Error(`Element error: ${event.testID} - ${event.message}`));
      return;
  }
};

export const tapOn = async (testID: string) =>
  sendEvent({ type: 'ACTION', action: 'TAP', testID });

export const clearText = async (testID: string) =>
  sendEvent({ type: 'ACTION', action: 'CLEAR_TEXT', testID });

export const enterText = async (testID: string, value: string) =>
  sendEvent({ type: 'ACTION', action: 'ENTER_TEXT', testID, value });

export const toExist = async (testID: string) =>
  sendEvent({ type: 'LAYOUT', action: 'EXISTS', testID });

export const getLayoutSize = async (testID: string) =>
  sendEvent({ type: 'LAYOUT', action: 'SIZE', testID });

export const disconnectServer = () => {
  actionsClient?.close();

  actionsClient = undefined;
};
