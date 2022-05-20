import { WEBSOCKET_PORT } from '../constants';

import { Logger } from '../logger';
import { ANDROID_WS_HOST, IOS_WS_HOST } from './constants';

/**
 * Create a connection to the websocket server,
 * and call the onMessage callback when it receives any messages.
 */
export const initWebSocket = (
  logger: Logger,
  platform: 'android' | 'ios',
  onMessage: (message: string) => void
): Promise<WebSocket> => {
  const ipAddress = platform === 'android' ? ANDROID_WS_HOST : IOS_WS_HOST;

  const ws = new WebSocket(`ws://${ipAddress}:${WEBSOCKET_PORT}`);

  return new Promise((resolve, reject) => {
    ws.onopen = () => {
      logger.info('[OWL - Websocket] onopen');

      ws.send('OWL Client Connected!');

      resolve(ws);
    };

    ws.onmessage = (e) => {
      logger.info(`[OWL - Websocket] onmessage: ${e.data}`);

      onMessage(e.data.toString());
    };

    ws.onerror = (e) => {
      logger.info(`[OWL - Websocket] onerror: ${e.message}`);
    };

    ws.onclose = (e) => {
      logger.info(`[OWL - Websocket] onclose: ${e.reason}`);

      reject(e);
    };
  });
};
