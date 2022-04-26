import { ACTION } from '../actions/types';
import { Logger } from '../logger';
import { ElementActions } from './tracked-elements';

export const handleAction = (
  logger: Logger,
  testID: string,
  element: ElementActions,
  action: ACTION,
  value?: string
) => {
  logger.info(
    `[OWL - Client] Executing ${action} on element with testID ${testID}`
  );

  switch (action as ACTION) {
    case 'TAP':
      if (element.onPress) {
        element.onPress();
      } else {
        throw new Error(`This element has no onPress prop`);
      }
      break;

    case 'CLEAR_TEXT':
      if (element.ref.current?.clear) {
        element.ref.current.clear();
      } else {
        throw new Error(`This element has no clear method`);
      }
      break;

    case 'ENTER_TEXT':
      if (element.onChangeText) {
        element.onChangeText(typeof value === 'undefined' ? '' : value);
      } else {
        throw new Error(`This element has no onChangeText prop`);
      }
      break;

    default:
      throw new Error(`Action not supported ${action}`);
  }

  return undefined;
};
