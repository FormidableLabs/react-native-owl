import { Logger } from './cli/types';

export const createLogger = (isEnabled: boolean = false): Logger => {
  const info = (message?: any, ...optionalParams: any[]) => {
    if (isEnabled) {
      console.info(message, ...optionalParams);
    }
  };

  const warn = (message?: any, ...optionalParams: any[]) => {
    if (isEnabled) {
      console.warn(message, ...optionalParams);
    }
  };

  const error = (message?: any, ...optionalParams: any[]) => {
    if (isEnabled) {
      console.error(message, ...optionalParams);
    }
  };

  return {
    info,
    warn,
    error,
  };
};
