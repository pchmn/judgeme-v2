import Constants from 'expo-constants';
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
      Notifications.setNotificationChannelAsync('default', {
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

export async function getDevicePushTokens(): Promise<DevicePushTokens | undefined> {
  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    // const status = await checkNotificationsPermission();
    // if (status !== 'granted') {
    //   return;
    // }
    const expoToken = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    const nativeToken = await Notifications.getDevicePushTokenAsync();
    return nativeToken.type === 'android'
      ? { expoToken, fcmToken: nativeToken.data }
      : { expoToken, apnToken: nativeToken.data };
  } catch (e) {
    console.error(e);
  }
}
