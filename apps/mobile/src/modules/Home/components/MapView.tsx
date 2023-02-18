import { Flex } from '@kavout/react-native';
import { useRoute } from '@react-navigation/native';
import { distanceBetween } from 'geofire-common';
import { useCallback, useEffect, useRef, useState } from 'react';
import RNMapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { FAB, useTheme } from 'react-native-paper';

import { RouteParams } from '@/core/routes/types';

import { useCurrentPosition, useRegionOnMapStore } from '../hooks';
import { darkMapStyle, lightMapStyle } from './mapStyle';

export function MapView() {
  const {
    params: { initialRegion },
  } = useRoute<RouteParams<'Home'>>();

  const theme = useTheme();

  const mapRef = useRef<RNMapView>(null);
  const isMapReady = useRef(false);

  const currentPosition = useCurrentPosition();
  const { set: storeRegion } = useRegionOnMapStore();
  const [isCurrentPosition, setIsCurrentPosition] = useState(false);

  const animateToLocation = useCallback(
    async (location?: { latitude: number; longitude: number }) => {
      // firebase.app().functions('europe-west1').httpsCallable('sendMessage')({
      //   to: currentUser?.uid,
      // });

      if (location) {
        mapRef.current?.animateToRegion(
          {
            ...location,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          1500
        );
      }
    },
    [mapRef]
  );

  const getMapBoundaries = async (region: Region) => {
    // console.log('region', region);
    storeRegion({ ...region });
  };

  const checkCurrentPosition = useCallback(
    (region: Region) => {
      if (currentPosition) {
        setIsCurrentPosition(
          distanceBetween([region.latitude, region.longitude], [currentPosition.latitude, currentPosition.longitude]) <
            0.1
        );
      }
    },
    [currentPosition]
  );

  useEffect(() => {
    if (!isMapReady.current && !initialRegion) {
      isMapReady.current = true;
      animateToLocation(currentPosition);
    }
  }, [animateToLocation, currentPosition, initialRegion]);

  return (
    <Flex flex={1}>
      <RNMapView
        initialRegion={initialRegion}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ width: '100%', height: '100%' }}
        customMapStyle={theme.dark ? darkMapStyle : lightMapStyle}
        onRegionChange={checkCurrentPosition}
        onRegionChangeComplete={getMapBoundaries}
        onMapLoaded={() => {
          if (!isMapReady.current && !initialRegion) {
            isMapReady.current = true;
            animateToLocation(currentPosition);
          }
        }}
        showsPointsOfInterest={false}
        showsBuildings={false}
      />
      <FAB
        icon={isCurrentPosition ? 'crosshairs-gps' : 'crosshairs'}
        style={{ position: 'absolute', bottom: 16, right: 16 }}
        animated={false}
        onPress={() => animateToLocation(currentPosition)}
      />
    </Flex>
  );
}
