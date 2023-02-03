import { FunctionParams, FunctionValidation } from '@kavout/core';
import { CallableContext, HttpsError } from 'src/types';

export default async (data: FunctionParams['sendMessage'], context: CallableContext) => {
  try {
    FunctionValidation['sendMessage'].parse(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new HttpsError('invalid-argument', 'Invalid data', error.issues);
  }

  const currentToken = context.auth?.token;

  if (!currentToken) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  return { success: true };
};
