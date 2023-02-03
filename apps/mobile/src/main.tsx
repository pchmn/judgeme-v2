import '@/core/i18n';

import { UiProvider } from '@kavout/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getSystemTheme } from 'expo-system-theme';

import App from './App';

const queryClient = new QueryClient();

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
