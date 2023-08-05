import 'dotenv/config';

import { ExpoConfig } from '@expo/config';

const name =
  process.env.APP_ENV === 'production'
    ? 'Kuzpot'
    : process.env.APP_ENV === 'development'
    ? 'KuzpotDev'
    : process.env.APP_ENV === 'preview'
    ? 'KuzpotPreview'
    : 'KuzpotLocal';

const appIdentifier =
  process.env.APP_ENV === 'production'
    ? 'com.kuzpot.app'
    : process.env.APP_ENV === 'development'
    ? 'com.kuzpot.dev'
    : process.env.APP_ENV === 'preview'
    ? 'com.kuzpot.preview'
    : 'com.kuzpot.local';

const config: ExpoConfig = {
  owner: 'pchmn',
  name,
  slug: 'kuzpot',
  scheme: 'kuzpot',
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
    url: 'https://u.expo.dev/5b16185f-e09f-4429-bb11-7e7a9344ca86',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: appIdentifier,
    buildNumber: '1.0.0',
    supportsTablet: true,
    config: {
      googleMapsApiKey:
        process.env.APP_ENV === 'production'
          ? process.env.GOOGLE_MAPS_API_KEY_IOS_PROD
          : process.env.GOOGLE_MAPS_API_KEY_IOS_DEV,
    },
    googleServicesFile:
      process.env.APP_ENV === 'production'
        ? process.env.GOOGLE_SERVICES_PLIST_PROD
        : process.env.APP_ENV === 'preview'
        ? process.env.GOOGLE_SERVICES_PLIST_PREVIEW
        : process.env.GOOGLE_SERVICES_PLIST_DEV,
    infoPlist: {
      UIBackgroundModes: ['fetch', 'remote-notification'],
    },
  },
  android: {
    package: appIdentifier,
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
    googleServicesFile:
      process.env.APP_ENV === 'production'
        ? process.env.GOOGLE_SERVICES_JSON_PROD
        : process.env.APP_ENV === 'preview'
        ? process.env.GOOGLE_SERVICES_JSON_PREVIEW
        : process.env.GOOGLE_SERVICES_JSON_DEV,
  },
  plugins: [
    '@react-native-firebase/app',
    'expo-notifications',
    './plugins/reactNativeMapsPlugin',
    './plugins/splashScreenPlugin',
    'sentry-expo',
    [
      'expo-build-properties',
      {
        ios: {
          deploymentTarget: '13.0',
          useFrameworks: 'static',
        },
        android: {
          enableProguardInReleaseBuilds: true,
          extraProguardRules: '-keep public class com.horcrux.svg.** {*;} -keep class com.facebook.crypto.** {*;}',
        },
      },
    ],
  ],
  hooks: {
    postPublish: [
      {
        file: 'sentry-expo/upload-sourcemaps',
        config: {
          organization: 'pchmn',
          project: process.env.APP_ENV === 'production' ? 'kuzpot' : 'kuzpot-dev',
        },
      },
    ],
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    eas: {
      projectId: '5b16185f-e09f-4429-bb11-7e7a9344ca86',
    },
  },
};

export default config;
