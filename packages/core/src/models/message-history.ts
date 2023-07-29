import { Kuzer } from './kuzer';
import { Message } from './message';
import { BaseModel } from './types';

export interface MessageHistory extends BaseModel {
  message: Message;
  distance: number;
  from: Kuzer;
  to: Kuzer;
  messageId: string;
  fromId: string;
  toId: string;
}
