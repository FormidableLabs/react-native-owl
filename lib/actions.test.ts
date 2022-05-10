import {
  changeText,
  longPress,
  press,
  scrollTo,
  scrollToEnd,
  toExist,
} from './actions';
import * as websocket from './websocket';

describe('actions.ts', () => {
  let onMessageCallback: (onMessage: (message: string) => void) => void;
  const send = jest.fn();
  const close = jest.fn();

  jest.spyOn(websocket, 'createWebSocketClient').mockImplementation(
    // @ts-ignore
    (logger, onMessage) => {
      onMessageCallback(onMessage);

      return Promise.resolve({ send, close });
    }
  );

  beforeEach(() => {
    jest.clearAllMocks();

    onMessageCallback = (onMessage: (message: string) => void) => {
      setTimeout(() =>
        onMessage(
          JSON.stringify({
            type: 'DONE',
          })
        )
      );
    };
  });

  describe('general onMessage handling', () => {
    it('resolves when client sends DONE', async () => {
      await press('testID');

      expect(send).toHaveBeenCalledWith(
        JSON.stringify({ type: 'ACTION', action: 'PRESS', testID: 'testID' })
      );

      expect(close).toHaveBeenCalledTimes(1);
    });

    it('rejects when client sends NOT_FOUND', async () => {
      onMessageCallback = (onMessage: (message: string) => void) => {
        setTimeout(() =>
          onMessage(
            JSON.stringify({
              type: 'NOT_FOUND',
              testID: 'testID',
            })
          )
        );
      };

      expect(async () => {
        await press('testID');
      }).rejects.toBeTruthy();
    });

    it('rejects when client sends ERROR', async () => {
      onMessageCallback = (onMessage: (message: string) => void) => {
        setTimeout(() =>
          onMessage(
            JSON.stringify({
              type: 'ERROR',
              testID: 'testID',
            })
          )
        );
      };

      expect(async () => {
        await press('testID');
      }).rejects.toBeTruthy();
    });

    it('rejects when client sends an unknown event', async () => {
      onMessageCallback = (onMessage: (message: string) => void) => {
        setTimeout(() =>
          onMessage(
            JSON.stringify({
              type: 'UNKNOWN',
              testID: 'testID',
            })
          )
        );
      };

      expect(async () => {
        await press('testID');
      }).rejects.toBeTruthy();
    });
  });

  describe('actions', () => {
    it('sends press event', async () => {
      await press('testID');

      expect(send).toHaveBeenCalledWith(
        JSON.stringify({ type: 'ACTION', action: 'PRESS', testID: 'testID' })
      );
    });

    it('sends longPress event', async () => {
      await longPress('testID');

      expect(send).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'ACTION',
          action: 'LONG_PRESS',
          testID: 'testID',
        })
      );
    });

    it('sends changeText event', async () => {
      await changeText('testID', 'text');

      expect(send).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'ACTION',
          action: 'CHANGE_TEXT',
          testID: 'testID',
          value: 'text',
        })
      );
    });

    it('sends scrollTo event', async () => {
      await scrollTo('testID', { y: 10 });

      expect(send).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'ACTION',
          action: 'SCROLL_TO',
          testID: 'testID',
          value: { y: 10 },
        })
      );
    });

    it('sends scrollToEnd event', async () => {
      await scrollToEnd('testID');

      expect(send).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'ACTION',
          action: 'SCROLL_TO_END',
          testID: 'testID',
        })
      );
    });

    it('sends toExist event', async () => {
      await toExist('testID');

      expect(send).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'LAYOUT',
          action: 'EXISTS',
          testID: 'testID',
        })
      );
    });
  });
});
