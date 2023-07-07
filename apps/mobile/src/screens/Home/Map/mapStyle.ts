import { Material3Scheme } from '@pchmn/expo-material3-theme/build/ExpoMaterial3Theme.types';
import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';

extend([mixPlugin]);

export const themedMapStyle = (scheme: Material3Scheme) => [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: colord(scheme.background).isDark()
          ? colord(scheme.secondaryContainer).darken(0.075).mix(colord(scheme.background)).toHex()
          : colord(scheme.secondaryContainer).lighten(0.03).toHex(),
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: colord(scheme.tertiary).mix(colord(scheme.background), 0.9).toHex() }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: colord(scheme.tertiary).mix(colord(scheme.background), 0.5).toHex() }],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: scheme.tertiary }],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.stroke',
    stylers: [{ color: colord(scheme.tertiary).mix(colord(scheme.background), 0.9).toHex() }],
  },
  {
    featureType: 'landscape.natural',
    stylers: [
      {
        color: colord('#A8DAB5')
          .mix(colord(scheme.background), colord(scheme.background).isDark() ? 0.9 : 0.75)
          .toHex(),
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: colord('#A8DAB5')
          .mix(colord(scheme.background), colord(scheme.background).isDark() ? 0.8 : 0.6)
          .toHex(),
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: colord('#A8DAB5')
          .mix(colord(scheme.background), colord(scheme.background).isDark() ? 0.5 : 0.2)
          .toHex(),
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.stroke',
    stylers: [{ color: colord('#A8DAB5').mix(colord(scheme.background), 0.9).toHex() }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: colord(scheme.background).isDark() ? colord(scheme.background).lighten(0.2).toHex() : scheme.background,
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: colord(scheme.background).isDark()
          ? colord(scheme.secondaryContainer).darken(0.3).toHex()
          : colord(scheme.secondaryContainer).darken(0.05).toHex(),
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: scheme.secondary }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: colord(scheme.tertiary).mix(colord(scheme.background), 0.3).toHex() }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: scheme.outlineVariant }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: colord('#9CC0F9').mix(colord(scheme.background), 0.75).toHex(),
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: colord('#9CC0F9').mix(colord(scheme.background), 0.75).toHex() }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.attraction',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.business',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.government',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.medical',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.place_of_worship',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.school',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.sports_complex',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
];

export const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#242f3e',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#746855',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#242f3e',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#263c3f',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#6b9a76',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#38414e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#212a37',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9ca5b3',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#746855',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#1f2835',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#f3d19c',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        color: '#2f3948',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#515c6d',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
];

export const lightMapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#ebe3cd',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#523735',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f1e6',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#c9b2a6',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#dcd2be',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#ae9e90',
      },
    ],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dfd2ae',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dfd2ae',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#93817c',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#a5b076',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#447530',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f1e6',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      {
        color: '#fdfcf8',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f8c967',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#e9bc62',
      },
    ],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e98d58',
      },
    ],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#db8555',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#806b63',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dfd2ae',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#8f7d77',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#ebe3cd',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dfd2ae',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#b9d3c2',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#92998d',
      },
    ],
  },
];
