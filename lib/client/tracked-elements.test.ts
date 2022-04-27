import React from 'react';
import { Logger } from '../logger';
import { add, exists, get } from './tracked-elements';

describe('tracked-elements.ts', () => {
  const logger = new Logger(false);

  it('should return check for and return elements that have been added', () => {
    const testElement = { ref: React.createRef() };

    expect(exists('testId')).toBe(false);
    expect(get('testId')).toBeFalsy();

    add(logger, 'testId', testElement);

    expect(exists('testId')).toBe(true);
    expect(get('testId')).toEqual(testElement);
  });
});
