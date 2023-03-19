import { DevicesDocument } from '@kavout/core';
import { useEffectOnce, useFirebaseAuthUser, useFirestoreSetDoc, useSecureStorage } from '@kavout/react-native';
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
  const [existingInstallationDevice, setInstallationDevice] =
    useSecureStorage<InstallationDevice>('installationDevice');

  const { data: currentUser } = useFirebaseAuthUser();

  const { mutate } = useFirestoreSetDoc<DevicesDocument>();

  const register = useCallback(
    async (uid: string) => {
      const installationDevice = await getInstallationDevice();
      if (installationDevice && areStoredDataOutdated(existingInstallationDevice, installationDevice)) {
        const ref = firestore().collection('users').doc(uid).collection('private').doc('devices');
        mutate({ ref, data: installationDevice }, { onSuccess: () => setInstallationDevice(installationDevice) });
      }
    },
    [mutate, setInstallationDevice, existingInstallationDevice]
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
