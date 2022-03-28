import { disconnectServer, takeScreenshot, tapOn } from 'react-native-owl';

jest.setTimeout(30000);

afterAll(() => {
  disconnectServer();
});

describe('App.tsx', () => {
  it('takes a screenshot of the first screen', async () => {
    await tapOn('home.viewDetails');

    const screen = await takeScreenshot('homescreen');

    expect(screen).toMatchBaseline();
  });
});
