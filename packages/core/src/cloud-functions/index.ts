import { z } from 'zod';

import { SendMessageParams, sendMessageValidation } from './sendMessage';

// export type CallableFunctionName = keyof FunctionParams;
export type FunctionName = keyof FunctionParams;

export type FunctionParams = {
  sendMessage: SendMessageParams;
  SendMessageFunction: SendMessageParams;
};

export const FunctionValidation: Record<FunctionName, z.ZodObject<any>> = {
  sendMessage: sendMessageValidation,
  SendMessageFunction: sendMessageValidation,
};
