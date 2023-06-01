import { DeviceInfo } from '@kuzpot/core';
import installations from '@react-native-firebase/installations';
import messaging from '@react-native-firebase/messaging';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { getDeviceLocale } from '../i18n';

export interface InstallationDevice {
  [installationId: string]: DeviceInfo;
}

async function checkNotificationsPermission() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    return finalStatus;
  } else {
    return 'undetermined';
  }
}

export async function getInstallationDevice(): Promise<InstallationDevice | undefined> {
  const pushToken = await messaging().getToken();
  const installationId = await installations().getId();
  return {
    [installationId]: {
      name: `${Device.manufacturer} ${Device.modelName}`,
      os: `${Device.osName}`,
      osVersion: `${Device.osVersion}`,
      pushToken,
      language: getDeviceLocale(),
    },
  };
}
