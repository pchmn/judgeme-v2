import 'expo-dev-client';
import '@/core/i18n';

import { useUiProviderContext } from '@kavout/react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import RNBootSplash from 'react-native-bootsplash';

import { useAuth } from '@/core/auth';
import { linking } from '@/core/routes';
import HomeScreen, { useInitialRegion } from '@/modules/Home';
import OnboardScreen, { LocationPermissionView, useIsFirstLaunch, useLocationPermissions } from '@/modules/Onboard';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

export default function App() {
  const { navigationTheme } = useUiProviderContext();

  const { value: isFirstLaunch, isLoading: isFirstLaunchLoading } = useIsFirstLaunch();
  const { locationPermissions, isLoading: locationPermissionsLoading } = useLocationPermissions();
  const { isLoading: authLoading } = useAuth();
  const { initialRegion, isLoading: initialRegionLoading } = useInitialRegion();

  useEffect(() => {
    if (!authLoading && !isFirstLaunchLoading && !locationPermissionsLoading && !initialRegionLoading) {
      RNBootSplash.hide({ fade: true, duration: 500 });
    }
  }, [authLoading, isFirstLaunchLoading, locationPermissionsLoading, initialRegionLoading]);

  if (isFirstLaunchLoading || authLoading || initialRegionLoading || locationPermissionsLoading) {
    return null;
  }

  if (isFirstLaunch) {
    return <OnboardScreen />;
  }

  if (!locationPermissions?.granted && !isFirstLaunch) {
    return <LocationPermissionView />;
  }

  return (
    <NavigationContainer theme={navigationTheme} linking={linking}>
      <Tab.Navigator
        initialRouteName={'Home'}
        compact={true}
        sceneAnimationEnabled={true}
        sceneAnimationType="shifting"
      >
        <Tab.Screen
          name="Home"
          initialParams={{ initialRegion }}
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: 'map-outline',
          }}
        />
        <Tab.Screen
          name="Onboard"
          component={OnboardScreen}
          options={{
            tabBarLabel: 'Onboard',
            tabBarIcon: 'home',
          }}
        />
      </Tab.Navigator>
      {/* <BottomNavigation navigationState={{ index, routes }} onIndexChange={setIndex} renderScene={() => <></>} /> */}
    </NavigationContainer>
  );
}

const MusicRoute = () => <></>;

const AlbumsRoute = () => <></>;

const RecentsRoute = () => <></>;

const NotificationsRoute = () => <></>;
