import type { GestureResponderEvent } from 'react-native';
import type {
  SOCKET_TEST_ACTION,
  SOCKET_TEST_REQUEST_VALUE,
} from '../websocketTypes';
import { Logger } from '../logger';
import type { TrackedElementData } from './trackedElements';

/**
 * When we call onPress/onLongPress, the function expects an `event` arg of type `GestureResponderEvent`.
 * To try to prevent errors in where the onPress/onLongPress function uses the event data, we create some mock event data.
 */
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
  // @ts-expect-error - We're mocking the event object, so we don't need to match the full type
  currentTarget: 0,
  // @ts-expect-error - We're mocking the event object, so we don't need to match the full type
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

/**
 * This function handles the individual actions that are requested in the jest tests.
 * For each action, we first check that we have the method and value required to perform the action.
 * Then we perform it, normally by calling the callback being used for a specific element prop,
 * or by calling a method on the element's ref.
 * The thrown error message will be displayed in the jest test results.
 */
export const handleAction = (
  logger: Logger,
  testID: string,
  element: TrackedElementData,
  action: SOCKET_TEST_ACTION,
  value?: SOCKET_TEST_REQUEST_VALUE
) => {
  logger.info(
    `[OWL - Client] Executing ${action} on element with testID ${testID}`
  );

  switch (action) {
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

    case 'CHANGE_TEXT':
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

      element.ref.current.scrollTo({ ...value, animated: false });
      break;

    case 'SCROLL_TO_END':
      if (!element.ref.current?.scrollToEnd) {
        throw new Error(`This element has no scrollToEnd method`);
      }

      element.ref.current.scrollToEnd({ animated: false });
      break;

    default:
      throw new Error(`Action '${action}' not supported `);
  }
};
