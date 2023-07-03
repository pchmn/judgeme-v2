import { firestore } from 'firebase-admin';
import { UserRecord } from 'firebase-admin/auth';
import { getMessaging } from 'firebase-admin/messaging';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';

import { functions, testFunctions, wrapCallableFunction } from '../__test__/setup';

const wrapped = wrapCallableFunction(functions.sendMessage);

describe('[sendMessage] Validation', () => {
  test('should throw an error if no data', async () => {
    try {
      await wrapped({ data: undefined });
    } catch (error: any) {
      expect(error.message).toEqual('Invalid data');
    }
  });

  test('should throw an error if data is invalid', async () => {
    const data = {
      to: 1,
    };

    try {
      await wrapped({ data });
    } catch (error: any) {
      expect(error.message).toEqual('Invalid data');
    }
  });

  test('should throw an error if not authenticated', async () => {
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
  let user: UserRecord;

  beforeAll(async () => {
    user = testFunctions.auth.makeUserRecord({ uid: 'user-test' });
    await firestore()
      .collection('users')
      .doc(user.uid)
      .set({
        geohash: 'u0xj',
        geopoint: new firestore.GeoPoint(48.856614, 2.3522219),
      });
    await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('private')
      .doc('devices')
      .set({
        'installation-id': {
          name: 'Google Pixel 6',
          os: 'Android',
          osVersion: '13.0',
          pushToken: 'push-token',
          language: 'en',
        },
      });
    await firestore()
      .collection('messages')
      .doc('love_you')
      .set({
        emoji: '❤️',
        translations: {
          en: 'I love you',
        },
      });
  });

  afterAll(async () => {
    await firestore().collection('users').doc(user.uid).delete();
  });

  test('should send a message', async () => {
    vi.spyOn(getMessaging(), 'sendMulticast').mockResolvedValue({ successCount: 1, failureCount: 0, responses: [] });

    const data = {
      to: user.uid,
      message: 'love_you',
    };

    const auth = {
      token: {
        uid: user.uid,
      },
    };

    const result = await wrapped({ data, auth });

    expect(result).toEqual({ successCount: 1, failureCount: 0 });
  });

  test('should fail to send message', async () => {
    vi.spyOn(getMessaging(), 'sendMulticast').mockResolvedValue({ successCount: 0, failureCount: 1, responses: [] });

    const data = {
      to: user.uid,
      message: 'love_you',
    };

    const auth = {
      token: {
        uid: user.uid,
      },
    };

    const result = await wrapped({ data, auth });

    expect(result).toEqual({ successCount: 0, failureCount: 1 });
  });
});
