import { z } from 'zod';

import { Params } from './types';

export interface SendMessageParams extends Params {
  to: string;
  message: string;
}

export const sendMessageValidation = z.object({
  to: z.string(),
  message: z.string(),
});
