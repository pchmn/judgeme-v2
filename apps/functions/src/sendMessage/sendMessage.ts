import { DevicesDocument, FunctionName, FunctionParams, FunctionValidation, Message, UserDocument } from '@kuzpot/core';
import { Logtail } from '@logtail/node';
import { initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { getMessaging, TokenMessage } from 'firebase-admin/messaging';
import { HttpsError } from 'firebase-functions/v2/https';
import { CallableRequest } from 'firebase-functions/v2/https';
import { distanceBetween } from 'geofire-common';

import { getLocaleWithouRegionCode, i18n } from '../i18n';

const db = getFirestore(initializeApp());
const messaging = getMessaging();

const logtail = new Logtail(process.env.BETTERSTACK_TOKEN || 'unknown');

export async function sendMessage(req: CallableRequest<FunctionParams['sendMessage']>) {
  const startTime = Date.now();

  const {
    data: { to, message: messageKey },
    currentToken,
  } = validateCallableRequest(req, 'sendMessage');

  const message = (await db.collection('messages').doc(messageKey).get()).data() as Message;

  const sender = (await db.collection('users').doc(currentToken.uid).get()).data() as UserDocument;

  const recipient = (await db.collection('users').doc(to).get()).data() as UserDocument;

  const distanceBetweenUsers = distanceBetween(
    [sender.geopoint.latitude, sender.geopoint.longitude],
    [recipient.geopoint.latitude, recipient.geopoint.longitude]
  );

  const batchResponse = await sendPushNotifications(to, {
    message: { ...message, key: messageKey },
    distanceBetweenUsers,
  });

  // Update sender statistics
  await db
    .collection('users')
    .doc(currentToken.uid)
    .update({
      [`statistics.sentCount.${messageKey}`]: FieldValue.increment(1),
      'statistics.sentCount.total': FieldValue.increment(1),
      'statistics.averageSentDistance': sender.statistics?.averageReceivedDistance
        ? (sender.statistics.averageSentDistance * sender.statistics.sentCount.total + distanceBetweenUsers) /
          (sender.statistics.sentCount.total + 1)
        : distanceBetweenUsers,
    });
  // Update sender history
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

  // Update recipient statistics
  await db
    .collection('users')
    .doc(to)
    .update({
      [`statistics.receivedCount.${messageKey}`]: FieldValue.increment(1),
      'statistics.receivedCount.total': FieldValue.increment(1),
      'statistics.averageReceivedDistance': sender.statistics?.averageReceivedDistance
        ? (sender.statistics.averageReceivedDistance * sender.statistics.receivedCount.total + distanceBetweenUsers) /
          (sender.statistics.receivedCount.total + 1)
        : distanceBetweenUsers,
    });
  // Update recipient history
  await db.collection('users').doc(to).collection('private').doc('history').collection('messagesReceived').add({
    from: currentToken.uid,
    message: messageKey,
  });

  logtail.info('[sendMessage] Message sent', {
    params: { ...req.data, from: currentToken.uid },
    success: batchResponse.successCount,
    failure: batchResponse.failureCount,
    executionTime: `${Date.now() - startTime}ms`,
  });

  return { successCount: batchResponse.successCount, failureCount: batchResponse.failureCount };
}

function validateCallableRequest<T extends FunctionName>(
  { data, auth }: CallableRequest<FunctionParams[T]>,
  functionName: T
) {
  try {
    FunctionValidation[functionName].parse(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logtail.error(`${functionName} Invalid data`, {
      error: { ...error },
      params: { ...data, from: auth?.token?.uid || 'unknown' },
    });
    throw new HttpsError('invalid-argument', 'Invalid data', error.issues);
  }

  if (!auth?.token) {
    logtail.error(`${functionName} User must be authenticated`, {
      params: { ...data, from: 'unknown' },
    });
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  return { data, currentToken: auth.token };
}

async function sendPushNotifications(
  to: string,
  { message, distanceBetweenUsers }: { message: Message & { key: string }; distanceBetweenUsers: number }
) {
  const pushMessages: TokenMessage[] = [];

  const recipientDevices = (
    await db.collection('users').doc(to).collection('private').doc('devices').get()
  ).data() as DevicesDocument;

  for (const installationId in recipientDevices) {
    const locale = recipientDevices[installationId].language;
    const title = `${message.emoji} ${getMessageTranslation(locale, message)}`;
    const body = i18n(locale).from(distanceBetweenUsers);
    const token = recipientDevices[installationId].pushToken;

    pushMessages.push({
      data: {
        message: message.key,
        distanceBetweenUsers: distanceBetweenUsers.toString(),
      },
      notification: {
        title,
        body,
      },
      android: {
        priority: 'high',
        notification: {
          channelId: 'Messages',
        },
      },
      token,
    });
  }

  return await messaging.sendAll(pushMessages);
}

function getMessageTranslation(locale: string, message: Message) {
  const language = getLocaleWithouRegionCode(locale);
  const translation = message.translations[language];

  return translation ? translation : message.translations['en'];
}
