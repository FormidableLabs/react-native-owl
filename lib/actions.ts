import { Logger } from './logger';
import { createWebSocketClient } from './websocket';
import {
  SOCKET_TEST_REQUEST,
  SOCKET_SCROLL_TO_VALUE,
  SOCKET_CLIENT_RESPONSE,
} from './websocketTypes';

const logger = new Logger(process.env.OWL_DEBUG === 'true');

const sendEvent = async (event: SOCKET_TEST_REQUEST) =>
  new Promise(async (resolve, reject) => {
    // Create a websocket client just for this event request/response cycle.
    const actionsWebSocketClient = await createWebSocketClient(
      logger,
      (message) => {
        // Close this connection
        actionsWebSocketClient.close();

        // The message received here indicates the outcome of the action we sent to the app client
        const event = JSON.parse(message) as SOCKET_CLIENT_RESPONSE;

        switch (event.type) {
          case 'DONE':
            resolve(true);
            break;
          case 'NOT_FOUND':
            reject(`Element not found: ${event.testID}`);
            break;
          case 'ERROR':
            reject(`Element error: ${event.testID} - ${event.message}`);
            break;
          default:
            reject('Unknown onMessage event type');
            break;
        }
      }
    );

    actionsWebSocketClient.send(JSON.stringify(event));
  });

export const press = (testID: string) =>
  sendEvent({ type: 'ACTION', action: 'PRESS', testID });

export const longPress = (testID: string) =>
  sendEvent({ type: 'ACTION', action: 'LONG_PRESS', testID });

export const changeText = (testID: string, value: string) =>
  sendEvent({ type: 'ACTION', action: 'CHANGE_TEXT', testID, value });

export const scrollTo = (testID: string, value: SOCKET_SCROLL_TO_VALUE) =>
  sendEvent({ type: 'ACTION', action: 'SCROLL_TO', testID, value });

export const scrollToEnd = (testID: string) =>
  sendEvent({ type: 'ACTION', action: 'SCROLL_TO_END', testID });

export const toExist = (testID: string) =>
  sendEvent({ type: 'LAYOUT', action: 'EXISTS', testID });
