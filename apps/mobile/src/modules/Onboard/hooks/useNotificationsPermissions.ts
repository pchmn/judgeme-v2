import {
  getPermissionsAsync as getNotificationsPermissionsAsync,
  NotificationPermissionsStatus,
  requestPermissionsAsync as requestNotificationsPermissionsAsync,
} from 'expo-notifications';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

export function useNotificationsPermissions() {
  const [notificationsPermission, setNotificationsPermission] = useState<NotificationPermissionsStatus>();

  const checkNotificationsPermission = async () => {
    const notificationsPermission = await getNotificationsPermissionsAsync();
    setNotificationsPermission((prev) =>
      JSON.stringify(prev) !== JSON.stringify(notificationsPermission) ? notificationsPermission : prev
    );
  };

  const requestPermissions = async () => {
    const notificationsPermission = await requestNotificationsPermissionsAsync();
    setNotificationsPermission((prev) =>
      JSON.stringify(prev) !== JSON.stringify(notificationsPermission) ? notificationsPermission : prev
    );
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
        await checkNotificationsPermission();
      }
    });

    checkNotificationsPermission();

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    notificationsPermission,
    isLoading: notificationsPermission === undefined,
    requestPermissions,
  };
}
