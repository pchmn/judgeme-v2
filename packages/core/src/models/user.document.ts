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

export interface MessageReceived {
  from: string;
  message: string;
}

export interface MessageSent {
  to: string;
  message: string;
}
export interface UserDocument {
  geohash: string;
  geopoint: {
    latitude: number;
    longitude: number;
  };
  statistics: {
    receivedCount: {
      [key: string]: number;
      total: number;
    };
    sentCount: {
      [key: string]: number;
      total: number;
    };
    averageReceivedDistance: number;
    averageSentDistance: number;
  };
}
