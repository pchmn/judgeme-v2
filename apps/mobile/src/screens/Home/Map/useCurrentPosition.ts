import { GeoPoint, Kuzer, UPDATE_KUZER } from '@kuzpot/core';
import { useUpdateMutation } from '@kuzpot/react-native';
import { useUserData } from '@nhost/react';
import {
  Accuracy,
  getLastKnownPositionAsync,
  LocationObjectCoords,
  LocationSubscription,
  watchPositionAsync,
} from 'expo-location';
import { geohashForLocation } from 'geofire-common';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useCurrentPosition(storeLocation = true) {
  const [currentPosition, setCurrentPosition] = useState<LocationObjectCoords>();
  const locationSubscription = useRef<LocationSubscription>();

  const userData = useUserData();
  const [mutateUser] = useUpdateMutation<Kuzer>(UPDATE_KUZER);

  const storeCurrentPosition = useCallback(
    (location: LocationObjectCoords) => {
      setCurrentPosition(location);

      const geohash = geohashForLocation([location.latitude, location.longitude]);
      mutateUser(userData?.id, {
        geohash,
        geopoint: new GeoPoint(location),
      });
    },
    [mutateUser, userData]
  );

  useEffect(() => {
    const watchPosition = async () => {
      locationSubscription.current = await watchPositionAsync(
        { accuracy: Accuracy.Balanced, timeInterval: 30000 },
        (location) => {
          setCurrentPosition(location.coords);
          if (storeLocation) {
            storeCurrentPosition(location.coords);
          }
        }
      );
    };
    watchPosition();

    const getLastKnownPosition = async () => {
      const location = await getLastKnownPositionAsync();
      if (location) {
        const geohash = geohashForLocation([location.coords.latitude, location.coords.longitude]);
        setCurrentPosition((prev) => (prev ? prev : { ...location.coords, geohash }));
      }
    };
    getLastKnownPosition();

    return () => {
      locationSubscription.current?.remove();
    };
  }, [storeCurrentPosition, storeLocation]);

  return currentPosition;
}
