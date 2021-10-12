export interface SimCtlList {
  devices: Devices;
}

export interface Devices {
  [key: string]: Device[];
}

export interface Device {
  availabilityError: string;
  dataPath: string;
  logPath: string;
  udid: string;
  isAvailable: boolean;
  deviceTypeIdentifier: string;
  state: string;
  name: string;
}
