import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { UserDocument } from '@kuzpot/core';
import { Flex, GeoQueryOptions } from '@kuzpot/react-native';
import { DataWithId } from '@kuzpot/react-native/src/core/firebase/types';
import { useRoute } from '@react-navigation/native';
import { distanceBetween } from 'geofire-common';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import RNMapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { FAB, Text, useTheme } from 'react-native-paper';

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

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [userSelected, setUserSelected] = useState<DataWithId<UserDocument>>();

  const currentPosition = useCurrentPosition();
  const [regionOnMap, setRegionOnMap] = useRegionOnMap();
  const [geoQueryOptions, setGeoQueryOptions] = useState<GeoQueryOptions>();

  const { data: nearUsers } = useNearUsers(geoQueryOptions);

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
    (userId: string) => {
      const user = nearUsers?.find(({ id }) => id === userId);
      console.log('user', user);
      setUserSelected(nearUsers?.find(({ id }) => id === userId));
      bottomSheetModalRef.current?.present();
    },
    [nearUsers]
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
          onPress={() => bottomSheetModalRef.current?.dismiss()}
        >
          {nearUsers?.map(({ id, geopoint }) => (
            <Marker
              key={id}
              coordinate={{
                latitude: geopoint.latitude,
                longitude: geopoint.longitude,
              }}
              image={require('./pin.png')}
              onPress={() => handleMarkerPressed(id)}
            />
          ))}
        </RNMapView>
        <FAB
          icon={isCurrentPosition ? 'crosshairs-gps' : 'crosshairs'}
          style={{ position: 'absolute', bottom: 16, right: 16 }}
          animated={false}
          onPress={() => animateToLocation(currentPosition)}
        />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={['25%', '50%']}
          backgroundStyle={{ backgroundColor: theme.colors.surface }}
          handleIndicatorStyle={{ backgroundColor: theme.colors.onSurface, marginTop: 4 }}
          style={{
            backgroundColor: 'white', // <==== HERE
            borderRadius: 24,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.0,

            elevation: 24,
          }}
        >
          <View>
            <Text>{userSelected?.id} 🎉</Text>
          </View>
        </BottomSheetModal>
      </Flex>
    </BottomSheetModalProvider>
  );
}
