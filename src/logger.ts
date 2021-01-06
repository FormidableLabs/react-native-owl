export class Logger {
  isEnabled: boolean;

  constructor(isEnabled: boolean = false) {
    this.isEnabled = isEnabled;
  }

  /** Will only output when the debug flag in the config is on. */
  info(message?: any, ...optionalParams: any[]) {
    if (this.isEnabled) {
      console.info(message, ...optionalParams);
    }
  }

  /** Will only output when the debug flag in the config is on. */
  warn(message?: any, ...optionalParams: any[]) {
    if (this.isEnabled) {
      console.warn(message, ...optionalParams);
    }
  }

  /** Will only output when the debug flag in the config is on. */
  error(message?: any, ...optionalParams: any[]) {
    if (this.isEnabled) {
      console.error(message, ...optionalParams);
    }
  }

  /** Will always print output to the terminal - not depending on the debug flag. */
  print(message?: any, ...optionalParams: any[]) {
    console.log(message, ...optionalParams);
  }
}
