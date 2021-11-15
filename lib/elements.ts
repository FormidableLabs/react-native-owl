import { Logger } from './logger';
import { OwlElement } from './types';
import { tap } from './actions';

/**
 * Gets an element that as the specified id.
 * @param testId - Required. The filename(excluding the extension) that will be used to save the screenshot. ie. 'homepage'
 * @returns the instance of the element
 */
export const getByTestId = (testId: string): OwlElement => {
  const debug = process.env.OWL_DEBUG === 'true';
  const logger = new Logger(!!debug);

  logger.info('Getting Element:', testId);

  const element: OwlElement = {} as any; /** FIXME */

  return {
    tap: async () => tap(element, logger),
  };
};
