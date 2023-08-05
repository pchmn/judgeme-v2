import { BaseModel } from './types';

export interface Message extends BaseModel {
  slug: string;
  emoji: string;
  translations: {
    [language: string]: string;
  };
}
