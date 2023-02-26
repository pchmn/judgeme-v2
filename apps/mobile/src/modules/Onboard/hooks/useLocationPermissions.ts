import { getForegroundPermissionsAsync, LocationPermissionResponse, useForegroundPermissions } from 'expo-location';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

export function useLocationPermissions() {
  const [status, requestLocationPermissions] = useForegroundPermissions();

  const [locationPermissions, setLocationPermissions] = useState(status);

  const handleSetLocationPermissionStatus = (newStatus: LocationPermissionResponse | null) => {
    setLocationPermissions((prev) => (JSON.stringify(prev) !== JSON.stringify(newStatus) ? newStatus : prev));
  };

  const requestPermissions = async () => {
    const locationPermission = await requestLocationPermissions();
    handleSetLocationPermissionStatus(locationPermission);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
        const locationPermission = await getForegroundPermissionsAsync();
        handleSetLocationPermissionStatus(locationPermission);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    handleSetLocationPermissionStatus(status);
  }, [status]);

  return {
    locationPermissions,
    isLoading: locationPermissions === null,
    requestPermissions,
  };
}
