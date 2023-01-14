import 'dotenv/config';

import { ExpoConfig } from '@expo/config';

const config: ExpoConfig = {
  owner: 'pchmn',
  name: process.env.APP_ENV === 'production' ? 'Kavout' : 'KavoutDev',
  slug: 'judgeme-v2',
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
      googleMapsApiKey:
        process.env.APP_ENV === 'production'
          ? process.env.GOOGLE_MAPS_API_KEY_IOS_PROD
          : process.env.GOOGLE_MAPS_API_KEY_IOS_DEV,
    },
  },
  android: {
    package: process.env.APP_ENV === 'production' ? 'com.pchmn.kavout' : 'com.pchmn.kavout.dev',
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
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    eas: {
      projectId: '3d53b305-1ca3-45d2-92e0-7c7364a69a61',
    },
  },
};

export default config;
