export interface DeviceInfo {
  name: string;
  os: string;
  osVersion: string;
  pushToken: string;
}

export interface DevicesDocument {
  [installationId: string]: DeviceInfo;
}

export interface LocationInfo {
  geohash: string;
  latitude: number;
  longitude: number;
  altitude: number | null;
}
export interface UserDocument {
  location: LocationInfo;
}
