import { useAsyncStorage } from '@judgeme/react';
import { useForegroundPermissions } from 'expo-location';

export function useOnboard() {
  const { value, isLoading, set } = useAsyncStorage<boolean>('isFirstLaunch', true);

  const [status, requestPermission] = useForegroundPermissions();

  return {
    isFirstLaunch: value,
    setIsFirstLaunch: set,
    isLoading: isLoading || status === null,
    locationPermissionStatus: status,
    requestLocationPermission: requestPermission,
  };
}
