import { WebSocketServer } from 'ws';

import { Logger } from './logger';

export const startWebSocketServer = async (
  logger: Logger
): Promise<WebSocketServer> => {
  const port = 8123;
  const wss = new WebSocketServer({ port });

  return new Promise((resolve, reject) => {
    wss.on('connection', (ws) => {
      logger.info(`[OWL] Client connected to WebSocket.`);

      ws.on('message', (message) => {
        logger.info(`[OWL] Received a message on the WebSocket:`, message);
      });

      ws.on('error', (error) => {
        logger.info(`[OWL] Error on the WebSocket:`, error);
      });
    });

    wss.on('listening', (asd: any) => {
      logger.info(`[OWL] WebSocket now listening on port ${wss.options.port}`);

      return resolve(wss);
    });
  });
};
