import WebSocket from 'ws';
import { Logger } from '../logger';
import { createWebSocketClient } from '../websocket';
import { ACTION, SOCKET_EVENT } from './types';

const logger = new Logger(true); // !!(process.env.OWL_DEBUG === 'true') || __DEV__);

let actionsClient: WebSocket;
let resolve: Function;
let reject: Function;

const sendEvent = async (action: ACTION, message?: string) => {
  if (actionsClient === undefined) {
    actionsClient = await createWebSocketClient(logger, handleMessage);
  }

  actionsClient.send(JSON.stringify({ action, message }));

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

export const tapOn = async (testId: string) => {
  return sendEvent('TAP', testId);
};
