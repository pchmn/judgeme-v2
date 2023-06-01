import { DevicesDocument, FunctionParams, FunctionValidation, Message, UserDocument } from '@kuzpot/core';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging, MulticastMessage } from 'firebase-admin/messaging';
import { CallableContext, HttpsError } from 'firebase-functions/v1/https';
import { distanceBetween } from 'geofire-common';

const db = getFirestore(initializeApp());
const messaging = getMessaging();

export async function sendMessage(data: FunctionParams['sendMessage'], context: CallableContext) {
  try {
    FunctionValidation['sendMessage'].parse(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new HttpsError('invalid-argument', 'Invalid data', error.issues);
  }

  const { to, message } = data;
  const currentToken = context.auth?.token;

  if (!currentToken) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  const messageDoc = (await db.collection('messages').doc(message).get()).data() as Message;

  const sender = (await db.collection('users').doc(currentToken.uid).get()).data() as UserDocument;

  const recipient = (await db.collection('users').doc(to).get()).data() as UserDocument;

  const recipientDevice = (
    await db.collection('users').doc(to).collection('private').doc('devices').get()
  ).data() as DevicesDocument;

  const distanceBetweenUsers = distanceBetween(
    [sender.geopoint.latitude, sender.geopoint.longitude],
    [recipient.geopoint.latitude, recipient.geopoint.longitude]
  );

  const messageTitle = `${messageDoc.emoji} ${getMessageTranslation(
    recipientDevice[Object.keys(recipientDevice)[0]].language,
    messageDoc
  )}`;
  const messageBody = `à ${
    distanceBetweenUsers < 1 ? Math.round(distanceBetweenUsers * 1000) + 'm' : Math.round(distanceBetweenUsers) + 'km'
  }`;

  const tokens = Object.values(recipientDevice).map(({ pushToken }) => pushToken);

  const pushMessage: MulticastMessage = {
    data: {
      message,
      distanceBetweenUsers: distanceBetweenUsers.toString(),
    },
    notification: {
      title: messageTitle,
      body: messageBody,
    },
    android: {
      priority: 'high',
      notification: {
        channelId: 'Messages',
      },
    },
    tokens,
  };

  const batchResponse = await messaging.sendMulticast(pushMessage);

  return { successCount: batchResponse.successCount, failureCount: batchResponse.failureCount };
}

function getMessageTranslation(language: string, message: Message) {
  let translation = message.translations[language];
  if (!translation && language.includes('-')) {
    translation = message.translations[language.split('-')[0]];
  }
  if (!translation) {
    translation = message.translations['en'];
  }
  return translation;
}
