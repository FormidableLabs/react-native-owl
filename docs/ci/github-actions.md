---
sidebar_position: 1
---

# GitHub Actions

:::info

With visual regression testing, it is all about **consistency**. Please make sure that you use the same simulator across environments. Use the same emulator configuration to generate the baseline images and for running the test suite on CI so that the library can compare the screenshots. The library will not be able to compare different sizes and resolutions of screenshots.

:::

### iOS

To run the tests on an iOS simulator, you will need to use a [macOS based runner](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners#supported-runners-and-hardware-resources).

```yaml title=".github/workflows/visual-regression-ios.yml"
name: Visual Regression - iOS

on: [pull_request]

jobs:
  run-visual-regression-ios:
    runs-on: macos-14

    steps:
      - uses: actions/checkout@v4

      - name: Get Runner Information
        run: /usr/bin/xcodebuild -version

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'yarn'

      - name: Install Dependencies
        run: yarn install --frozen-lockfile

      - name: Install CocoaPods
        run: gem install cocoapods -v 1.11.0

      - uses: actions/cache@v4
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
          model: 'iPhone 15 Pro'
          os_version: '18.1'

      - name: Run Owl Build
        run: yarn owl:build:ios

      - name: Run Owl Test
        run: yarn owl:test:ios

      - name: Store screenshots and report as artifacts
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: owl-results
          path: ./.owl
```

### Android

```yaml title=".github/workflows/visual-regression-android.yml"
name: Visual Regression - Android

on: [pull_request]

jobs:
  run-visual-regression-android:
    runs-on: macos-14

    steps:
      - uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'yarn'

      - name: Install Dependencies
        run: yarn install --frozen-lockfile

      - uses: actions/cache@v4
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
          restore-keys: |
            ${{ runner.os }}-gradle-

      - name: SKDs - download required images
        run: $ANDROID_HOME/tools/bin/sdkmanager "system-images;android-30;default;x86_64"

      - name: SDKs - accept licenses
        run: y | $ANDROID_HOME/tools/bin/sdkmanager --licenses

      - name: Emulator - Create
        run: $ANDROID_HOME/tools/bin/avdmanager create avd -n Pixel_API_30 --device 'Nexus 5X' --package "system-images;android-30;default;x86_64" --sdcard 512M

      - name: Emulator - Boot
        run: $ANDROID_HOME/emulator/emulator -memory 4096 -avd Pixel_API_30 -wipe-data -no-window -gpu swiftshader_indirect -no-snapshot -noaudio -no-boot-anim &

      - name: ADB Wait For Device
        run: adb wait-for-any-device
        timeout-minutes: 3

      - name: Run Owl Build
        run: yarn owl:build:android

      - name: Run Owl Test
        run: yarn owl:test:android

      - name: Store screenshots as artifacts
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: owl-screenshots
          path: ./.owl
```
