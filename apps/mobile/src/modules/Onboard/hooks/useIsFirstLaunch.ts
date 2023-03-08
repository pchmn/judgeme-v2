import { useSecureStore } from '@kavout/react-native';

export function useIsFirstLaunch() {
  return useSecureStore<boolean>('isFirstLaunch', true);
}
