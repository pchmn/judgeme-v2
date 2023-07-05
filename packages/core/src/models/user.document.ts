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

interface MessageHistory {
  message: string;
  distance: number;
}

export interface MessageReceived extends MessageHistory {
  from: string;
}

export interface MessageSent extends MessageHistory {
  to: string;
}
export interface UserDocument {
  geohash: string;
  geopoint: {
    latitude: number;
    longitude: number;
  };
  status: 'online' | 'offline';
  messageStatistics: {
    receivedCount: {
      [key: string]: number;
    };
    receivedTotalCount: number;
    sentCount: {
      [key: string]: number;
    };
    sentTotalCount: number;
    averageReceivedDistance: number;
    averageSentDistance: number;
  };
}
