import { Installation, UPSERT_INSTALLATION_MUTATION } from '@kuzpot/core';
import { useEffectOnce, useInsertMutation } from '@kuzpot/react-native';
import { useUserData } from '@nhost/react';
import messaging from '@react-native-firebase/messaging';
import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';

import { getDeviceInstallation, InstallationDevice } from './utils';

function areStoredDataOutdated(storedData: InstallationDevice | undefined, actualData: InstallationDevice) {
  if (!storedData) return true;

  return JSON.stringify(storedData) !== JSON.stringify(actualData);
}

export function useRegisterDevice() {
  const userData = useUserData();
  const [upsert] = useInsertMutation<Installation>(UPSERT_INSTALLATION_MUTATION);

  const register = useCallback(
    async (userId: string) => {
      const installation = await getDeviceInstallation();
      await upsert({ id: installation.id, kuzerId: userId, ...installation });
    },
    [upsert]
  );

  useEffectOnce(() => {
    const unsubscribe = messaging().onTokenRefresh(async () => {
      if (userData) await register(userData.id);
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
