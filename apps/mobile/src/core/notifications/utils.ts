import { DeviceInfo } from '@kavout/core';
import messaging from '@react-native-firebase/messaging';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export interface DevicePushTokens {
  expoToken: string;
  fcmToken?: string;
  apnToken?: string;
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

export async function getDeviceInfo(): Promise<DeviceInfo | undefined> {
  try {
    const pushToken = await messaging().getToken();
    return {
      name: `${Device.manufacturer} ${Device.modelName}`,
      os: `${Device.osName}`,
      osVersion: `${Device.osVersion}`,
      pushToken,
    };
  } catch (e) {
    console.error(e);
  }
}
