import { distanceBetween, formatDistance } from '@kuzpot/core';
import { firestore } from 'firebase-admin';
import { UserRecord } from 'firebase-admin/auth';
import { Timestamp } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { i18n } from 'src/i18n';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { functions, testFunctions, wrapCallableFunction } from '../__test__/setup';

const wrapped = wrapCallableFunction(functions.sendMessage);

describe('[sendMessage] Validation', () => {
  it('should throw an error if no data', async () => {
    try {
      await wrapped({ data: undefined });
    } catch (error: any) {
      expect(error.message).toEqual('Invalid data');
    }
  });

  it('should throw an error if data is invalid', async () => {
    const data = {
      to: 1,
    };

    try {
      await wrapped({ data });
    } catch (error: any) {
      expect(error.message).toEqual('Invalid data');
    }
  });

  it('should throw an error if not authenticated', async () => {
    const data = {
      to: 'test',
      message: 'love_you',
    };

    try {
      await wrapped({ data, auth: undefined });
    } catch (error: any) {
      expect(error.message).toEqual('User must be authenticated');
    }
  });
});

describe('[sendMessage] Function', () => {
  let receiverUser: UserRecord;
  let senderUser: UserRecord;
  let data: unknown;
  let auth: unknown;
  let distance: number;

  beforeAll(async () => {
    receiverUser = testFunctions.auth.makeUserRecord({ uid: 'receiver-user' });
    senderUser = testFunctions.auth.makeUserRecord({ uid: 'sender-user' });

    const receiverRef = firestore().collection('users').doc(receiverUser.uid);
    const batch = firestore().batch();
    batch.set(receiverRef, {
      geohash: 'u0xj',
      geopoint: new firestore.GeoPoint(48.856614, 2.3522219),
    });
    batch.set(receiverRef.collection('private').doc('devices'), {
      'installation-id': {
        name: 'Google Pixel 6',
        os: 'Android',
        osVersion: '13.0',
        pushToken: 'push-token-sender',
        language: 'en',
      },
    });

    const senderRef = firestore().collection('users').doc(senderUser.uid);
    batch.set(senderRef, {
      geohash: 'u0xj',
      geopoint: new firestore.GeoPoint(48.10750068718423, -1.712865897767093),
    });
    batch.set(senderRef.collection('private').doc('devices'), {
      'installation-id': {
        name: 'Google Pixel 7',
        os: 'Android',
        osVersion: '13.0',
        pushToken: 'push-token-receiver',
        language: 'fr',
      },
    });
    await batch.commit();

    await firestore()
      .collection('messages')
      .doc('love_you')
      .set({
        emoji: '❤️',
        translations: {
          en: 'I love you',
          fr: "Je t'aime",
        },
      });

    distance = distanceBetween(
      new firestore.GeoPoint(48.856614, 2.3522219),
      new firestore.GeoPoint(48.10750068718423, -1.712865897767093)
    );

    data = {
      to: receiverUser.uid,
      message: 'love_you',
    };

    auth = {
      token: {
        uid: senderUser.uid,
      },
    };

    vi.spyOn(getMessaging(), 'sendAll');
  });

  afterAll(async () => {
    await firestore().recursiveDelete(firestore().collection('users'));
    await firestore().recursiveDelete(firestore().collection('messages'));
  });

  it('should fail to send message', async () => {
    vi.spyOn(getMessaging(), 'sendAll').mockResolvedValue({ successCount: 0, failureCount: 1, responses: [] });

    const result = await wrapped({ data, auth });

    expect(result).toEqual({ successCount: 0, failureCount: 1 });
  });

  it('should send a message', async () => {
    vi.spyOn(getMessaging(), 'sendAll').mockResolvedValue({ successCount: 1, failureCount: 0, responses: [] });

    const result = await wrapped({ data, auth });

    expect(result).toEqual({ successCount: 1, failureCount: 0 });
  });

  it('should use en translation', async () => {
    const sendAllSpy = vi
      .spyOn(getMessaging(), 'sendAll')
      .mockResolvedValue({ successCount: 1, failureCount: 0, responses: [] });

    await wrapped({ data, auth });

    expect(sendAllSpy.mock.calls[0][0][0].notification?.title).toEqual('❤️ I love you');
    expect(sendAllSpy.mock.calls[0][0][0].notification?.body).toEqual(i18n('en').from(formatDistance(distance)));
  });

  it('should use fr translation', async () => {
    const sendAllSpy = vi
      .spyOn(getMessaging(), 'sendAll')
      .mockResolvedValue({ successCount: 1, failureCount: 0, responses: [] });

    await firestore().collection('users').doc(receiverUser.uid).collection('private').doc('devices').update({
      'installation-id.language': 'fr',
    });
    await wrapped({ data, auth });

    expect(sendAllSpy.mock.calls[0][0][0].notification?.title).toEqual("❤️ Je t'aime");
    expect(sendAllSpy.mock.calls[0][0][0].notification?.body).toEqual(i18n('fr').from(formatDistance(distance)));
  });

  it('should update statistics', async () => {
    const receiverDocBefore = (await firestore().collection('users').doc(receiverUser.uid).get()).data();
    const senderDocBefore = (await firestore().collection('users').doc(senderUser.uid).get()).data();

    await wrapped({ data, auth });

    const receiverDocAfter = (await firestore().collection('users').doc(receiverUser.uid).get()).data();
    const senderDocAfter = (await firestore().collection('users').doc(senderUser.uid).get()).data();

    expect(receiverDocAfter?.messageStatistics).toEqual({
      averageReceivedDistance: distance,
      receivedCount: { love_you: (receiverDocBefore?.messageStatistics?.receivedCount?.love_you || 0) + 1 },
      receivedTotalCount: (receiverDocBefore?.messageStatistics?.receivedTotalCount || 0) + 1,
    });

    expect(senderDocAfter?.messageStatistics).toEqual({
      averageSentDistance: distance,
      sentCount: { love_you: (senderDocBefore?.messageStatistics?.sentCount?.love_you || 0) + 1 },
      sentTotalCount: (senderDocBefore?.messageStatistics?.sentTotalCount || 0) + 1,
    });
  });

  it('should update history', async () => {
    const receiverRef = firestore().collection('users').doc(receiverUser.uid);
    const senderRef = firestore().collection('users').doc(senderUser.uid);
    const receiverHistoryBefore = await receiverRef
      .collection('private')
      .doc('history')
      .collection('messagesReceived')
      .get();
    const senderHistoryBefore = await senderRef.collection('private').doc('history').collection('messagesSent').get();

    await wrapped({ data, auth });

    const receiverHistoryAfter = await receiverRef
      .collection('private')
      .doc('history')
      .collection('messagesReceived')
      .get();
    const senderHistoryAfter = await senderRef.collection('private').doc('history').collection('messagesSent').get();

    expect(receiverHistoryAfter.size).toEqual(receiverHistoryBefore.size + 1);
    expect(receiverHistoryAfter.docs[receiverHistoryAfter.size - 1].data()).toEqual(
      expect.objectContaining({
        from: senderUser.uid,
        message: 'love_you',
        distance,
      })
    );
    expect(receiverHistoryAfter.docs[receiverHistoryAfter.size - 1].data().createdAt).toBeInstanceOf(Timestamp);
    expect(receiverHistoryAfter.docs[receiverHistoryAfter.size - 1].data().updatedAt).toBeInstanceOf(Timestamp);

    expect(senderHistoryAfter.size).toEqual(senderHistoryBefore.size + 1);
    expect(senderHistoryAfter.docs[senderHistoryAfter.size - 1].data()).toEqual(
      expect.objectContaining({
        to: receiverUser.uid,
        message: 'love_you',
        distance,
      })
    );
    expect(senderHistoryAfter.docs[senderHistoryAfter.size - 1].data().createdAt).toBeInstanceOf(Timestamp);
    expect(senderHistoryAfter.docs[senderHistoryAfter.size - 1].data().updatedAt).toBeInstanceOf(Timestamp);
  });
});
