import { DeviceInfo, Installation } from '@kuzpot/core';
import installations from '@react-native-firebase/installations';
import messaging from '@react-native-firebase/messaging';
import * as Application from 'expo-application';
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

export async function getDeviceInstallation(): Promise<Partial<Installation>> {
  const installationId = await installations().getId();
  let pushToken: string | undefined;
  try {
    pushToken = await messaging().getToken();
  } catch (err) {
    console.error('Error getting pushToken', err);
  }
  return {
    id: installationId,
    deviceName: `${Device.manufacturer} ${Device.modelName}`,
    osName: Device.osName || undefined,
    osVersion: Device.osVersion || undefined,
    pushToken: pushToken || '',
    appVersion: Application.nativeApplicationVersion || undefined,
    appIdentifier: Application.applicationId || undefined,
    deviceType: getDeviceType(Device.deviceType),
    deviceLocale: getDeviceLocale(),
  };
}

function getDeviceType(expoDeviceType: Device.DeviceType | null) {
  switch (expoDeviceType) {
    case Device.DeviceType.PHONE:
      return 'phone';
    case Device.DeviceType.TABLET:
      return 'tablet';
    case Device.DeviceType.DESKTOP:
      return 'desktop';
    case Device.DeviceType.TV:
      return 'tv';
    default:
      return undefined;
  }
}
