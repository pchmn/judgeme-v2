export interface DeviceInfo {
  name: string;
  os: string;
  osVersion: string;
  pushToken: string;
  language: string;
}

export interface DevicesDocument {
  [installationId: string]: DeviceInfo;
}
export interface UserDocument {
  geohash: string;
  geopoint: {
    latitude: number;
    longitude: number;
  };
}
