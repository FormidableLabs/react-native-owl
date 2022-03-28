import {
  disconnectServer,
  takeScreenshot,
  tapOn,
  toExists,
} from 'react-native-owl';

jest.setTimeout(30000);

afterAll(() => {
  disconnectServer();
});

describe('App.tsx', () => {
  it('takes a screenshot of the first screen', async () => {
    const screen = await takeScreenshot('homescreen');

    expect(screen).toMatchBaseline();
  });

  it('takes a screenshot of the Details screen', async () => {
    await tapOn('home.viewDetails');

    await toExists('details.reveal');

    const screen = await takeScreenshot('details');

    expect(screen).toMatchBaseline();
  });
});
