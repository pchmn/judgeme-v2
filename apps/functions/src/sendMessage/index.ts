import 'dotenv/config';

import { DevicesDocument, FunctionParams, FunctionValidation } from '@kavout/core';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging, MulticastMessage } from 'firebase-admin/messaging';
import { CallableContext, HttpsError } from 'firebase-functions/v1/https';

const db = getFirestore(initializeApp());
const messaging = getMessaging();

export default async (data: FunctionParams['sendMessage'], context: CallableContext) => {
  try {
    FunctionValidation['sendMessage'].parse(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new HttpsError('invalid-argument', 'Invalid data', error.issues);
  }

  const currentToken = context.auth?.token;

  // if (!currentToken) {
  //   throw new HttpsError('unauthenticated', 'User must be authenticated');
  // }

  const { to } = data;

  const recipientDevice = (
    await db.collection('users').doc(to).collection('private').doc('devices').get()
  ).data() as DevicesDocument;

  const tokens = Object.values(recipientDevice).map(({ pushToken }) => pushToken);

  const message: MulticastMessage = {
    data: {
      message: 'hello',
    },
    notification: {
      title: 'Hello',
      body: 'World',
    },
    android: {
      priority: 'high',
    },
    tokens,
  };

  try {
    messaging.sendMulticast(message);
    console.log('Message sent successfully');
  } catch (error) {
    console.error(error);
  }

  return { success: true };
};
