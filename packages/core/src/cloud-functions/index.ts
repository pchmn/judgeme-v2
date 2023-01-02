import { SendMessageParams, sendMessageValidation } from './sendMessage';

export type FunctionParams = {
  sendMessage: SendMessageParams;
};

export const FunctionValidation = {
  sendMessage: sendMessageValidation,
};

export type CallableFunctionName = keyof FunctionParams;
export type FunctionName = CallableFunctionName;
