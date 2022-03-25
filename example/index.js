/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { App } from './App';
import { name as appName } from './app.json';
import { initClient } from 'react-native-owl/dist/client';

initClient();

AppRegistry.registerComponent(appName, () => App);
