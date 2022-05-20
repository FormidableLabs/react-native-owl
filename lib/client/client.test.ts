import React from 'react';

describe('client.ts', () => {
  jest.mock('react-native', () => ({
    Platform: {
      OS: 'android',
    },
  }));

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const client = require('./client');

  it('inits the client', () => {
    const patchReact = jest.fn();
    const waitForWebSocket = jest.fn();

    jest.spyOn(client, 'patchReact').mockImplementation(patchReact);
    jest.spyOn(client, 'waitForWebSocket').mockImplementation(waitForWebSocket);

    client.initClient();

    expect(patchReact).toHaveBeenCalled();
    expect(waitForWebSocket).toHaveBeenCalled();
  });

  it('patches react', () => {
    const createElement = jest
      .spyOn(React, 'createElement')
      .mockImplementation();

    const applyElementTracking = jest.fn();

    jest
      .spyOn(client, 'applyElementTracking')
      .mockImplementation(applyElementTracking);

    client.patchReact();

    const props = { testID: 'testID' };
    React.createElement('View', props);

    expect(createElement).toHaveBeenCalledTimes(1);
    expect(applyElementTracking).toHaveBeenCalledWith(props);
  });

  describe('applyElementTracking', () => {
    const add = jest.fn();

    beforeEach(() => {
      const trackedElements = require('./trackedElements');

      add.mockReset();

      jest.spyOn(trackedElements, 'add').mockImplementation(add);
    });

    it('tracks elements with a testID', () => {
      const newProps = client.applyElementTracking({
        testID: 'testID',
        foo: 'bar',
      });

      expect(add).toHaveBeenCalledTimes(1);
      expect(newProps).toEqual({
        testID: 'testID',
        foo: 'bar',
        ref: { current: null },
        showsHorizontalScrollIndicator: false,
        showsVerticalScrollIndicator: false,
      });
    });

    it('does not track elements without a testID', () => {
      const newProps = client.applyElementTracking({
        testID: undefined,
        foo: 'bar',
      });

      expect(add).toHaveBeenCalledTimes(0);
      expect(newProps).toEqual({
        foo: 'bar',
        showsHorizontalScrollIndicator: false,
        showsVerticalScrollIndicator: false,
      });
    });
  });
});
