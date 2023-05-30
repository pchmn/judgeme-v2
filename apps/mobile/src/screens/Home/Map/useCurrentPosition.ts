import { UserDocument } from '@kuzpot/core';
import { useFirebaseAuthUser, useFirestoreSetDoc } from '@kuzpot/react-native';
import firestore from '@react-native-firebase/firestore';
import {
  Accuracy,
  getLastKnownPositionAsync,
  LocationObjectCoords,
  LocationSubscription,
  watchPositionAsync,
} from 'expo-location';
import { geohashForLocation } from 'geofire-common';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useCurrentPosition(storeLocation = true) {
  const [currentPosition, setCurrentPosition] = useState<LocationObjectCoords>();
  const locationSubscription = useRef<LocationSubscription>();

  const { data: currentUser } = useFirebaseAuthUser();
  const { mutate } = useFirestoreSetDoc<UserDocument>();
  const userRef = useMemo(
    () => firestore().collection<UserDocument>('users').doc(currentUser?.uid),
    [currentUser?.uid]
  );

  const storeCurrentPosition = useCallback(
    (location: LocationObjectCoords) => {
      setCurrentPosition(location);

      const geohash = geohashForLocation([location.latitude, location.longitude]);
      mutate({
        ref: userRef,
        data: {
          geohash,
          geopoint: new firestore.GeoPoint(location.latitude, location.longitude),
        },
      });
    },
    [mutate, userRef]
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
