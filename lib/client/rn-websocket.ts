import { Platform } from 'react-native';
import { WEBSOCKET_PORT } from '../constants';

import { Logger } from '../logger';

export const initWebSocket = (
  logger: Logger,
  onMessage: (message: string) => void
): Promise<WebSocket> => {
  const ipAddress = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';

  let canShowErrorMessage = false;

  // @ts-ignore
  const ws = new WebSocket(`ws://${ipAddress}:${WEBSOCKET_PORT}`);

  return new Promise((resolve, reject) => {
    ws.onopen = () => {
      ws.send('OWL Client Connected!');
      canShowErrorMessage = true;
      resolve(ws);
    };

    ws.onmessage = (e: { data?: any }) => {
      logger.info(`[OWL] Websocket onMessage: ${e.data}`);

      onMessage(e.data.toString());
    };

    ws.onerror = (e: { message: string }) => {
      if (canShowErrorMessage) {
        logger.info(`[OWL] Websocket onError: ${e.message}`);
      }
    };

    ws.onclose = (e: { message?: string }) => {
      if (canShowErrorMessage) {
        logger.info(`[OWL] Websocket onClose: ${e.message}`);
      }

      reject(e);
    };
  });
};
