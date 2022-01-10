---
sidebar_position: 1
---

# Getting Started

### Installation

Install react-native-owl using either `yarn` or `npm`:

```bash npm2yarn
npm install --save-dev react-native-owl
```

### Configuration

Create a file called `owl.config.json` in the root of your project, next to your `package.json`. There you will have to specify your settings for **iOS** and **Android**. For more information on the config file, please refer to the [configuration file](/docs/introduction/config-file) documentation.

Below you can find an example config (can also be found in the [example app](https://github.com/FormidableLabs/react-native-owl/tree/main/example) of the repository).

```json title="owl.config.json"
{
  "ios": {
    "workspace": "ios/OwlDemo.xcworkspace",
    "scheme": "OwlDemo",
    "configuration": "Release",
    "device": "iPhone 13 Pro"
  },
  "android": {
    "packageName": "com.owldemo"
  },
}
```

### Add tests

Use the [takeScreenshot](/docs/api/methods#takescreenshotname-string) and [.toMatchBaseline](/docs/api/matchers#tomatchbaselinename-string) api's to implement screenshot tests.

#### Example

```js
import { takeScreenshot } from 'react-native-owl';

describe('App.tsx', () => {
  it('takes a screenshot of the first screen', async () => {
    const screen = await takeScreenshot('homescreen');

    expect(screen).toMatchBaseline();
  });
});
```

### Building the app

Before the app can be tested, it must be built.

<Tabs groupId="npm2yarn">
  <TabItem value="npm" label="npm">

```bash
npm run owl build -- --platform ios
```

  </TabItem>
  <TabItem value="yarn" label="Yarn">

```bash
yarn owl build --platform ios
```

  </TabItem>
</Tabs>

### Work-In-Progress

:::info

You will need to manually start the correct simulator before the tests are run.

:::


This runs the app on the simulator, either comparing screenshots with the baseline images, or updating the baseline images.

When comparing images, any difference in the current vs baseline will fail the test.

#### Examples

Test against the baseline images (will create the baseline images if they don't exist).

<Tabs  groupId="npm2yarn">
  <TabItem value="npm" label="npm">

```bash
npm run owl test -- --platform ios
```

  </TabItem>
  <TabItem value="yarn" label="Yarn">

```bash
yarn owl test --platform ios
```

  </TabItem>
</Tabs>

Update the baseline images

<Tabs  groupId="npm2yarn">
  <TabItem value="npm" label="npm">

```bash
npm run owl test -- --platform ios --update
```

  </TabItem>
  <TabItem value="yarn" label="Yarn">

```bash
yarn owl test --platform ios --update
```

  </TabItem>
</Tabs>

### Failed tests report

When the tests have failed any [`.toMatchBaseline()`](/docs/api/matchers) expectations, a [report is generated](/docs/cli/testing-the-app#viewing-the-report), where you can view all the screenshots, where the differences in the current vs baseline screenshots will be highlighted.
