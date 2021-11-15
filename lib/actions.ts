import { Logger } from './logger';
import { OwlElement } from './types';

/**
 * Gets an element that as the specified id.
 * @param testId - Required. The filename(excluding the extension) that will be used to save the screenshot. ie. 'homepage'
 * @returns the instance of the element
 */
export const tap = async (
  element: OwlElement,
  logger: Logger
): Promise<void> => {
  logger.info('Will tap on element:', element);
};
