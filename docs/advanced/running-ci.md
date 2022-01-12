---
sidebar_position: 1
---

# Running on CI

:::info

With visual regression testing, it is all about **consistency**. Please make sure that you use the same simulator across environments. ie. Use the same emulator to generate the baseline images and the same (model) one on CI so that the library can compare the screenshots.

:::

### GitHub Actions

#### Example

To run the tests on an iOS simulator, you will need to use a [macOS based runner](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners#supported-runners-and-hardware-resources).

```yaml title=".github/workflows/visual-regression-ios.yml"
name: Run Visual Regression iOS

on: [pull_request]

jobs:
  run-visual-regression-ios:
    runs-on: macos-11

    steps:
      - uses: actions/checkout@v2

      - name: Get Runner Information
        run: /usr/bin/xcodebuild -version

      - name: Get yarn cache directory path
        id: yarn-cache-dir-path
        run: echo "::set-output name=dir::$(yarn cache dir)"

      - uses: actions/cache@v2
        id: yarn-cache # use this to check for `cache-hit` (`steps.yarn-cache.outputs.cache-hit != 'true'`)
        with:
          path: ${{ steps.yarn-cache-dir-path.outputs.dir }}
          key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
          restore-keys: |
            ${{ runner.os }}-yarn-

      - name: Install Dependencies
        run: yarn install --frozen-lockfile
        working-directory: ./

      - name: Install CocoaPods
        run: gem install cocoapods -v 1.11.0

      - uses: actions/cache@v2
        with:
          path: ./ios/Pods
          key: ${{ runner.os }}-pods-${{ hashFiles('**/Podfile.lock') }}
          restore-keys: |
            ${{ runner.os }}-pods-

      - name: Install CocoaPods
        run: pod install
        working-directory: ./ios

      - uses: futureware-tech/simulator-action@v1
        with:
          model: 'iPhone 13 Pro'
          os_version: '=15.0'

      - name: Run Owl Build
        run: yarn owl:build:ios
        working-directory: ./

      - name: Run Owl Test
        run: yarn owl:test:ios
        working-directory: ./

      - name: Store screenshots and report as artifacts
        uses: actions/upload-artifact@v2
        if: failure()
        with:
          name: owl-results
          path: ./.owl
```

To run the tests on an Android simulator, you can use the [Android Emulator Runner](https://github.com/marketplace/actions/android-emulator-runner) Action and adjust the example action above.
