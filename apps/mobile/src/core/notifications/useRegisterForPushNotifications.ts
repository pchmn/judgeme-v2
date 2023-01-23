import { DeviceDocument } from '@kavout/core';
import { useFirebaseAuthUser, useFirestoreSetDoc, useSecureStore } from '@kavout/react';
import firestore from '@react-native-firebase/firestore';
import { useCallback, useEffect, useMemo } from 'react';

import { DevicePushTokens, getDevicePushTokens } from './utils';

function areStoredTokensOutdated(storedTokens: DevicePushTokens | undefined, tokens: DevicePushTokens) {
  if (!storedTokens) return true;
  return (
    storedTokens.expoToken !== tokens.expoToken ||
    storedTokens.fcmToken !== tokens.fcmToken ||
    storedTokens.apnToken !== tokens.apnToken
  );
}

function mapTokensToDocument(tokens: DevicePushTokens) {
  const dataDoc = { expoTokens: firestore.FieldValue.arrayUnion(tokens.expoToken) };
  return tokens.fcmToken
    ? { ...dataDoc, fcmTokens: firestore.FieldValue.arrayUnion(tokens.fcmToken) }
    : { ...dataDoc, apnTokens: firestore.FieldValue.arrayUnion(tokens.apnToken) };
}

export function useRegisterForPushNotifications() {
  const { value: storedTokens, isLoading, set } = useSecureStore<DevicePushTokens>('pushTokens');

  const { data: currentUser } = useFirebaseAuthUser();

  const devicesRef = useMemo(
    () => (currentUser ? firestore().collection<DeviceDocument>('devices').doc(currentUser.uid) : undefined),
    [currentUser]
  );
  const { mutate } = useFirestoreSetDoc<DeviceDocument>();

  const register = useCallback(async () => {
    const tokens = await getDevicePushTokens();
    if (tokens && areStoredTokensOutdated(storedTokens, tokens) && devicesRef) {
      mutate({ ref: devicesRef, data: mapTokensToDocument(tokens) }, { onSuccess: () => set(tokens) });
    }
  }, [devicesRef, mutate, set, storedTokens]);

  useEffect(() => {
    if (!isLoading && devicesRef) {
      register();
    }
  }, [isLoading, register, devicesRef]);
}
