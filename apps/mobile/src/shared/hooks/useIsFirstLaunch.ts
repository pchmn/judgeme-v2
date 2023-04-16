import { useSecureStorage } from '@kuzpot/react-native';

export function useIsFirstLaunch() {
  return useSecureStorage<boolean>('isFirstLaunch', true);
}
