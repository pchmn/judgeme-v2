import 'dotenv/config';

import { ExpoConfig } from '@expo/config';

const config: ExpoConfig = {
  owner: 'pchmn',
  name: process.env.APP_ENV === 'production' ? 'Kavout' : process.env.APP_ENV === 'local' ? 'KavoutLocal' : 'KavoutDev',
  slug: 'kavout',
  scheme: 'kavout',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    url: 'https://u.expo.dev/81b9ebc5-4e14-4578-a29c-1adf59c3bd9b',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier:
      process.env.APP_ENV === 'production'
        ? 'com.pchmn.kavout'
        : process.env.APP_ENV === 'local'
        ? 'com.pchmn.kavout.local'
        : 'com.pchmn.kavout.dev',
    buildNumber: '1.0.0',
    supportsTablet: true,
    config: {
      googleMapsApiKey:
        process.env.APP_ENV === 'production'
          ? process.env.GOOGLE_MAPS_API_KEY_IOS_PROD
          : process.env.GOOGLE_MAPS_API_KEY_IOS_DEV,
    },
    googleServicesFile: process.env.GOOGLE_SERVICES_PLIST_DEV,
  },
  android: {
    package:
      process.env.APP_ENV === 'production'
        ? 'com.pchmn.kavout'
        : process.env.APP_ENV === 'local'
        ? 'com.pchmn.kavout.local'
        : 'com.pchmn.kavout.dev',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
    config: {
      googleMaps: {
        apiKey:
          process.env.APP_ENV === 'production'
            ? process.env.GOOGLE_MAPS_API_KEY_ANDROID_PROD
            : process.env.GOOGLE_MAPS_API_KEY_ANDROID_DEV,
      },
    },
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON_DEV,
  },
  plugins: [
    '@react-native-firebase/app',
    './reactNativeMapsPlugin',
    // '@react-native-firebase/auth',
    [
      'expo-build-properties',
      {
        ios: {
          deploymentTarget: '13.0',
          useFrameworks: 'static',
        },
      },
    ],
  ],
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    eas: {
      projectId: '81b9ebc5-4e14-4578-a29c-1adf59c3bd9b',
    },
  },
};

export default config;
