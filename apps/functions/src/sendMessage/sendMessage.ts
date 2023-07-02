import { DevicesDocument, FunctionParams, FunctionValidation, Message, UserDocument } from '@kuzpot/core';
import { Logtail } from '@logtail/node';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging, MulticastMessage } from 'firebase-admin/messaging';
import { HttpsError } from 'firebase-functions/v2/https';
import { CallableRequest } from 'firebase-functions/v2/https';
import { distanceBetween } from 'geofire-common';

const db = getFirestore(initializeApp());
const messaging = getMessaging();

const logtail = new Logtail(process.env.BETTERSTACK_TOKEN || '');

export async function sendMessage({ data, auth }: CallableRequest<FunctionParams['sendMessage']>) {
  const startTime = Date.now();
  try {
    FunctionValidation['sendMessage'].parse(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logtail.error('[sendMessage] Invalid data', {
      error: { ...error },
      params: { ...data, from: auth?.token?.uid || 'unknown' },
    });
    throw new HttpsError('invalid-argument', 'Invalid data', error.issues);
  }

  const { to, message: messageKey } = data;
  const currentToken = auth?.token;

  if (!currentToken) {
    logtail.error('[sendMessage] User must be authenticated', {
      params: { ...data, from: 'unknown' },
    });
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  const message = (await db.collection('messages').doc(messageKey).get()).data() as Message;

  const sender = (await db.collection('users').doc(currentToken.uid).get()).data() as UserDocument;

  const recipient = (await db.collection('users').doc(to).get()).data() as UserDocument;

  const recipientDevice = (
    await db.collection('users').doc(to).collection('private').doc('devices').get()
  ).data() as DevicesDocument;

  if (!recipientDevice || Object.keys(recipientDevice).length === 0) {
    logtail.error('[sendMessage] Recipient has no devices', {
      params: { ...data, from: currentToken.uid },
      recipientDevice: JSON.stringify(recipientDevice),
    });
    throw new HttpsError('not-found', 'Recipient has no devices');
  }

  const distanceBetweenUsers = distanceBetween(
    [sender.geopoint.latitude, sender.geopoint.longitude],
    [recipient.geopoint.latitude, recipient.geopoint.longitude]
  );

  const messageTitle = `${message.emoji} ${getMessageTranslation(
    recipientDevice[Object.keys(recipientDevice)[0]].language,
    message
  )}`;
  const messageBody = `à ${
    distanceBetweenUsers < 1 ? Math.round(distanceBetweenUsers * 1000) + 'm' : Math.round(distanceBetweenUsers) + 'km'
  }`;

  const tokens = Object.values(recipientDevice).map(({ pushToken }) => pushToken);

  const pushMessage: MulticastMessage = {
    data: {
      message: messageKey,
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

  await db
    .collection('users')
    .doc(currentToken.uid)
    .collection('private')
    .doc('history')
    .collection('messagesSent')
    .add({
      to,
      message: messageKey,
    });

  await db.collection('users').doc(to).collection('private').doc('history').collection('messagesReceived').add({
    from: currentToken.uid,
    message: messageKey,
  });

  logtail.info('[sendMessage] Message sent', {
    params: { ...data, from: currentToken.uid },
    success: batchResponse.successCount,
    failure: batchResponse.failureCount,
    executionTime: `${Date.now() - startTime}ms`,
  });

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
