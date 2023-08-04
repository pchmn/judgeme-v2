import '@/core/i18n';

import { initSecureStorage, isSecureStorageInitialized, UiProvider } from '@kuzpot/react-native';
import { NhostClient, NhostProvider } from '@nhost/react';
import { NhostApolloProvider } from '@nhost/react-apollo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AndroidImportance, setNotificationChannelAsync } from 'expo-notifications';
import { preventAutoHideAsync } from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Sentry from 'sentry-expo';

import App from './App';

Sentry.init({
  dsn: 'https://0368298f84c04a78ac460d9ea7cd4c2c@o4504771591274496.ingest.sentry.io/4505024782008320',
  enableInExpoDevelopment: true,
  debug: __DEV__,
  // Fix error trace looping: https://github.com/getsentry/sentry-react-native/issues/2721#issuecomment-1380546718
  integrations: [
    new Sentry.Native.ReactNativeTracing({
      shouldCreateSpanForRequest: (url) => {
        return !__DEV__ || !url.startsWith(`http://192.168.1.10:8081/logs`);
      },
    }),
  ],
});

preventAutoHideAsync();

const queryClient = new QueryClient();

const nhostParams = {
  authUrl: process.env.EXPO_PUBLIC_NHOST_AUTH_URL,
  graphqlUrl: process.env.EXPO_PUBLIC_NHOST_GRAPHQL_URL,
  storageUrl: process.env.EXPO_PUBLIC_NHOST_STORAGE_URL,
  functionsUrl: process.env.EXPO_PUBLIC_NHOST_FUNCTIONS_URL,
};
let nhost: NhostClient;

Sentry.Native.captureMessage(`NHOST params: ${JSON.stringify(nhostParams, null, 2)}`);

if (Platform.OS === 'android') {
  setNotificationChannelAsync('Messages', {
    name: 'Messages',
    importance: AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });
}

export default function Main() {
  const [isReady, setIsReady] = useState(isSecureStorageInitialized());

  useEffect(() => {
    if (!isSecureStorageInitialized()) {
      initSecureStorage()
        .then((storage) => {
          nhost = new NhostClient({
            ...nhostParams,
            clientStorage: {
              setItem: storage.set.bind(storage),
              getItem: storage.getString.bind(storage),
              removeItem: storage.delete.bind(storage),
            },
            clientStorageType: 'react-native',
          });
          setIsReady(true);

          Sentry.Native.captureMessage('Secure storage initialized');
        })
        .catch((err) => Sentry.Native.captureException(err));
    }
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NhostProvider nhost={nhost}>
        <NhostApolloProvider nhost={nhost}>
          <UiProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <App />
            </GestureHandlerRootView>
          </UiProvider>
        </NhostApolloProvider>
      </NhostProvider>
    </QueryClientProvider>
  );
}
