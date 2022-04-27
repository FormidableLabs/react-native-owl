import { Logger } from '../logger';
import { initWebSocket } from './websocket';
import WS from 'jest-websocket-mock';
import { WEBSOCKET_PORT } from '../constants';

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

describe('websocket.ts', () => {
  const logger = new Logger(false);

  const onMessage = jest.fn();

  beforeEach(() => {
    onMessage.mockClear();
  });

  afterEach(() => {
    WS.clean();
  });

  it('should connect to the WS server and receive messages', async () => {
    const server = new WS(`ws://localhost:${WEBSOCKET_PORT}`);

    await initWebSocket(logger, onMessage);

    await server.connected;

    server.send('data');

    expect(onMessage).toHaveBeenCalledWith('data');
  });

  it('should reject when failing to connect to a WS server', async () => {
    await expect(initWebSocket(logger, onMessage)).rejects.toBeTruthy();
  });
});
