import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

export const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Welcome: 'welcome',
      Home: 'home',
    },
  },
};
