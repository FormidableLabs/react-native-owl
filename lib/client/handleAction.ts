import { GestureResponderEvent } from 'react-native';
import { ACTION, SOCKET_TYPE_VALUE } from '../actions/types';
import { Logger } from '../logger';
import { TrackedElementData } from './trackedElements';

const getGestureResponderEvent = (): GestureResponderEvent => ({
  nativeEvent: {
    changedTouches: [],
    identifier: 'OWL-identifier',
    locationX: 0,
    locationY: 0,
    pageX: 0,
    pageY: 0,
    target: 'OWL-target',
    timestamp: Date.now(),
    touches: [],
  },
  currentTarget: 0,
  target: 0,
  bubbles: false,
  cancelable: false,
  defaultPrevented: false,
  eventPhase: 0,
  isTrusted: true,
  preventDefault: () => {},
  isDefaultPrevented: () => false,
  stopPropagation: () => {},
  isPropagationStopped: () => false,
  persist: () => {},
  timeStamp: Date.now(),
  type: 'RCTView',
});

export const handleAction = (
  logger: Logger,
  testID: string,
  element: TrackedElementData,
  action: ACTION,
  value?: SOCKET_TYPE_VALUE
) => {
  logger.info(
    `[OWL - Client] Executing ${action} on element with testID ${testID}`
  );

  switch (action as ACTION) {
    case 'PRESS':
      if (!element.onPress) {
        throw new Error(`This element has no onPress prop`);
      }

      element.onPress(getGestureResponderEvent());
      break;

    case 'LONG_PRESS':
      if (!element.onLongPress) {
        throw new Error(`This element has no onLongPress prop`);
      }

      element.onLongPress(getGestureResponderEvent());
      break;

    case 'ENTER_TEXT':
      if (!element.onChangeText) {
        throw new Error(`This element has no onChangeText prop`);
      }

      element.onChangeText(
        typeof value === 'undefined' ? '' : value.toString()
      );
      break;

    case 'SCROLL_TO':
      if (!element.ref.current?.scrollTo) {
        throw new Error(`This element has no scrollTo method`);
      }

      if (
        typeof value !== 'object' ||
        (value.x === undefined && value.y === undefined)
      ) {
        throw new Error(`Value must include x and/or y properties`);
      }

      element.ref.current.scrollTo(value);
      break;

    case 'SCROLL_TO_END':
      if (!element.ref.current?.scrollToEnd) {
        throw new Error(`This element has no scrollToEnd method`);
      }

      element.ref.current.scrollToEnd();
      break;

    default:
      throw new Error(`Action '${action}' not supported `);
  }
};
