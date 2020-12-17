# react-native-owl [![github][github-image]][github-url]

> **Work In Progress**: Visual regression testing for React Native

## Installation

```sh
yarn add -D react-native-owl
# or
npm install -D react-native-owl
```

## CLI

### Building the app

##### Options

| Name       | Required | Choices         | Description                              |
| ---------- | -------- | --------------- | ---------------------------------------- |
| `platform` | true     | `ios`,`android` | The platform the app should be built on. |

```bash
owl build --platform ios
```

### Running the tests

```
owl test --platform ios
```

[github-image]: https://github.com/FormidableLabs/react-native-owl/workflows/Run%20Tests/badge.svg
[github-url]: https://github.com/FormidableLabs/react-native-owl/actions
