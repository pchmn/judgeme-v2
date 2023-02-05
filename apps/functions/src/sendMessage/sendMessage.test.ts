import { firestore } from 'firebase-admin';
import { UserRecord } from 'firebase-admin/auth';
import { getMessaging } from 'firebase-admin/messaging';
import { functions, testFunctions } from 'src/__test__/setup';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';

const wrapped = testFunctions.wrap(functions.sendMessage);

describe('[sendMessage] Validation', () => {
  test('should throw an error if no data', async () => {
    try {
      await wrapped(undefined);
    } catch (error: any) {
      expect(error.message).toEqual('Invalid data');
    }
  });

  test('should throw an error if data is invalid', async () => {
    const data = {
      to: 1,
    };

    try {
      await wrapped(data);
    } catch (error: any) {
      expect(error.message).toEqual('Invalid data');
    }
  });

  test('should throw an error if not authenticated', async () => {
    const data = {
      to: 'test',
    };
    const context = {
      auth: undefined,
    };

    try {
      await wrapped(data, context);
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
      .collection('private')
      .doc('devices')
      .set({
        'installation-id': {
          name: 'Google Pixel 6',
          os: 'Android',
          osVersion: '13.0',
          pushToken: 'push-token',
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
    };

    const context = {
      auth: {
        token: {
          uid: user.uid,
        },
      },
    };

    const result = await wrapped(data, context);

    expect(result).toEqual({ successCount: 1, failureCount: 0 });
  });

  test('should fail to send message', async () => {
    vi.spyOn(getMessaging(), 'sendMulticast').mockResolvedValue({ successCount: 0, failureCount: 1, responses: [] });

    const data = {
      to: user.uid,
    };

    const context = {
      auth: {
        token: {
          uid: user.uid,
        },
      },
    };

    const result = await wrapped(data, context);

    expect(result).toEqual({ successCount: 0, failureCount: 1 });
  });
});
