import { useSecureStore, useTimeout } from '@kavout/react-native';
import { getLastKnownPositionAsync } from 'expo-location';
import { useEffect, useState } from 'react';
import { Region } from 'react-native-maps';

export function useInitialRegion() {
  const { value, set } = useSecureStore<Region & { age: number }>('lastRegionOnMap');

  const [initialRegion, setInitialRegion] = useState<Region>();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const storeRegion = (region: Region) => {
    set({ ...region, age: Date.now() });
  };

  useEffect(() => {
    if (value && isLessThanOneHour(value.age)) {
      setInitialRegion((prev) => (prev ? prev : { ...value }));
      setIsLoading(false);
    }
  }, [value]);

  useEffect(() => {
    const getLastKnownPosition = async () => {
      const location = await getLastKnownPositionAsync();
      if (location) {
        setInitialRegion((prev) => (prev ? prev : { ...location.coords, latitudeDelta: 0.05, longitudeDelta: 0.05 }));
        setIsLoading(false);
      }
    };
    getLastKnownPosition();
  }, []);

  // We don't want to wait more than 500ms for the preferred location to be set
  useTimeout(() => {
    setIsLoading(false);
  }, 500);

  return { preferredRegion: initialRegion, isLoading, storeRegion };
}

function isLessThanOneHour(date: number) {
  const now = new Date();
  const diff = now.getTime() - date;
  return diff < 1000 * 60 * 60;
}
