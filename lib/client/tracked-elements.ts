import React from 'react';
import { TextInputProps } from 'react-native';
import { Logger } from '../logger';

export type ElementActions = {
  ref: React.RefObject<any>;
  onPress?: Function;
  onChangeText?: TextInputProps['onChangeText'];
};

const trackedElements: Record<string, ElementActions> = {};

export const get = (ID: string) => {
  return trackedElements[ID];
};

export const exists = (ID: string) => {
  return trackedElements[ID] !== undefined;
};

export const add = (logger: Logger, ID: string, data: ElementActions) => {
  trackedElements[ID] = data;

  logger.info(`[OWL - Tracker] Tracking element with ${ID}`);
};
