import WebSocket from 'ws';

import { createWebSocketClient, startWebSocketServer } from './websocket';
import { Logger } from './logger';
import { waitFor } from './utils/wait-for';

describe('websocket.ts', () => {
  let wsServer: WebSocket.Server;
  let wsClient1: WebSocket;
  let wsClient2: WebSocket;

  const serverLogger = new Logger();
  const client1Logger = new Logger();
  const client2Logger = new Logger();

  const mockServerLoggerInfo = jest.spyOn(serverLogger, 'info');
  const mockClient1LoggerInfo = jest.spyOn(client1Logger, 'info');
  const mockClient2LoggerInfo = jest.spyOn(client2Logger, 'info');

  const mockOnMessage = jest.fn(() => {});

  beforeEach(async () => {
    mockServerLoggerInfo.mockReset();
    mockClient1LoggerInfo.mockReset();
    mockClient2LoggerInfo.mockReset();
    mockOnMessage.mockReset();

    wsServer = await startWebSocketServer(serverLogger);
    wsClient1 = await createWebSocketClient(client1Logger, mockOnMessage);
    wsClient2 = await createWebSocketClient(client2Logger, mockOnMessage);
  });

  afterEach(() => {
    wsServer.close();
    wsClient1.close();
    wsClient2.close();
  });

  it('should start the server and accept client connections', async () => {
    await waitFor(5);

    expect(mockServerLoggerInfo).toHaveBeenNthCalledWith(
      1,
      '[OWL] WebSocket now listening on port 8123.'
    );
    expect(mockServerLoggerInfo).toHaveBeenNthCalledWith(
      2,
      '[OWL] A client has been connected to WebSocket.'
    );
  });

  it('should forward messages to other clients', async () => {
    await wsClient1.send('Hello!');

    await waitFor(5);

    // We are just checking that client1 did not receive the message,
    // and that client2 did.
    // We are not concerned with the order of the logger calls.
    expect(
      mockClient1LoggerInfo.mock.calls.some(
        (call) => call[0] === '[OWL] The client received a message: Hello!.'
      )
    ).toBeFalsy();

    expect(
      mockClient2LoggerInfo.mock.calls.some(
        (call) => call[0] === '[OWL] The client received a message: Hello!.'
      )
    ).toBeTruthy();
  });

  it('should use the onMessage handler', async () => {
    await wsClient1.send('Hello!');

    await waitFor(5);

    // Check that the onMessage callback was used
    expect(mockOnMessage).toHaveBeenCalledTimes(1);
    expect(mockOnMessage).toHaveBeenCalledWith('Hello!');
  });
});
