import execa from 'execa';

import { Logger } from '../logger';
import { SimCtlList } from '../types/simctllist';

export const bootIOSSimulator = async (
  name: string,
  logger: Logger,
  stdio: 'inherit' | 'ignore'
): Promise<void> => {
  const { stdout } = await execa.command(
    'xcrun simctl list devices available --json'
  );
  const parsedOutput: SimCtlList = JSON.parse(stdout);
  const devices = Object.values(parsedOutput.devices).flat();
  const device = devices.find((item: { name: string }) => item.name === name);

  logger.info(`[OWL] Available Devices: ${JSON.stringify(devices, null, 2)}`);

  if (!device) {
    throw new Error(`Device ${name} not found.`);
  }

  try {
    await execa.command(`xcrun simctl boot ${device.udid}`, {
      // stdio,
    });
    logger.info(
      `[OWL] The simulator ${device.name}(${device.udid}) was booted successfully.`
    );
  } catch (err: any) {
    if (err.exitCode !== 149) {
      throw new Error(
        `Could not boot the simulator ${device.name}(${device.udid}) because: ${err.shortMessage}.`
      );
    }

    logger.info(
      `[OWL] The simulator ${device.name}(${device.udid}) was alredy booted.`
    );
  }
};
