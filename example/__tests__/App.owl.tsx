import { takeScreenshot, tapOn } from 'react-native-owl';

describe('App.tsx', () => {
  it('takes a screenshot of the first screen', async () => {
    const screen = await takeScreenshot('homescreen');

    await tapOn('testMe');

    expect(screen).toMatchBaseline();
  });
});
