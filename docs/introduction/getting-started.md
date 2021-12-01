---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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

### Building the app

Before the app can be tested, it must be built.

<Tabs>
  <TabItem value="npm" label="npm" default>

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

### Running the tests

This runs the app on the simulator, either comparing screenshots with the baseline images, or updating the baseline images.

When comparing images, any difference in the current vs baseline will fail the test.

#### Examples

Test against the baseline images (will create the baseline images if they don't exist).

<Tabs>
  <TabItem value="npm" label="npm" default>

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

<Tabs>
  <TabItem value="npm" label="npm" default>

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

### Generated report

When the tests have completed, either successfully or with failures, a report is generated, where you can view all the screenshots. For failing tests, differences in the current vs baseline screenshots will be highlighted.

The report uri is included in the test output.

#### Example:

```
...
[OWL] Generating Report
[OWL] Report was built at /Users/username/Code/FormidableLabs/react-native-owl/example/.owl/report/index.html
...
```
