import { UserDocument } from '@kavout/core';
import { Flex, useFirebaseAuthUser, useFirestoreSetDoc } from '@kavout/react-native';
import firestore from '@react-native-firebase/firestore';
import { Accuracy, LocationObjectCoords, LocationSubscription, watchPositionAsync } from 'expo-location';
import { geohashForLocation } from 'geofire-common';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { FAB, useTheme } from 'react-native-paper';

import { darkMapStyle, lightMapStyle } from './mapStyle';

export function HomeScreen() {
  const theme = useTheme();

  const mapRef = useRef<MapView>(null);
  const isMapReady = useRef(false);

  const [currentPosition, setCurrentPosition] = useState<LocationObjectCoords>();
  const locationSubscription = useRef<LocationSubscription>();

  const { data: currentUser } = useFirebaseAuthUser();
  const { mutate } = useFirestoreSetDoc<UserDocument>();
  const userRef = useMemo(
    () => firestore().collection<UserDocument>('users').doc(currentUser?.uid),
    [currentUser?.uid]
  );

  const animateToCurrentPosition = useCallback(async (location?: LocationObjectCoords) => {
    // firebase.app().functions('europe-west1').httpsCallable('sendMessage')({
    //   to: currentUser?.uid,
    // });

    console.log('animateToCurrentPosition', location);
    if (location && isMapReady.current) {
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
  }, []);

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

  const getMapBoundaries = async () => {
    // console.log('camera', await mapRef.current?.getCamera());
  };

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

  return (
    <Flex flex={1}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ width: '100%', height: '100%' }}
        customMapStyle={theme.dark ? darkMapStyle : lightMapStyle}
        onRegionChangeComplete={getMapBoundaries}
        onMapLoaded={() => {
          if (!isMapReady.current) {
            isMapReady.current = true;
            console.log('onMapLoaded animateToCurrentPosition');
            animateToCurrentPosition(currentPosition);
          }
        }}
        showsPointsOfInterest={false}
        showsBuildings={false}
      />
      <FAB
        icon="crosshairs-gps"
        style={{ position: 'absolute', bottom: 16, right: 16 }}
        onPress={() => animateToCurrentPosition()}
      />
    </Flex>
  );
}
