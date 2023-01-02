import { FunctionParams, FunctionValidation } from '@judgeme/core';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { CallableContext, HttpsError } from 'firebase-functions/v1/https';

const db = getFirestore(initializeApp());

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
