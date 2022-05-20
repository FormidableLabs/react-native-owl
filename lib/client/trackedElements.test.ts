import { Logger } from '../logger';
import { add, get } from './trackedElements';

describe('trackedElements.ts', () => {
  const logger = new Logger(false);

  it('should check for and return elements that have been added', () => {
    const testElement = { ref: { current: null } };

    expect(get('testId')).toBeFalsy();

    add(logger, 'testId', testElement);

    expect(get('testId')).toEqual(testElement);
  });
});
