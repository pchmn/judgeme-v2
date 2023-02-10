import '@/core/i18n';

import { UiProvider } from '@kavout/react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/functions';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getSystemTheme } from 'expo-system-theme';

import App from './App';

const queryClient = new QueryClient();

if (__DEV__) {
  firestore().useEmulator('192.168.1.10', 8080);
  auth().useEmulator('http://192.168.1.10:9099');
  firebase.app().functions('europe-west1').useEmulator('192.168.1.10', 5001);
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
