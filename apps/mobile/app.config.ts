import 'dotenv/config';

import { ExpoConfig } from '@expo/config';

const config: ExpoConfig = {
  owner: 'pchmn',
  name: process.env.APP_ENV === 'production' ? 'Kavout' : 'KavoutDev',
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
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: process.env.APP_ENV === 'production' ? 'com.pchmn.kavout' : 'com.pchmn.kavout.dev',
    buildNumber: '1.0.0',
    supportsTablet: true,
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY_IOS,
    },
    googleServicesFile: './GoogleService-Info.plist',
  },
  android: {
    package: process.env.APP_ENV === 'production' ? 'com.pchmn.kavout' : 'com.pchmn.kavout.dev',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY_ANDROID,
      },
    },
    googleServicesFile: './google-services.json',
  },
  plugins: ['@react-native-firebase/app'],
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
