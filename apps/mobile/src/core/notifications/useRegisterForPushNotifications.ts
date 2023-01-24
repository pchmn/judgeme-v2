import { DeviceInfo, UserDocument } from '@kavout/core';
import { useFirestoreSetDoc, useSecureStore } from '@kavout/react';
import firestore from '@react-native-firebase/firestore';
import installations from '@react-native-firebase/installations';
import { useCallback } from 'react';

import { getDeviceInfo } from './utils';

function areStoredInfoOutdated(storedInfo: DeviceInfo | undefined, acutalInfo: DeviceInfo) {
  if (!storedInfo) return true;

  return JSON.stringify(storedInfo) !== JSON.stringify(acutalInfo);
}

export function useRegisterForPushNotifications() {
  const { value: storeInfo, set } = useSecureStore<DeviceInfo>('deviceInfo');

  const { mutate } = useFirestoreSetDoc<UserDocument>();

  const register = useCallback(
    async (uid: string) => {
      const deviceInfo = await getDeviceInfo();
      const installationId = await installations().getId();
      if (deviceInfo && areStoredInfoOutdated(storeInfo, deviceInfo)) {
        const ref = firestore().collection<UserDocument>('users').doc(uid);
        mutate({ ref, data: { devices: { [installationId]: deviceInfo } } }, { onSuccess: () => set(deviceInfo) });
      }
    },
    [mutate, set, storeInfo]
  );

  return { register };
}
