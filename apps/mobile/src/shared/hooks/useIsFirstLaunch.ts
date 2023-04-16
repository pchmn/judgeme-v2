import { useSecureStorage } from '@kavout/react-native';

export function useIsFirstLaunch() {
  return useSecureStorage<boolean>('isFirstLaunch', true);
}
