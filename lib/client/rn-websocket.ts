import WebSocket from 'ws';
import { WEBSOCKET_PORT } from '../constants';

import { Logger } from '../logger';

export const initWebSocket = (
  logger: Logger,
  onMessage: (message: string) => void
): Promise<WebSocket> => {
  let canShowErrorMessage = false;

  const ws = new WebSocket(`ws://localhost:${WEBSOCKET_PORT}`);

  return new Promise((resolve, reject) => {
    ws.onopen = () => {
      ws.send('OWL Client Connected!');
      canShowErrorMessage = true;
      resolve(ws);
    };

    ws.onmessage = (e: { data: any }) => {
      logger.info(`[OWL] Websocket onMessage: ${e.data}`);

      onMessage(e.data.toString());
    };

    ws.onerror = (e: { message: string }) => {
      if (canShowErrorMessage) {
        logger.info(`[OWL] Websocket onError: ${e.message}`);
      }
    };

    ws.onclose = (e: { reason: string }) => {
      if (canShowErrorMessage) {
        logger.info(`[OWL] Websocket onClose: ${e.reason}`);
      }

      reject(e);
    };
  });
};
