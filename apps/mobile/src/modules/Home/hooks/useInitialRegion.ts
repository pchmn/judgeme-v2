import { useSecureStore, useTimeout } from '@kavout/react-native';
import { getLastKnownPositionAsync } from 'expo-location';
import { useEffect, useState } from 'react';
import { Region } from 'react-native-maps';

export function useInitialRegion() {
  const { value } = useRegionOnMapStore();

  const [initialRegion, setInitialRegion] = useState<Region>();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (value && isLessThanOneHour(value.age)) {
      setInitialRegion((prev) => (prev ? prev : { ...value }));
      setIsLoading(false);
    }
  }, [value]);

  useEffect(() => {
    const getLastKnownPosition = async () => {
      try {
        const location = await getLastKnownPositionAsync();
        if (location) {
          setInitialRegion((prev) => (prev ? prev : { ...location.coords, latitudeDelta: 0.05, longitudeDelta: 0.05 }));
          setIsLoading(false);
        }
      } catch (e) {
        console.error('Error while getting last known position', e);
        setIsLoading(false);
      }
    };

    getLastKnownPosition();
  }, []);

  // We don't want to wait more than 500ms for the preferred location to be set
  useTimeout(() => {
    setIsLoading(false);
  }, 500);

  return { initialRegion, isLoading };
}

export function useRegionOnMapStore() {
  const { value, set: setStore } = useSecureStore<Region & { age: number }>('regionOnMap');

  const set = (region: Region) => {
    setStore({ ...region, age: Date.now() });
  };

  return { value, set };
}

function isLessThanOneHour(date: number) {
  const now = new Date();
  const diff = now.getTime() - date;
  return diff < 1000 * 60 * 60;
}
