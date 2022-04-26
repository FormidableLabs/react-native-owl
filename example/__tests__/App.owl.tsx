import {
  disconnectServer,
  takeScreenshot,
  tapOn,
  toExist,
  clearText,
  enterText,
  scrollTo,
  scrollToEnd,
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

    await toExist('details.reveal');

    const screen = await takeScreenshot('details');

    expect(screen).toMatchBaseline();
  });

  it('enters some text and takes a screenshot', async () => {
    await tapOn('details.reveal');

    await toExist('details.input');

    await clearText('details.input');

    await enterText('details.input', 'Entered text');

    const screen = await takeScreenshot('enteredText');

    expect(screen).toMatchBaseline();
  });

  it('scrolls a bit and takes a screenshot', async () => {
    await scrollTo('details.scrollView', { y: 50 });

    const screen = await takeScreenshot('scrollTo');

    expect(screen).toMatchBaseline();
  });

  it('scrolls to end and takes a screenshot', async () => {
    await scrollToEnd('details.scrollView');

    const screen = await takeScreenshot('scrollToEnd');

    expect(screen).toMatchBaseline();
  });
});
