export class Logger {
  isEnabled: boolean;
  prefix: string;

  constructor(isEnabled: boolean = false, prefix: string = '') {
    this.isEnabled = isEnabled;
    this.prefix = prefix;
  }

  /** Will only output when the debug flag in the config is on. */
  info(message?: any, ...optionalParams: any[]) {
    if (this.isEnabled) {
      console.info(`${this.prefix} ${message}`, ...optionalParams);
    }
  }

  /** Will only output when the debug flag in the config is on. */
  warn(message?: any, ...optionalParams: any[]) {
    if (this.isEnabled) {
      console.warn(`${this.prefix} ${message}`, ...optionalParams);
    }
  }

  /** Will only output when the debug flag in the config is on. */
  error(message?: any, ...optionalParams: any[]) {
    if (this.isEnabled) {
      console.error(`${this.prefix} ${message}`, ...optionalParams);
    }
  }

  /** Will always print output to the terminal - not depending on the debug flag. */
  print(message?: any, ...optionalParams: any[]) {
    console.log(`${this.prefix} ${message}`, ...optionalParams);
  }
}
