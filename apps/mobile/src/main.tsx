import '@/core/i18n';

import { UiProvider } from '@kavout/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App';

const queryClient = new QueryClient();

export default function Main() {
  return (
    <QueryClientProvider client={queryClient}>
      <UiProvider>
        <App />
      </UiProvider>
    </QueryClientProvider>
  );
}
