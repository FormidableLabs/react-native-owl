import WebSocket from 'ws';
import { Logger } from '../logger';
import { createWebSocketClient } from '../websocket';
import { SOCKET_EVENT } from './types';

const logger = new Logger(true); // !!(process.env.OWL_DEBUG === 'true') || __DEV__);

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
      resolve();
    case 'NOT_FOUND':
      reject(new Error('Element not found'));
  }
};

export const tapOn = async (testID: string) => {
  return sendEvent({ type: 'ACTION', action: 'TAP', testID });
};

export const disconnectServer = () => {
  actionsClient?.close();

  actionsClient = undefined;
};
