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

  const senderRef = db.collection('users').doc(currentToken.uid);
  const sender = (await senderRef.get()).data() as UserDocument;

  const receiverRef = db.collection('users').doc(to);
  const receiver = (await receiverRef.get()).data() as UserDocument;

  const distance = distanceBetween(
    [sender.geopoint.latitude, sender.geopoint.longitude],
    [receiver.geopoint.latitude, receiver.geopoint.longitude]
  );

  const pushNotificationsResponse = await sendPushNotifications(to, {
    message: { ...message, key: messageKey },
    distance,
  });

  const batch = db.batch();
  // Update sender statistics
  batch.update(senderRef, {
    [`messageStatistics.sentCount.${messageKey}`]: FieldValue.increment(1),
    'messageStatistics.sentTotalCount': FieldValue.increment(1),
    'messageStatistics.averageSentDistance': sender.messageStatistics?.averageReceivedDistance
      ? (sender.messageStatistics.averageSentDistance * sender.messageStatistics.sentTotalCount + distance) /
        (sender.messageStatistics.sentTotalCount + 1)
      : distance,
  });
  // Update sender history
  batch.create(senderRef.collection('private').doc('history').collection('messagesSent').doc(), {
    to,
    message: messageKey,
    distance,
  });
  // Update recipient statistics
  batch.update(receiverRef, {
    [`messageStatistics.receivedCount.${messageKey}`]: FieldValue.increment(1),
    'messageStatistics.receivedTotalCount': FieldValue.increment(1),
    'messageStatistics.averageReceivedDistance': sender.messageStatistics?.averageReceivedDistance
      ? (sender.messageStatistics.averageReceivedDistance * sender.messageStatistics.receivedTotalCount + distance) /
        (sender.messageStatistics.receivedTotalCount + 1)
      : distance,
  });
  // Update recipient history
  batch.create(receiverRef.collection('private').doc('history').collection('messagesReceived').doc(), {
    from: currentToken.uid,
    message: messageKey,
    distance,
  });

  await batch.commit();

  logtail.info('[sendMessage] Message sent', {
    params: { ...req.data, from: currentToken.uid },
    success: pushNotificationsResponse.successCount,
    failure: pushNotificationsResponse.failureCount,
    executionTime: `${Date.now() - startTime}ms`,
  });

  return { successCount: pushNotificationsResponse.successCount, failureCount: pushNotificationsResponse.failureCount };
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
  { message, distance }: { message: Message & { key: string }; distance: number }
) {
  const pushMessages: TokenMessage[] = [];

  const recipientDevices = (
    await db.collection('users').doc(to).collection('private').doc('devices').get()
  ).data() as DevicesDocument;

  for (const installationId in recipientDevices) {
    const locale = recipientDevices[installationId].language;
    const title = `${message.emoji} ${getMessageTranslation(locale, message)}`;
    const body = i18n(locale).from(distance);
    const token = recipientDevices[installationId].pushToken;

    pushMessages.push({
      data: {
        message: message.key,
        distance: distance.toString(),
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
