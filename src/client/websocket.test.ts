import { Logger } from '../logger';
import WS from 'jest-websocket-mock';
import { WEBSOCKET_PORT } from '../constants';
import { ANDROID_WS_HOST, IOS_WS_HOST } from './constants';

describe('websocket.ts', () => {
  const logger = new Logger(false);

  const onMessage = jest.fn();

  beforeEach(() => {
    onMessage.mockClear();
  });

  afterEach(() => {
    WS.clean();
  });

  it('should connect to the WS server and receive messages on iOS', async () => {
    const server = new WS(`ws://${IOS_WS_HOST}:${WEBSOCKET_PORT}`);

    await require('./websocket').initWebSocket(logger, 'ios', onMessage);

    await server.connected;

    server.send('data');

    expect(onMessage).toHaveBeenCalledWith('data');
  });

  it('should connect to the WS server and receive messages on Android', async () => {
    const server = new WS(`ws://${ANDROID_WS_HOST}:${WEBSOCKET_PORT}`);

    await require('./websocket').initWebSocket(logger, 'android', onMessage);

    await server.connected;

    server.send('data');

    expect(onMessage).toHaveBeenCalledWith('data');
  });

  it('should reject when failing to connect to a WS server', async () => {
    await expect(
      require('./websocket').initWebSocket(logger, 'ios', onMessage)
    ).rejects.toBeTruthy();
  });
});
