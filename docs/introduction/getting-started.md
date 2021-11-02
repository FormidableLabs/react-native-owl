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

Create a file called `owl.config.json` in the root of your project, next to your `package.json`. There you will have to specify your settings for **iOS** and **Android**. For more information on the config file, please refer to the [configuration file](/docs/introduction/config-file) documentation. Below you can find an example config (can also be found in the [example app](https://github.com/FormidableLabs/react-native-owl/tree/main/example) of the repository).

```json title="owl.config.json"
{
  "ios": {
    "workspace": "ios/OwlDemo.xcworkspace",
    "scheme": "OwlDemo",
    "configuration": "Release",
    "device": "iPhone 12 Pro"
  },
  "android": {
    "packageName": "com.owldemo"
  }
}
```

### Building the app

Placeholder.

### Running the tests

Placeholder.

### Generated report

Placeholder.
