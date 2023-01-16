import { Flex, useEffectOnce } from '@kavout/react';
import { Accuracy, LocationObjectCoords, LocationSubscription, watchPositionAsync } from 'expo-location';
import { useRef, useState } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { FAB, useTheme } from 'react-native-paper';

import { registerForPushNotifications } from '@/core/notifications';

import { darkMapStyle, lightMapStyle } from './mapStyle';

export function HomeScreen() {
  const theme = useTheme();

  const mapRef = useRef<MapView>(null);
  const isMapReady = useRef(false);

  const [currentPosition, setCurrentPosition] = useState<LocationObjectCoords>();
  const locationSubscription = useRef<LocationSubscription>();

  const animateToCurrentPosition = async (location: LocationObjectCoords | undefined = currentPosition) => {
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
  };

  const handleLocationChange = (location: LocationObjectCoords) => {
    if (!currentPosition) {
      animateToCurrentPosition(location);
    }
    setCurrentPosition(location);
  };

  const getMapBoundaries = async () => {
    // console.log('camera', await mapRef.current?.getCamera());
  };

  useEffectOnce(() => {
    const watchPosition = async () => {
      locationSubscription.current = await watchPositionAsync(
        { accuracy: Accuracy.Balanced, timeInterval: 5000 },
        (location) => {
          handleLocationChange(location.coords);
        }
      );
    };

    watchPosition();

    registerForPushNotifications();

    return () => {
      locationSubscription.current?.remove();
    };
  });

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
            animateToCurrentPosition();
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
