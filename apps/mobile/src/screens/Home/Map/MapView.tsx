import { Flex, GeoQueryOptions } from '@kuzpot/react-native';
import { useRoute } from '@react-navigation/native';
import { distanceBetween } from 'geofire-common';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import RNMapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { FAB, useTheme } from 'react-native-paper';

import { RouteParams } from '@/core/routes/types';
import { useRegionOnMap } from '@/shared/hooks';

import { darkMapStyle, lightMapStyle } from './mapStyle';
import { useCurrentPosition } from './useCurrentPosition';
import { useNearUsers } from './useNearUsers';

export function MapView() {
  const {
    params: { initialRegion },
  } = useRoute<RouteParams<'Home'>>();

  const theme = useTheme();

  const mapRef = useRef<RNMapView>(null);
  const isRegionFocused = useRef(false);

  const currentPosition = useCurrentPosition();
  const [regionOnMap, setRegionOnMap] = useRegionOnMap();
  const [geoQueryOptions, setGeoQueryOptions] = useState<GeoQueryOptions>();

  const { data: nearUsers } = useNearUsers(geoQueryOptions);
  // console.log('nearUsers', nearUsers);

  useEffect(() => {
    console.log('nearUsers', nearUsers);
  }, [nearUsers]);

  const isCurrentPosition = useMemo(() => {
    if (regionOnMap && currentPosition) {
      return (
        distanceBetween(
          [regionOnMap.latitude, regionOnMap.longitude],
          [currentPosition.latitude, currentPosition.longitude]
        ) < 0.1
      );
    }
    return false;
  }, [currentPosition, regionOnMap]);

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
    setRegionOnMap({ ...region });
    if (!mapRef.current) return;
    const { northEast } = await mapRef.current.getMapBoundaries();
    const distance = distanceBetween([northEast.latitude, northEast.longitude], [region.latitude, region.longitude]);
    setGeoQueryOptions({ center: { latitude: region.latitude, longitude: region.longitude }, radius: distance * 1000 });
  };

  useEffect(() => {
    if (currentPosition && !isRegionFocused.current && !initialRegion) {
      isRegionFocused.current = true;
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
        onRegionChange={setRegionOnMap}
        onRegionChangeComplete={getMapBoundaries}
        onMapLoaded={() => {
          if (currentPosition && !isRegionFocused.current && !initialRegion) {
            isRegionFocused.current = true;
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
