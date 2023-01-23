import 'dotenv/config';

import { DeviceDocument, FunctionParams, FunctionValidation } from '@kavout/core';
import Expo from 'expo-server-sdk';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { CallableContext, HttpsError } from 'firebase-functions/v1/https';

const expoClient = new Expo({ accessToken: process.env.EXPO_TOKEN });
const db = getFirestore(initializeApp());

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

  const recipientDevice = (await db.collection('devices').doc(to).get()).data() as DeviceDocument;
  console.log('recipientDevice', recipientDevice);

  const receiptIds = [];
  for (const token of recipientDevice.expoTokens) {
    if (!Expo.isExpoPushToken(token)) {
      console.error(`Push token ${token} is not a valid Expo push token`);
      continue;
    }

    const res = await expoClient.sendPushNotificationsAsync([
      {
        to: token,
        title: 'Push notification title',
        priority: 'high',
        data: { withSome: 'data' },
      },
    ]);
    console.log('res', res);
    receiptIds.push(res.filter(({ status }) => status === 'ok').map((ticket: any) => ticket.id));
  }

  for (const receiptId of receiptIds) {
    console.log('receiptId', await expoClient.getPushNotificationReceiptsAsync(receiptId));
  }

  return { success: true };
};
