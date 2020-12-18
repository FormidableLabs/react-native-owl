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

| Name               | Required | Description                                                  |
| ------------------ | -------- | ------------------------------------------------------------ |
| **ios config**     |          |                                                              |
| `ios.workspace`    | true     | Path to the `.xcworkspace` file of your react-native project |
| **android config** |          |                                                              |
| -                  |          |                                                              |

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
