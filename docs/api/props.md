---
sidebar_position: 2
---

# Props

### testId

React-native-owl makes use of the standard React Native [`testID`](https://reactnative.dev/docs/view#testid) prop to identify the elements to interact with during tests.

#### Example

```js title="App.tsx"
...
<Button
  title="Press Me"
  // highlight-next-line
  testID="button"
  onPress={() => {}}
/>
...
```

```js title="__tests__/App.owl.tsx"
import { call, takeScreenshot } from 'react-native-owl';

describe('App.tsx', () => {
  it('presses a button with testID = `button` then takes a screenshot', async () => {
    // highlight-next-line
    await press('button');

    const screen = await takeScreenshot('afterButtonPress');

    expect(screen).toMatchBaseline();
  });
});
```

### owlTestCallbacks

Allows arbitory callbacks to be added to an element, so that they can be easily called by react-native-owl during tests by using the [`call`](docs/api/methods#calltestid-string-callbackkey-string) method.

#### Example

```js title="App.tsx"
...
<Button
  title="Login"
  testID="loginButton"
  // highlight-next-line
  owlTestCallbacks={{
    // highlight-next-line
    mockLogin: () => {
      // highlight-next-line
      // Handle mocking the user having logged in
      // highlight-next-line
    }
  }}
  onPress={() => {}}
/>
...
```

```js title="__tests__/App.owl.tsx"
import { call, takeScreenshot } from 'react-native-owl';

describe('App.tsx', () => {
  it('mocks the user having logged in, then takes a screenshot', async () => {
    // highlight-next-line
    await call('loginButton', 'mockLogin');

    const screen = await takeScreenshot('afterMockedLogin');

    expect(screen).toMatchBaseline();
  });
});
```

#### TypeScript

If using TypeScript, you can import `OwlTestProps` and add to a Components Prop types, or wrap React Native's components.

##### Example

```js title="App.tsx"
import { View as RNView } from 'react-native';
import { OwlTestProps } from 'react-native-owl';
...
// highlight-next-line
const View = (props: ViewProps & OwlTestProps) => <RNView {...props} />;

<View
  owlTestCallbacks={{
    onPress: () => {...},
  }}
  ...
/>
...
```
