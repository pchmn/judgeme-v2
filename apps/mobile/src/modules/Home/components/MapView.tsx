import { Flex } from '@kavout/react-native';
import { useRef } from 'react';
import RNMapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { FAB, useTheme } from 'react-native-paper';

import { useMap } from '../hooks';
import { darkMapStyle, lightMapStyle } from './mapStyle';

export function MapView() {
  const theme = useTheme();

  const mapRef = useRef<RNMapView>(null);
  const isMapReady = useRef(false);
  const { currentPosition, animateToCurrentPosition } = useMap(mapRef);

  const getMapBoundaries = async () => {
    // console.log('camera', await mapRef.current?.getCamera());
  };

  return (
    <Flex flex={1}>
      <RNMapView
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
