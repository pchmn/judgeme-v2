import {
  distanceBetween,
  formatDistance,
  INSERT_MESSAGE_HISTORY,
  Kuzer,
  LatLng,
  Message,
  SELECT_KUZER_BY_ID,
  SELECT_MESSAGE_BY_ID,
  UPDATE_KUZER,
} from '@kuzpot/core';
import { NhostClient } from '@nhost/nhost-js';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getMessaging, TokenMessage } from 'firebase-admin/messaging';

import { getLocaleWithouRegionCode, i18n } from '../../i18n/i18n.js';
import { logger } from '../../utils/logger.js';
import { validateRequest } from '../../utils/validateRequest.js';

const app = initializeApp({
  credential: credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '')),
});
const messaging = getMessaging(app);

const nhost = new NhostClient({
  authUrl: process.env.NHOST_AUTH_URL,
  graphqlUrl: process.env.NHOST_GRAPHQL_URL,
  storageUrl: process.env.NHOST_STORAGE_URL,
  functionsUrl: process.env.NHOST_FUNCTIONS_URL,
  adminSecret: process.env.NHOST_ADMIN_SECRET,
});

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const { currentToken, body } = validateRequest('sendMessage', event, context);

  const { data: sender } = await nhost.graphql.request<{ kuzers_by_pk: Kuzer }>(SELECT_KUZER_BY_ID, {
    id: currentToken.userId,
  });
  const { data: receiver } = await nhost.graphql.request<{ kuzers_by_pk: Kuzer }>(SELECT_KUZER_BY_ID, {
    id: body.to,
  });
  const { data: message } = await nhost.graphql.request<{ messages_by_pk: Message }>(SELECT_MESSAGE_BY_ID, {
    id: body.messageId,
  });

  if (!sender || !receiver || !message) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Not found',
      }),
    };
  }

  const distance = distanceBetween(
    new LatLng(sender.kuzers_by_pk.geopoint.coordinates),
    new LatLng(receiver.kuzers_by_pk.geopoint.coordinates)
  );

  const sentAt = new Date();
  const pushNotificationsResponse = await sendPushNotifications(receiver.kuzers_by_pk, {
    message: message.messages_by_pk,
    distance,
  });

  const insertMessageRes = await nhost.graphql.request(INSERT_MESSAGE_HISTORY, {
    data: {
      fromId: currentToken.userId,
      toId: body.to,
      messageId: body.messageId,
      distance,
      sentAt,
    },
  });
  logger.log('insertMessageRes', JSON.stringify(insertMessageRes, null, 2));

  const newSenderStatistics = { ...sender.kuzers_by_pk.messageStatistics };
  newSenderStatistics.sentCount[message.messages_by_pk.id] =
    (newSenderStatistics.sentCount[message.messages_by_pk.id] ?? 0) + 1;
  newSenderStatistics.sentTotalCount = newSenderStatistics.sentTotalCount + 1;
  newSenderStatistics.averageSentDistance =
    (newSenderStatistics.averageSentDistance * newSenderStatistics.sentTotalCount + distance) /
    (newSenderStatistics.sentTotalCount + 1);
  const updateSenderRes = await nhost.graphql.request(UPDATE_KUZER, {
    id: currentToken.userId,
    data: {
      messageStatistics: newSenderStatistics,
    },
  });
  logger.log('updateSenderRes', JSON.stringify(updateSenderRes, null, 2));

  const newReceiverStatistics = { ...receiver.kuzers_by_pk.messageStatistics };
  newReceiverStatistics.receivedCount[message.messages_by_pk.id] =
    (newReceiverStatistics.receivedCount[message.messages_by_pk.id] ?? 0) + 1;
  newReceiverStatistics.receivedTotalCount = newReceiverStatistics.receivedTotalCount + 1;
  newReceiverStatistics.averageReceivedDistance =
    (newReceiverStatistics.averageReceivedDistance * newReceiverStatistics.receivedTotalCount + distance) /
    (newReceiverStatistics.receivedTotalCount + 1);
  const updateReceiverRes = await nhost.graphql.request(UPDATE_KUZER, {
    id: receiver.kuzers_by_pk.id,
    data: {
      messageStatistics: newReceiverStatistics,
    },
  });
  logger.log('updateReceiverRes', JSON.stringify(updateReceiverRes, null, 2));

  return {
    statusCode: 200,
    body: JSON.stringify({
      successCount: pushNotificationsResponse.successCount,
      failureCount: pushNotificationsResponse.failureCount,
    }),
  };
};

async function sendPushNotifications(to: Kuzer, { message, distance }: { message: Message; distance: number }) {
  const pushMessages: TokenMessage[] = [];

  for (const installation of to.installations || []) {
    const locale = installation.deviceLocale;
    const title = `${message.emoji} ${getMessageTranslation(locale, message)}`;
    const body = i18n(locale).from(formatDistance(distance));
    const token = installation.pushToken;

    if (!token) {
      // logtail.warn('[sendMessage] No token found', {
      //   params: { user: to, installationId },
      // });
      continue;
    }

    pushMessages.push({
      data: {
        message: message.slug,
        distance: formatDistance(distance),
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

  return messaging.sendAll(pushMessages).catch((error) => {
    // logtail.error('[sendMessage] Error sending push notifications', {
    //   error: { ...error },
    //   params: { to, message: message.key },
    // });
    throw error;
  });
}

function getMessageTranslation(locale: string, message: Message) {
  const language = getLocaleWithouRegionCode(locale);
  const translation = message.translations[language];

  return translation ? translation : message.translations['en'];
}
