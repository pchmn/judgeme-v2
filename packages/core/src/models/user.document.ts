export interface DeviceInfo {
  name: string;
  os: string;
  osVersion: string;
  pushToken: string;
}

export interface DevicesDocument {
  [installationId: string]: DeviceInfo;
}
export interface UserDocument {
  location: {
    geohash: string;
    lat: number;
    lng: number;
    alt: number | null;
  };
}
