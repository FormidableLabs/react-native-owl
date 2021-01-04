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

##### Options

| Name       | Required | Default           | Choices         | Description                             |
| ---------- | -------- | ----------------- | --------------- | --------------------------------------- |
| `config`   | false    | ./owl.config.json | -               | Path to the configuration file          |
| `platform` | true     | -                 | `ios`,`android` | The platform the app should be built on |

```
owl build --platform ios --config ./owl.config.json
```

### Running the tests

```
owl test --platform ios --config ./owl.config.json
```

[github-image]: https://github.com/FormidableLabs/react-native-owl/workflows/Run%20Tests/badge.svg
[github-url]: https://github.com/FormidableLabs/react-native-owl/actions
