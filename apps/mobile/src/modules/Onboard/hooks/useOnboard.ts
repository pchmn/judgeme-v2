import { useAsyncStorage } from '@kavout/react';
import { getForegroundPermissionsAsync, LocationPermissionResponse, useForegroundPermissions } from 'expo-location';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

export function useOnboard() {
  const { value, isLoading, set } = useAsyncStorage<boolean>('isFirstLaunch', true);

  const [status, requestPermission] = useForegroundPermissions();

  const [locationPermissionStatus, setLocationPermissionStatus] = useState(status);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
        const newStatus = await getForegroundPermissionsAsync();
        handleSetLocationPermissionStatus(newStatus);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    handleSetLocationPermissionStatus(status);
  }, [status]);

  const handleSetLocationPermissionStatus = (newStatus: LocationPermissionResponse | null) => {
    setLocationPermissionStatus((prev) => (JSON.stringify(prev) !== JSON.stringify(newStatus) ? newStatus : prev));
  };

  return {
    isFirstLaunch: value,
    setIsFirstLaunch: set,
    isLoading: isLoading || locationPermissionStatus === null,
    locationPermissionStatus,
    requestLocationPermission: requestPermission,
  };
}
