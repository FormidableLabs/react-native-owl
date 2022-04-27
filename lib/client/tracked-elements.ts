import React from 'react';
import {
  PressableProps,
  TextInputProps,
  TouchableWithoutFeedbackProps,
} from 'react-native';
import { Logger } from '../logger';

export type TrackedElementData = {
  ref: React.RefObject<any>;
  onPress?:
    | TouchableWithoutFeedbackProps['onPress']
    | PressableProps['onPress'];
  onLongPress?:
    | TouchableWithoutFeedbackProps['onLongPress']
    | PressableProps['onLongPress'];
  onChangeText?: TextInputProps['onChangeText'];
};

const trackedElements: Record<string, TrackedElementData> = {};

export const get = (ID: string) => {
  return trackedElements[ID];
};

export const exists = (ID: string) => {
  return trackedElements[ID] !== undefined;
};

export const add = (logger: Logger, ID: string, data: TrackedElementData) => {
  trackedElements[ID] = data;

  logger.info(`[OWL - Tracker] Tracking element with ${ID}`);
};
