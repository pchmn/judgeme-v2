import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

async function checkNotificationsPermission() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    console.log({ finalStatus });
    if (Platform.OS === 'android') {
      console.log('Notifications.setNotificationChannelAsync');
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

export async function registerForPushNotifications() {
  const status = await checkNotificationsPermission();
  if (status !== 'granted') {
    return;
  }
  const expoToken = (await Notifications.getExpoPushTokenAsync()).data;
  const nativeToken = (await Notifications.getDevicePushTokenAsync()).data;
  console.log({ expoToken, nativeToken });
}
