---
sidebar_position: 3
---

# Matchers

### toMatchBaseline(options: {threshold?: number} = {threshold: 0.1})

This custom Jest matcher will try to find and compare the baseline screenshot by using the path of the latest screenshot (returned by `takeScreenshot()`). You will have to take a screenshot before using, and pass the path of that screenshot to the expect method.

#### Example

```js title="__tests__/App.owl.tsx"
import { takeScreenshot } from 'react-native-owl';

describe('App.tsx', () => {
  it('takes a screenshot of the first screen', async () => {
    const screen = await takeScreenshot('homescreen');

    // highlight-next-line
    expect(screen).toMatchBaseline();

    // Or with a custom threshold
    expect(screen).toMatchBaseline({ threshold: 0.2 });
  });
});
```

The first time this test is run, or when run with the `--update` flag, the `.toMatchBaseline` expectation will always be successful.

On subsequent test runs, the screenshot captured by `takeScreenshot` (and stored in `/current`) will be compared to the baseline screenshot. **_Any_** differences will cause the expectation to fail, and the report to be generated.

The `threshold` option allows you to customise the threshold for [pixelmatch](https://github.com/mapbox/pixelmatch#pixelmatchimg1-img2-output-width-height-options) which Owl uses under the hood.
