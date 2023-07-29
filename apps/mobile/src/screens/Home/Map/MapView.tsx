import { BottomSheet, BottomSheetRefProps, Flex, useAppTheme } from '@kuzpot/react-native';
import { useRoute } from '@react-navigation/native';
import { distanceBetween } from 'geofire-common';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import RNMapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { FAB } from 'react-native-paper';
import { useSharedValue } from 'react-native-reanimated';

import { RouteParams } from '@/core/routes/types';
import { useRegionOnMap } from '@/shared/hooks';

import { UserDetails } from '../UserDetails/UserDetails';
import { themedMapStyle } from './mapStyle';
import { MarkerImage } from './MarkerImage';
import { useCurrentPosition } from './useCurrentPosition';
import { useNearbyKuzers } from './useNearbyKuzers';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function MapView() {
  const {
    params: { initialRegion },
  } = useRoute<RouteParams<'Home'>>();

  const theme = useAppTheme();

  const mapRef = useRef<RNMapView>(null);
  const isRegionFocused = useRef(false);

  const currentPosition = useCurrentPosition();
  const [regionOnMap, setRegionOnMap] = useRegionOnMap();

  const [tracksViewChanges, setTracksViewChanges] = useState(false);

  const [mapBoundaries, setMapBoundaries] = useState<{
    minLat: number;
    minLong: number;
    maxLat: number;
    maxLong: number;
  }>({
    minLat: 0,
    minLong: 0,
    maxLat: 0,
    maxLong: 0,
  });
  const { data: kuzers, loading, error } = useNearbyKuzers(mapBoundaries);
  const [kuzerSelectedId, setKuzerSelectedId] = useState<string>();
  const kuzerSelected = useMemo(() => {
    if (kuzerSelectedId) {
      return kuzers?.find(({ id }) => id === kuzerSelectedId);
    }
    return kuzers ? kuzers[0] : undefined;
  }, [kuzers, kuzerSelectedId]);

  const bottomSheetRef = useRef<BottomSheetRefProps>(null);
  const [userDetailsHeight, setUserDetailsHeight] = useState(0);

  useEffect(() => {
    setTracksViewChanges(true);

    setTimeout(() => setTracksViewChanges(false));
  }, [theme]);

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
    async (location?: { latitude: number; longitude: number }, duration?: number) => {
      if (location) {
        mapRef.current?.animateToRegion(
          {
            ...location,
            latitudeDelta: regionOnMap?.latitudeDelta || 0.05,
            longitudeDelta: regionOnMap?.longitudeDelta || 0.05,
          },
          duration || 1500
        );
      }
    },
    [regionOnMap?.latitudeDelta, regionOnMap?.longitudeDelta]
  );

  const onMapReady = () => {
    if (currentPosition && !isRegionFocused.current && !initialRegion) {
      isRegionFocused.current = true;
      animateToLocation(currentPosition);
    }
    handleGeoQueryOptions();
  };

  const onRegionChangeComplete = (region: Region) => {
    setRegionOnMap({ ...region });
    handleGeoQueryOptions();
  };

  const handleGeoQueryOptions = async () => {
    if (mapRef.current) {
      const { northEast, southWest } = await mapRef.current.getMapBoundaries();
      setMapBoundaries({
        minLat: southWest.latitude,
        minLong: southWest.longitude,
        maxLat: northEast.latitude,
        maxLong: northEast.longitude,
      });
    }
  };

  const handleMarkerPressed = useCallback(async (userId: string) => {
    setKuzerSelectedId(userId);

    setTimeout(() => {
      bottomSheetRef.current?.open();
    });
  }, []);

  const handleBottomSheetIndexChange = useCallback(
    async (index: number, positionY: number) => {
      if (index === 1 && kuzerSelected) {
        const currentCenter = SCREEN_HEIGHT / 2;
        const userPosition = await mapRef.current?.pointForCoordinate({
          latitude: kuzerSelected.geopoint.coordinates[1],
          longitude: kuzerSelected.geopoint.coordinates[0],
        });
        if (userPosition && userPosition.y >= positionY - 20) {
          const distance = positionY / 2 - userPosition.y;

          const coordinate = await mapRef.current?.coordinateForPoint({
            x: userPosition.x,
            y: currentCenter - distance,
          });
          animateToLocation(coordinate, 500);
        }
      }
    },
    [animateToLocation, kuzerSelected]
  );

  useEffect(() => {
    if (currentPosition && !isRegionFocused.current && !initialRegion) {
      isRegionFocused.current = true;
      animateToLocation(currentPosition);
    }
  }, [animateToLocation, currentPosition, initialRegion]);

  const positionValue = useSharedValue(0);

  return (
    <Flex flex={1}>
      <RNMapView
        initialRegion={initialRegion}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ width: '100%', height: '100%' }}
        customMapStyle={themedMapStyle(theme.colors)}
        onRegionChange={setRegionOnMap}
        onRegionChangeComplete={onRegionChangeComplete}
        onMapReady={onMapReady}
        showsPointsOfInterest={false}
        showsBuildings={false}
        showsUserLocation
        showsMyLocationButton={false}
        moveOnMarkerPress={false}
        showsCompass={false}
        onPress={() => bottomSheetRef.current?.close()}
        onPoiClick={() => bottomSheetRef.current?.close()}
      >
        {kuzers?.map(({ id, geopoint }) => {
          return (
            <Marker
              key={id}
              coordinate={{
                latitude: geopoint.coordinates[1],
                longitude: geopoint.coordinates[0],
              }}
              onPress={() => handleMarkerPressed(id)}
              tracksViewChanges={tracksViewChanges}
            >
              <MarkerImage />
            </Marker>
          );
        })}
      </RNMapView>
      <FAB
        icon={isCurrentPosition ? 'crosshairs-gps' : 'crosshairs'}
        style={{ position: 'absolute', bottom: 16, right: 16 }}
        animated={false}
        onPress={() => animateToLocation(currentPosition)}
      />
      <BottomSheet
        ref={bottomSheetRef}
        onIndexChange={handleBottomSheetIndexChange}
        positionValue={positionValue}
        snapPoint={userDetailsHeight}
      >
        {kuzerSelected && (
          <UserDetails
            key={kuzerSelected.id}
            user={kuzerSelected}
            currentPosition={currentPosition}
            positionValue={positionValue}
            onLayout={({ nativeEvent: { layout } }) => setUserDetailsHeight(layout.height)}
          />
        )}
      </BottomSheet>
    </Flex>
  );
}
