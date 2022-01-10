---
sidebar_position: 2
---

# Config File

The config file - which unless specified in the cli should live in `./owl.config.json` - is used to describe how Owl should run your app and your tests. Below you can find all the options the can be specified.

### Options

| Name                   | Required | Default | Description                                                             |
| ---------------------- | -------- | ------- | ----------------------------------------------------------------------- |
| **general**            |          |         |                                                                         |
| `debug`                | false    | `false` | Prevents the CLI/library from printing any logs/output.                 |
| `report`               | false    | `true`  | Generate an HTML report, displaying the baseline, latest & diff images. |
| **ios config**         |          |         |                                                                         |
| `ios.workspace`        | true     |         | Path to the `.xcworkspace` file of your react-native project            |
| `ios.scheme`           | true     |         | The name of the scheme you would like to use for building the app       |
| `ios.configuration`    | true     | `Debug` | The build configuration that should be used.                            |
| `ios.buildCommand`     | false    |         | Overrides the `xcodebuild` command making the above options obselete    |
| `ios.binaryPath`       | false    |         | The path to the binary, if you are using a custom build command         |
| `ios.quiet`            | false    |         | Passes the quiet flag to `xcode builds`                                 |
| **android config**     |          |         |                                                                         |
| `android.buildCommand` | false    |         | Overrides the `assembleDebug` gradle command. Should build the apk      |
| `android.binaryPath`   | false    |         | The path to the binary, if you are using a custom build command         |
| `android.packageName`  |          |         | The package name/unique identifier of the app                           |
| `android.quiet`        | false    |         | Passes the quiet flag to `gradlew`                                      |

### Example

```json title="owl.config.json"
{
  "ios": {
    "workspace": "ios/OwlDemoApp.xcworkspace",
    "scheme": "OwlDemoApp",
    "device": "iPhone 13 Pro"
  },
  "android": {
    "packageName": "com.owldemoapp"
  }
}
```