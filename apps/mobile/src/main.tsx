import '@/core/i18n';

import { UiProvider } from '@kavout/react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/functions';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AndroidImportance, setNotificationChannelAsync } from 'expo-notifications';
import { preventAutoHideAsync } from 'expo-splash-screen';
import { getSystemTheme } from 'expo-system-theme';
import { Platform } from 'react-native';

import App from './App';

preventAutoHideAsync();

const queryClient = new QueryClient();

if (__DEV__) {
  firestore().useEmulator('192.168.1.10', 8080);
  auth().useEmulator('http://192.168.1.10:9099');
  firebase.app().functions('europe-west1').useEmulator('192.168.1.10', 5001);
}

if (Platform.OS === 'android') {
  setNotificationChannelAsync('Messages', {
    name: 'Messages',
    importance: AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });
}

export default function Main() {
  const theme = getSystemTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <UiProvider baseColor={theme?.baseColor}>
        <App />
      </UiProvider>
    </QueryClientProvider>
  );
}
