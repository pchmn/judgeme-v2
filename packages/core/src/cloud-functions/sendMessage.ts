import { z } from 'zod';

export type SendMessageParams = {
  to: string;
  message: string;
};

export const sendMessageValidation = z.object({
  to: z.string(),
  message: z.string(),
});
