import { takeScreenshot } from 'react-native-owl';

describe('App.tsx', () => {
  it('takes a screenshot of the home screen', async () => {
    const screen = await takeScreenshot('homescreen');

    expect(screen).toMatchBaseline();
  });

  it('takes a screenshot of the about screen', async () => {
    const screen = await takeScreenshot('about');

    expect(screen).toMatchBaseline();
  });
});
