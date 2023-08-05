import { Installation } from './installation';
import { BaseModel } from './types';

export interface DeviceInfo {
  name: string;
  os: string;
  osVersion: string;
  pushToken: string;
  language: string;
}

export interface Devices {
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

export class LatLng {
  latitude: number;
  longitude: number;

  constructor(coordinates: [number, number]) {
    this.longitude = coordinates[0];
    this.latitude = coordinates[1];
  }
}

export class GeoPoint {
  type = 'Point';
  coordinates: [number, number];

  constructor(coordinates: LatLng) {
    this.coordinates = [coordinates.longitude, coordinates.latitude];
  }
}
export interface Kuzer extends BaseModel {
  geohash: string;
  geopoint: GeoPoint;
  name: string;
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
  installations?: Installation[];
}
