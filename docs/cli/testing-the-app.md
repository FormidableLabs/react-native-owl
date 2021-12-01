---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Testing the app

Use the `test` command to run the app on the simulator, either comparing screenshots with the baseline images, or updating the baseline images.

When comparing images, any difference in the current vs baseline will fail the test.

:::info

The **first** time you will run the test command, react-native-owl will generate all your baseline images. It is _very_ important to make sure these are correct before proceeding.

:::

### First run

The baseline images will be automatically generated. To regenerate the baseline images, use the `--update` option.

### Running tests


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



### Updating the baseline

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