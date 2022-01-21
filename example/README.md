# react-native-owl-demo

> A simple react-native app that uses _react-native-owl_ with examples. Also used for the development of the library.

## Running the app

First, install the dependencies:

```sh
yarn install
```

Then run the metro bundler:

```sh
yarn start
```

### iOS

Install the pods:

```sh
cd ios/ && pod install && cd ..
```

Then run the app:

```sh
yarn ios
```

### Android

Run the app:

```sh
yarn android
```

## Development

To use a local version of react-native-owl, first, navigate to the local directory of react-native-owl (one level up from the current directory) and run the following commands:

```sh
# Assuming you are inside react-native-owl - ie. ~/Projects/react-native-owl
yarn build
yarn watch
```

Now, this example/demo app will be using the local version of react-native-owl.

## Scripts

As seen in `package.json`.

| Name                     | Description                                                                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `yarn owl:build:ios`     | Builds the app for iOS. A wrapper around `xcodebuild`.                                                                                  |
| `yarn owl:test:ios`      | Runs the tests, takes a screenshot and compares the images. If passed the `--update` argument, it generates fresh baseline screenshots. |
| `yarn owl:build:android` | Builds the app for Android. A wrapper around the `gradle` build command.                                                                |
| `yarn owl:test:android`  | Runs the tests, takes a screenshot and compares the images. If passed the `--update` argument, it generates fresh baseline screenshots. |
