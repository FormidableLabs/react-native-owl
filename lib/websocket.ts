import WebSocket from 'ws';
import { WEBSOCKET_PORT } from './constants';

import { Logger } from './logger';

export const startWebSocketServer = async (
  logger: Logger
): Promise<WebSocket.Server> => {
  const wss = new WebSocket.Server({ port: WEBSOCKET_PORT });

  return new Promise((resolve) => {
    wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        logger.info(
          `[OWL - WebSocket] The server received a message: ${message.toString()}`
        );

        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message.toString());
          }
        });
      });

      ws.on('error', (error) => {
        logger.error(`[OWL - WebSocket] Error:`, error);
      });
    });

    wss.on('listening', () => {
      logger.info(`[OWL - WebSocket] Listening on port ${wss.options.port}.`);

      return resolve(wss);
    });

    wss.on('error', (error) => {
      logger.error(`[OWL - WebSocket] Error:`, error);
    });

    wss.on('close', () => {
      logger.error(`[OWL - WebSocket] Closed`);
    });
  });
};

export const createWebSocketClient = async (
  logger: Logger,
  onMessage: (message: string) => void
): Promise<WebSocket> => {
  const wsClient = new WebSocket(`ws://localhost:${WEBSOCKET_PORT}`);

  return new Promise((resolve) => {
    wsClient.on('open', () => {
      logger.info(`[OWL - WebSocket] Client connected.`);

      resolve(wsClient)
    });

    wsClient.on('message', (message) => {
      logger.info(
        `[OWL - WebSocket] The client received a message: ${message.toString()}.`
      );

      onMessage(message.toString());
    });
  });
};
