import WebSocket from 'ws';

import { createWebSocketClient, startWebSocketServer } from './websocket';
import { Logger } from './logger';
import { waitFor } from './utils/wait-for';

describe('websocket.ts', () => {
  let wsServer: WebSocket.Server;
  let wsClient: WebSocket;

  const clientLogger = new Logger();
  const serverLogger = new Logger();

  const mockClientLoggerInfo = jest.spyOn(clientLogger, 'info');
  const mockServerLoggerInfo = jest.spyOn(serverLogger, 'info');

  beforeEach(async () => {
    wsServer = await startWebSocketServer(serverLogger);
    wsClient = await createWebSocketClient(clientLogger);
  });

  afterEach(() => {
    wsServer.close();
    wsClient.close();
  });

  it('should start the server and send a message', async () => {
    await wsClient.ping();

    await wsClient.send('Hello!');

    await waitFor(5);

    expect(mockServerLoggerInfo).toHaveBeenNthCalledWith(
      1,
      '[OWL] WebSocket now listening on port 8123.'
    );
    expect(mockServerLoggerInfo).toHaveBeenNthCalledWith(
      2,
      '[OWL] A client has been connected to WebSocket.'
    );
    expect(mockServerLoggerInfo).toHaveBeenNthCalledWith(
      3,
      '[OWL] Received a message on the WebSocket: Hello!'
    );

    expect(mockClientLoggerInfo).toHaveBeenNthCalledWith(
      1,
      '[OWL] This client connected to WebSocket.'
    );
    expect(mockClientLoggerInfo).toHaveBeenNthCalledWith(
      2,
      '[OWL] The client received a pong.'
    );

    wsClient.close();
  });
});
