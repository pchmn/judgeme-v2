import { DevicesDocument } from '@kavout/core';
import { useEffectOnce, useFirebaseAuthUser, useFirestoreSetDoc, useSecureStore } from '@kavout/react-native';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';

import { getInstallationDevice, InstallationDevice } from './utils';

function areStoredDataOutdated(storedData: InstallationDevice | undefined, actualData: InstallationDevice) {
  if (!storedData) return true;

  return JSON.stringify(storedData) !== JSON.stringify(actualData);
}

export function useRegisterDevice() {
  const { value: storedData, set } = useSecureStore<InstallationDevice>('installationDevice');

  const { data: currentUser } = useFirebaseAuthUser();

  const { mutate } = useFirestoreSetDoc<DevicesDocument>();

  const register = useCallback(
    async (uid: string) => {
      const installationDevice = await getInstallationDevice();
      if (installationDevice && areStoredDataOutdated(storedData, installationDevice)) {
        const ref = firestore().collection('users').doc(uid).collection('private').doc('devices');
        mutate({ ref, data: installationDevice }, { onSuccess: () => set(installationDevice) });
      }
    },
    [mutate, set, storedData]
  );

  useEffectOnce(() => {
    const unsubscribe = messaging().onTokenRefresh(async () => {
      if (currentUser) await register(currentUser.uid);
    });

    return () => unsubscribe();
  });

  useEffect(() => {
    messaging().onMessage(async (message) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(message));
    });
  }, []);

  return { register };
}
