import { UiProvider } from '@judgeme/react';

import App from './App';

export default function Main() {
  return (
    <UiProvider>
      <App />
    </UiProvider>
  );
}
