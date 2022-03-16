import { WEBSOCKET_PORT } from "../constants";

import { Logger } from "../logger";

export const initWebSocket = (logger: Logger) => {
  // @ts-ignore
  const ws = new WebSocket(`ws://localhost:${WEBSOCKET_PORT}`);

  ws.onopen = () => {
    // connection opened
    ws.send('something'); // send a message
  };

  ws.onmessage = (e: { data: any }) => {
    // a message was received
    logger.info(`[OWL] Websocket onMessage: ${e.data}`);
  };

  ws.onerror = (e: { message: string }) => {
    // an error occurred
    logger.error(`[OWL] Websocket onError: ${e.message}`);
  };

  ws.onclose = (e: { message: string }) => {
    // connection closed
    logger.error(`[OWL] Websocket onError: ${e.message}`);
  };

  return ws;
};
