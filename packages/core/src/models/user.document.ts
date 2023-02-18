export interface DeviceInfo {
  name: string;
  os: string;
  osVersion: string;
  pushToken: string;
}

export interface DevicesDocument {
  [installationId: string]: DeviceInfo;
}

export interface Coordinates {
  geohash: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
  altitudeAccuracy: number | null;
}
export interface UserDocument {
  location: Coordinates;
}
