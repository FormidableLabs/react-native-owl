import WebSocket from 'ws';
import { Logger } from '../logger';
import { createWebSocketClient } from '../websocket';
import { ACTION } from './types';

const logger = new Logger(true); // !!(process.env.OWL_DEBUG === 'true') || __DEV__);

let actionsClient: WebSocket;

const sendEvent = async (action: ACTION, message?: string) => {
  if (actionsClient === undefined) {
    actionsClient = await createWebSocketClient(logger, handleMessage);
  }

  actionsClient.send(JSON.stringify({ action, message }));
};

const handleMessage = (message: string) => {
  console.info('response received', message);
};

export const tapOn = async (testId: string) => {
  await sendEvent('TAP', testId);

  return new Promise(() => {});
};
