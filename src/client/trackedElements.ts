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

/**
 * A masic map of tracked elements, that we use to keep track of elements
 * so that we can perform actions on them in future
 */
const trackedElements: Record<string, TrackedElementData> = {};

export const get = (ID: string): TrackedElementData | undefined =>
  trackedElements[ID];

export const add = (logger: Logger, ID: string, data: TrackedElementData) => {
  trackedElements[ID] = data;

  logger.info(`[OWL - Tracker] Tracking element with ${ID}`);
};
