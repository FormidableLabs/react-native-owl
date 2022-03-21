import { takeScreenshot, tapOn } from 'react-native-owl';

jest.setTimeout(30000);

describe('App.tsx', () => {
  it('takes a screenshot of the first screen', async () => {
    await tapOn('testMe');

    const screen = await takeScreenshot('homescreen');

    expect(screen).toMatchBaseline();
  });
});
