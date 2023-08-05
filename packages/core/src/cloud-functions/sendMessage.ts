import { z } from 'zod';

export const sendMessageValidation = z.object({
  to: z.string(),
  messageId: z.string(),
});

export type SendMessageParams = z.infer<typeof sendMessageValidation>;
