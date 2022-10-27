# `react-native-owl`

> Visual regression testing for React Native

![Sample of using React Native Owl to generate a visual regression diff](https://raw.githubusercontent.com/FormidableLabs/react-native-owl/main/website/static/images/homepage/mockup-bg.png)

---

[![github][github-image]][github-url] [![npm][npm-image]][npm-url] [![docs][docs-image]][docs-url] [![Maintenance Status][maintenance-image]](#maintenance-status)

## What is React Native Owl?

React Native Owl is a visual regression testing library for React Native that enables developers to introduce visual regression tests to their apps for iOS and Android. Being heavily inspired by [Detox](https://github.com/wix/Detox), an end-to-end testing and automation framework, this library uses a similar API that makes setting up `react-native-owl` and running the tests locally and on your preferred CI service seamless.

While Detox focuses on end-to-end testing in general, React Native Owl focuses on visual regression testing and helping you catch unexpected changes to the visual appearance of your app over time.

### :rocket: [Check out the official documentation for more details!](https://formidable.com/open-source/react-native-owl/)

## Installation

```sh
yarn add -D react-native-owl
# or
npm install -D react-native-owl
```

## 📃 [Documentation](https://formidable.com/open-source/react-native-owl/)

The documentation contains everything you need to know about `react-native-owl`, and contains several sections in order of importance
when you first get started:

- **[Getting started](https://formidable.com/open-source/react-native-owl/docs/introduction/getting-started)** — contains the "Getting Started" guide.
- **[Configuration](https://formidable.com/open-source/react-native-owl/docs/introduction/config-file)** — explains all the configuration options for `react-native-owl`.
- **[Running on CI](https://formidable.com/open-source/react-native-owl/docs/ci/github-actions)** — example GitHub Action to run react-native-owl on CI.

_You can find the raw markdown files inside this repository's `docs` folder._

## Maintenance Status

**Active:** Formidable is actively working on this project, and we expect to continue work on this project for the foreseeable future. Bug reports, feature requests and pull requests are welcome.

[github-image]: https://github.com/FormidableLabs/react-native-owl/workflows/Run%20Tests/badge.svg
[github-url]: https://github.com/FormidableLabs/react-native-owl/actions
[npm-image]: https://img.shields.io/npm/v/react-native-owl
[npm-url]: https://www.npmjs.com/package/react-native-owl
[docs-image]: https://img.shields.io/badge/docs-visit%20site-blue
[docs-url]: https://formidable.com/open-source/react-native-owl/
[maintenance-image]: https://img.shields.io/badge/maintenance-active-green.svg?color=brightgreen&style=flat

## React Native Version Support

React Native OWL currently supports React Native versions up to 0.69.x.
We are working on React Native 0.70.x + support.
