import '@/core/i18n';

import { UiProvider } from '@kavout/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Settings from 'expo-settings';

import App from './App';

const queryClient = new QueryClient();

export default function Main() {
  const theme = Settings.getSystemTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <UiProvider sourceColor={theme?.baseColor}>
        <App />
      </UiProvider>
    </QueryClientProvider>
  );
}
