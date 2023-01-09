import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

export type RootStackParamList = {
  Home: undefined;
  Onboard: { page: number };
};

export const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Onboard: 'onboard/:page',
      Home: 'home',
    },
  },
};
