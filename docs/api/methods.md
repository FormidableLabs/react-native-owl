---
sidebar_position: 1
---

# Methods

This is a placeholder.

### takeScreenshot(name: string)

Grabs a screenshot from the simulator and stores it under `latest` screenshots(ie. `./owl/latest/ios/`) using the specified filename (no extension required). If running the tests using the `--update` or `-u` flag, or its the first time its being run, this will store the screenshot under the `baseline` directory.

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

The first time this test is run, or when run with the `--update` flag, the screenshot will be stored at `./owl/baseline/ios/homescreen.png` (or `/android/` is testing on Android).

On subsequent test runs, the screenshot will be stored at `./owl/current/ios/homescreen.png`.