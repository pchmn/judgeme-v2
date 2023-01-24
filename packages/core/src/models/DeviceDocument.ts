export interface DeviceInfo {
  name: string;
  os: string;
  osVersion: string;
  pushToken: string;
}

export interface UserDocument {
  devices: Record<string, DeviceInfo>;
}
