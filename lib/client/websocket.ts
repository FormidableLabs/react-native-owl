import { Platform } from 'react-native';
import { WEBSOCKET_PORT } from '../constants';

import { Logger } from '../logger';

export const initWebSocket = (
  logger: Logger,
  onMessage: (message: string) => void
): Promise<WebSocket> => {
  const ipAddress = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

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
