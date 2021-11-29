import WebSocket from 'ws';

import { Logger } from './logger';

const port = 8123;

export const startWebSocketServer = async (
  logger: Logger
): Promise<WebSocket.Server> => {
  const wss = new WebSocket.Server({ port });

  return new Promise((resolve) => {
    wss.on('connection', (ws) => {
      logger.info(`[OWL] A client has been connected to WebSocket.`);

      ws.on('message', (message) => {
        logger.info(
          `[OWL] Received a message on the WebSocket: ${message.toString()}`
        );
      });

      ws.on('error', (error) => {
        logger.error(`[OWL] Error on the WebSocket:`, error);
      });
    });

    wss.on('listening', (asd: any) => {
      logger.info(`[OWL] WebSocket now listening on port ${wss.options.port}.`);

      return resolve(wss);
    });
  });
};

export const createWebSocketClient = async (
  logger: Logger
): Promise<WebSocket> => {
  const wsClient = new WebSocket(`ws://localhost:${port}`);

  return new Promise((resolve) => {
    wsClient.on('open', () => {
      logger.info(`[OWL] This client connected to WebSocket.`);
      return resolve(wsClient);
    });

    wsClient.on('pong', () => {
      logger.info(`[OWL] The client received a pong.`);
    });
  });
};
