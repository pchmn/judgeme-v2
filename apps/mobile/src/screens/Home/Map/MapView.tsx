import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { UserDocument } from '@kuzpot/core';
import { BottomSheet, BottomSheetRefProps, Flex, GeoQueryOptions, useFirebaseAuthUser } from '@kuzpot/react-native';
import { DataWithId } from '@kuzpot/react-native/src/core/firebase/types';
import { useRoute } from '@react-navigation/native';
import { distanceBetween } from 'geofire-common';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import RNMapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { FAB, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RouteParams } from '@/core/routes/types';
import { useRegionOnMap } from '@/shared/hooks';

import { UserDetails } from '../UserDetails/UserDetails';
import { darkMapStyle, lightMapStyle } from './mapStyle';
import { MarkerImage } from './MarkerImage';
import { useCurrentPosition } from './useCurrentPosition';
import { useNearUsers } from './useNearUsers';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function MapView() {
  const insets = useSafeAreaInsets();

  const {
    params: { initialRegion },
  } = useRoute<RouteParams<'Home'>>();

  const theme = useTheme();

  const mapRef = useRef<RNMapView>(null);
  const isRegionFocused = useRef(false);

  const bottomSheetRef = useRef<BottomSheetRefProps>(null);
  const [userSelected, setUserSelected] = useState<DataWithId<UserDocument>>();

  const currentPosition = useCurrentPosition();
  const [regionOnMap, setRegionOnMap] = useRegionOnMap();
  const [geoQueryOptions, setGeoQueryOptions] = useState<GeoQueryOptions>();

  const [tracksViewChanges, setTracksViewChanges] = useState(false);

  const { data: nearUsers } = useNearUsers(geoQueryOptions);
  const { data: currentUser } = useFirebaseAuthUser();

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
      // firebase.app().functions('europe-west1').httpsCallable('sendMessage')({
      //   to: currentUser?.uid,
      // });
      // if (Platform.OS === 'ios') {
      //   signOut(undefined, {
      //     onSuccess: () => {
      //       console.log('signOut success');
      //     },
      //   });
      // }

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

  const onMapLoaded = () => {
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
      const { center } = await mapRef.current.getCamera();
      const { northEast } = await mapRef.current.getMapBoundaries();
      const distance = distanceBetween([northEast.latitude, northEast.longitude], [center.latitude, center.longitude]);
      setGeoQueryOptions({
        center: { latitude: center.latitude, longitude: center.longitude },
        radius: distance * 1000,
      });
    }
  };

  const handleMarkerPressed = useCallback(
    async (userId: string) => {
      const user = nearUsers?.find(({ id }) => id === userId);
      // console.log('user', user);
      setUserSelected(nearUsers?.find(({ id }) => id === userId));

      bottomSheetRef.current?.open();
    },
    [nearUsers]
  );

  const handleBottomSheetIndexChange = useCallback(
    async (index: number, position: number) => {
      if (index === 1 && userSelected) {
        const currentCenter = SCREEN_HEIGHT / 2;
        const userPosition = await mapRef.current?.pointForCoordinate({
          latitude: userSelected.geopoint.latitude,
          longitude: userSelected.geopoint.longitude,
        });
        if (userPosition && userPosition.y >= position - 10) {
          const distance = (SCREEN_HEIGHT - position) / 2 - userPosition.y + insets.top;

          const coordinate = await mapRef.current?.coordinateForPoint({
            x: userPosition.x,
            y: currentCenter - distance,
          });
          animateToLocation(coordinate, 500);
        }
      }
    },
    [animateToLocation, insets.top, userSelected]
  );

  useEffect(() => {
    if (currentPosition && !isRegionFocused.current && !initialRegion) {
      isRegionFocused.current = true;
      animateToLocation(currentPosition);
    }
  }, [animateToLocation, currentPosition, initialRegion]);

  return (
    <BottomSheetModalProvider>
      <Flex flex={1}>
        <RNMapView
          initialRegion={initialRegion}
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{ width: '100%', height: '100%' }}
          customMapStyle={theme.dark ? darkMapStyle : lightMapStyle}
          onRegionChange={setRegionOnMap}
          onRegionChangeComplete={onRegionChangeComplete}
          onMapLoaded={onMapLoaded}
          showsPointsOfInterest={false}
          showsBuildings={false}
          showsUserLocation
          showsMyLocationButton={false}
          moveOnMarkerPress={false}
          showsCompass={false}
          onPress={() => bottomSheetRef.current?.close()}
        >
          {nearUsers
            ?.filter(({ id }) => id !== currentUser?.uid)
            .map(({ id, geopoint }) => (
              <Marker
                key={id}
                coordinate={{
                  latitude: geopoint.latitude,
                  longitude: geopoint.longitude,
                }}
                onPress={() => handleMarkerPressed(id)}
                title="hello world"
                tracksViewChanges={tracksViewChanges}
              >
                <MarkerImage style={{ borderColor: 'red', borderWidth: 2 }} />
              </Marker>
            ))}
        </RNMapView>
        <FAB
          icon={isCurrentPosition ? 'crosshairs-gps' : 'crosshairs'}
          style={{ position: 'absolute', bottom: 16, right: 16 }}
          animated={false}
          onPress={() => animateToLocation(currentPosition)}
        />
        <BottomSheet ref={bottomSheetRef} onIndexChange={handleBottomSheetIndexChange}>
          {userSelected && <UserDetails key={userSelected.id} user={userSelected} />}
        </BottomSheet>
      </Flex>
    </BottomSheetModalProvider>
  );
}
