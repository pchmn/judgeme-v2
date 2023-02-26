import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { Region } from 'react-native-maps';

export type RootStackParamList = {
  Home: { initialRegion?: Region };
  Onboard: undefined;
};

export const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Onboard: 'onboard/:page',
      Home: 'home/:initialRegion',
    },
  },
};
