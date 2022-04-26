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
      element.onPress?.();
      break;

    case 'CLEAR_TEXT':
      element.ref.current?.clear();
      break;

    case 'ENTER_TEXT':
      element.onChangeText?.(typeof value === 'undefined' ? '' : value);
      break;

    default:
      logger.error(`[OWL - Client] Action not supported ${action}`);
  }

  return undefined;
};
