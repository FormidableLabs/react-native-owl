import {
  disconnectServer,
  takeScreenshot,
  tapOn,
  toExist,
  enterText,
  scrollTo,
  scrollToEnd,
} from 'react-native-owl';

jest.setTimeout(30000);

afterAll(() => {
  disconnectServer();
});

describe('App.tsx', () => {
  it('takes a screenshot of the initial screen', async () => {
    const screen = await takeScreenshot('initial');

    expect(screen).toMatchBaseline();
  });

  it('press a button, waits for an element then takes a screenshot', async () => {
    await tapOn('Button');

    await toExist('TextInputTestID');

    const screen = await takeScreenshot('testInput');

    expect(screen).toMatchBaseline();
  });

  it('enters some text and takes a screenshot', async () => {
    await enterText('TextInputTestID', 'Entered text');

    const screen = await takeScreenshot('enteredText');

    expect(screen).toMatchBaseline();
  });

  it('scrolls a bit and takes a screenshot', async () => {
    await scrollTo('ScrollView', { y: 50 });

    const screen = await takeScreenshot('scrollTo');

    expect(screen).toMatchBaseline();
  });

  it('scrolls to end and takes a screenshot', async () => {
    await scrollToEnd('ScrollView');

    const screen = await takeScreenshot('scrollToEnd');

    expect(screen).toMatchBaseline();
  });
});
