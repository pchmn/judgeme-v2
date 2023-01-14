import '@/core/i18n';

import { UiProvider } from '@kavout/react';

import App from './App';

export default function Main() {
  return (
    <UiProvider>
      <App />
    </UiProvider>
  );
}
