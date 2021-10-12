# react-native-owl [![github][github-image]][github-url]

> **Work In Progress**: Visual regression testing for React Native

## Installation

```sh
yarn add -D react-native-owl
# or
npm install -D react-native-owl
```

## Configuration file

The config file - which unless specified in the cli should live in `./owl.config.json` - is used to descript how Owl should run your app and your tests. Below you can find all the options the can be specified.

### Options

| Name                   | Required | Description                                                          |
| ---------------------- | -------- | -------------------------------------------------------------------- |
| **general**            |          |                                                                      |
| `debug`                | false    | Prevents the CLI/library from printing any logs/output               |
| **ios config**         |          |                                                                      |
| `ios.workspace`        | true     | Path to the `.xcworkspace` file of your react-native project         |
| `ios.scheme`           | true     | The name of the scheme you would like to use for building the app    |
| `ios.configuration`    | true     | The build configuration that should be used. Defaults to Debug       |
| `ios.buildCommand`     | false    | Overrides the `xcodebuild` command making the above options obselete |
| `ios.binaryPath`       | false    | The path to the binary, if you are using a custom build command      |
| `ios.quiet`            | false    | Passes the quiet flag to `xcode builds`                              |
| **android config**     |          |                                                                      |
| `android.buildCommand` | false    | Overrides the `assembleDebug` gradle command. Should build the apk   |
| `android.binaryPath`   | false    | The path to the binary, if you are using a custom build command      |
| `android.quiet`        | false    | Passes the quiet flag to `gradlew`                                   |

### Example

```json
{
  "ios": {
    "workspace": "ios/OwlDemoApp.xcworkspace",
    "scheme": "OwlDemoApp",
    "device": "iPhone 12 Pro"
  },
  "android": {
    "packageName": "com.owldemoapp"
  }
}
```

## CLI

### Building the app

#### Options

| Name             | Required | Default           | Options/Types   | Description                             |
| ---------------- | -------- | ----------------- | --------------- | --------------------------------------- |
| `config`, `-c`   | false    | ./owl.config.json | String          | Path to the configuration file          |
| `platform`, `-p` | true     | -                 | `ios`,`android` | The platform the app should be built on |

#### Examples

```
owl build --platform ios --config ./owl.config.json
```

### Running the tests

#### Options

| Name               | Required | Default           | Options/Types   | Description                                     |
| ------------------ | -------- | ----------------- | --------------- | ----------------------------------------------- |
| `--config`, `-c`   | false    | ./owl.config.json | String          | Path to the configuration file                  |
| `--platform`, `-p` | true     | -                 | `ios`,`android` | The platform the app should be built on         |
| `--update`, `-u`   | true     | false             | Boolean         | A flag about rewriting existing baseline images |

#### Examples

```
owl test --platform ios
owl test --platform ios --config ./owl.config.json
owl test --platform ios --update
```

## Test Suite

### Example

```js
import { takeScreenshot } from 'react-native-owl';

describe('App.tsx', () => {
  it('takes a screenshot of the first screen', async () => {
    const screen = await takeScreenshot('homescreen');

    expect(screen).toMatchBaseline();
  });
});
```

### Methods

#### `takeScreenshot(filename: string)`

Grabs a screenshot from the simulator and stores it under `latest` screenshots(ie. `./owl/latest/ios/`) with the specified filename(without the extension). If running the tests using the `--update` or `-u` flag, this will store the screenshot under the `baseline` directory. See example above.

### Jest Matchers

#### `.toMatchBaseline()`

This custom matcher will try to find and compare the baseline screenshot by using the path of the _latest_ screenshot (returned by `takeScreenshot()`). You will have to take a screenshot before using and pass the path of that screenshot to the `expect` method.

[github-image]: https://github.com/FormidableLabs/react-native-owl/workflows/Run%20Tests/badge.svg
[github-url]: https://github.com/FormidableLabs/react-native-owl/actions
