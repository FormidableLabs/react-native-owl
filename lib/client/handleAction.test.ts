import { Logger } from '../logger';
import { handleAction } from './handleAction';

describe('handleAction.ts', () => {
  const logger = new Logger(false);

  it('throw error on unsupported action', () => {
    const test = () =>
      handleAction(
        logger,
        'testID',
        {
          ref: { current: null },
        },
        // @ts-ignore
        'UNSUPPORTED'
      );

    expect(test).toThrow();
  });

  describe('PRESS', () => {
    it('throw error when onPress prop is not available', () => {
      const test = () =>
        handleAction(
          logger,
          'testID',
          {
            ref: { current: null },
          },
          'PRESS'
        );

      expect(test).toThrow();
    });

    it('calls onPress function', () => {
      const onPress = jest.fn();

      handleAction(
        logger,
        'testID',
        {
          ref: { current: null },
          onPress,
        },
        'PRESS'
      );

      expect(onPress).toHaveBeenCalled();
    });
  });

  describe('LONG_PRESS', () => {
    it('throw error when onLongPress prop is not available', () => {
      const test = () =>
        handleAction(
          logger,
          'testID',
          {
            ref: { current: null },
          },
          'LONG_PRESS'
        );

      expect(test).toThrow();
    });

    it('calls onLongPress function', () => {
      const onLongPress = jest.fn();

      handleAction(
        logger,
        'testID',
        {
          ref: { current: null },
          onLongPress,
        },
        'LONG_PRESS'
      );

      expect(onLongPress).toHaveBeenCalled();
    });
  });

  describe('CHANGE_TEXT', () => {
    it('throw error when onChangeText prop is not available', () => {
      const test = () =>
        handleAction(
          logger,
          'testID',
          {
            ref: { current: null },
          },
          'CHANGE_TEXT'
        );

      expect(test).toThrow();
    });

    it('calls onLongPress function', () => {
      const onChangeText = jest.fn();

      handleAction(
        logger,
        'testID',
        {
          ref: { current: null },
          onChangeText,
        },
        'CHANGE_TEXT'
      );

      expect(onChangeText).toHaveBeenCalledWith('');
    });

    it('calls onLongPress function with value', () => {
      const onChangeText = jest.fn();

      handleAction(
        logger,
        'testID',
        {
          ref: { current: null },
          onChangeText,
        },
        'CHANGE_TEXT',
        'test text'
      );

      expect(onChangeText).toHaveBeenCalledWith('test text');
    });
  });

  describe('SCROLL_TO', () => {
    it('throw error when scrollTo method is not available', () => {
      const test = () =>
        handleAction(
          logger,
          'testID',
          {
            ref: { current: null },
          },
          'SCROLL_TO'
        );

      expect(test).toThrow();
    });

    it('throw error when value is not set', () => {
      const scrollTo = jest.fn();
      const test = () =>
        handleAction(
          logger,
          'testID',
          {
            ref: { current: { scrollTo } },
          },
          'SCROLL_TO'
        );

      expect(test).toThrow();
    });

    it('calls scrollTo method', () => {
      const scrollTo = jest.fn();

      handleAction(
        logger,
        'testID',
        {
          ref: { current: { scrollTo } },
        },
        'SCROLL_TO',
        { y: 100 }
      );

      expect(scrollTo).toHaveBeenCalledWith({ y: 100, animated: false });
    });
  });

  describe('SCROLL_TO_END', () => {
    it('throw error when scrollToEnd method is not available', () => {
      const test = () =>
        handleAction(
          logger,
          'testID',
          {
            ref: { current: null },
          },
          'PRESS'
        );

      expect(test).toThrow();
    });

    it('calls scrollToEnd method', () => {
      const scrollToEnd = jest.fn();

      handleAction(
        logger,
        'testID',
        {
          ref: { current: { scrollToEnd } },
        },
        'SCROLL_TO_END'
      );

      expect(scrollToEnd).toHaveBeenCalled();
    });
  });
});
