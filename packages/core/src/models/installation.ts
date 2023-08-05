import { Kuzer } from './kuzer';
import { BaseModel } from './types';

export type DeviceType = 'phone' | 'tablet' | 'desktop' | 'tv';

export interface Installation extends BaseModel {
  deviceName: string;
  osName?: string;
  osVersion?: string;
  pushToken: string;
  isActive: boolean;
  kuzer: Kuzer;
  kuzerId: string;
  appVersion?: string;
  appIdentifier?: string;
  deviceType?: DeviceType;
  deviceLocale: string;
}
