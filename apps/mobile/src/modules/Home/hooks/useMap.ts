import { UserDocument } from '@kavout/core';
import { useFirebaseAuthUser, useFirestoreSetDoc } from '@kavout/react-native';
import firestore from '@react-native-firebase/firestore';
import { Accuracy, LocationObjectCoords, LocationSubscription, watchPositionAsync } from 'expo-location';
import { geohashForLocation } from 'geofire-common';
import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MapView from 'react-native-maps';

export function useMap(mapRef: RefObject<MapView>) {
  const [currentPosition, setCurrentPosition] = useState<LocationObjectCoords>();
  const locationSubscription = useRef<LocationSubscription>();

  const { data: currentUser } = useFirebaseAuthUser();
  const { mutate } = useFirestoreSetDoc<UserDocument>();
  const userRef = useMemo(
    () => firestore().collection<UserDocument>('users').doc(currentUser?.uid),
    [currentUser?.uid]
  );

  const animateToCurrentPosition = useCallback(
    async (location?: LocationObjectCoords) => {
      // firebase.app().functions('europe-west1').httpsCallable('sendMessage')({
      //   to: currentUser?.uid,
      // });

      console.log('animateToCurrentPosition', location);
      if (location) {
        mapRef.current?.animateToRegion(
          {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          1500
        );
      }
    },
    [mapRef]
  );

  const storeCurrentPosition = useCallback(
    (location: LocationObjectCoords) => {
      setCurrentPosition(location);

      const geohash = geohashForLocation([location.latitude, location.longitude]);
      mutate({
        ref: userRef,
        data: {
          location: {
            geohash,
            latitude: location.latitude,
            longitude: location.longitude,
            altitude: location.altitude,
          },
        },
      });
    },
    [mutate, userRef]
  );

  const handleLocationChange = useCallback(
    (location: LocationObjectCoords) => {
      if (!currentPosition) {
        console.log('handleLocationChange animateToCurrentPosition', currentPosition);
        animateToCurrentPosition(location);
      }

      storeCurrentPosition(location);
    },
    [animateToCurrentPosition, currentPosition, storeCurrentPosition]
  );

  useEffect(() => {
    const watchPosition = async () => {
      locationSubscription.current = await watchPositionAsync(
        { accuracy: Accuracy.Balanced, timeInterval: 5000 },
        (location) => {
          handleLocationChange(location.coords);
        }
      );
    };

    watchPosition();

    return () => {
      locationSubscription.current?.remove();
    };
  }, [handleLocationChange]);

  return { currentPosition, animateToCurrentPosition };
}
