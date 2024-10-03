import { Arguments } from 'yargs';

export type Platform = 'ios' | 'android';

export interface CliBuildOptions extends Arguments {
  platform: Platform;
  config: string;
}

export interface CliRunOptions extends Arguments {
  platform: Platform;
  config: string;
  update: boolean;
  testNamePattern: string;
}

export type ConfigEnv = {
  ENTRY_FILE?: string;
};

export type ConfigIOS = {
  /** The workspace to build. */
  workspace?: string;
  /** The scheme to build. */
  scheme?: string;
  /** The build configuration that should be used for this target. Usually Debug or Release. */
  configuration?: string;
  /** Overrides the `xcodebuild` command making the workspace & scheme options obselete. */
  buildCommand?: string;
  /** Path to the .app that will get generated by a custom build command. Ignored when not using a custom build command. */
  binaryPath?: string;
  /** Passes the quiet flag to `xcodebuild`. Does not print any output except for warnings and errors. */
  quiet?: boolean;
  /** The name of the simulator you would like to run tests on. Can be either the name or the id of the device. */
  device: string;
};

export type ConfigAndroid = {
  /** The package name of your Android app. See Manifest.xml. */
  packageName: string;
  /** Overrides the `assembleDebug` gradle command. Should build the apk. */
  buildCommand?: string;
  /** Used to decided which build command it should call. */
  buildType?: 'Debug' | 'Release';
  /** Path to the .apk that will get generated by a custom build command. Ignored when not using a custom build command. */
  binaryPath?: string;
  /** Passes the quiet flag to `gradlew`. */
  quiet?: boolean;
};

export type Config = {
  ios?: ConfigIOS;
  android?: ConfigAndroid;
  /** Generate an HTML report, displaying the baseline, latest & diff images. */
  report?: boolean;
  /** Prevents the CLI/library from printing any logs/output. */
  debug?: boolean;
};

export type JestReport = {
  numFailedTestSuites: number;
  numFailedTests: number;
  numPassedTestSuites: number;
  numPassedTests: number;
  numPendingTestSuites: number;
  numPendingTests: number;
  numRuntimeErrorTestSuites: number;
  numTodoTests: number;
  numTotalTestSuites: number;
  numTotalTests: number;
  openHandles: any[];
  startTime: number;
  success: boolean;
  testResults: any[];
  wasInterrupted: boolean;
};

export type ReportStats = {
  totalTestSuites: number;
  totalTests: number;
  failedTestSuites: number;
  failedTests: number;
  passedTestSuites: number;
  passedTests: number;
  duration: string;
  success: boolean;
};
