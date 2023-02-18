import 'expo-dev-client';

import { useUiProviderContext } from '@kavout/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { hideAsync, preventAutoHideAsync } from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { useAuth } from '@/core/auth';
import { linking } from '@/core/routes';
import HomeScreen, { useInitialRegion } from '@/modules/Home';
import OnboardScreen, { useOnboard } from '@/modules/Onboard';

const Stack = createNativeStackNavigator();

preventAutoHideAsync();

export default function App() {
  const { navigationTheme } = useUiProviderContext();
  const { isFirstLaunch, locationPermissionStatus, isLoading: onboardLoading } = useOnboard();
  const { isLoading: authLoading } = useAuth();
  const { preferredRegion, isLoading: preferredRegionLoading } = useInitialRegion();

  const [rootViewReady, setRootViewReady] = useState(false);

  useEffect(() => {
    if (!authLoading && !onboardLoading && !preferredRegionLoading && rootViewReady) {
      hideAsync();
    }
  }, [authLoading, onboardLoading, preferredRegionLoading, rootViewReady]);

  if (onboardLoading || authLoading || preferredRegionLoading) {
    return null;
  }

  return (
    <NavigationContainer theme={navigationTheme} linking={linking} onReady={() => setRootViewReady(true)}>
      <Stack.Navigator
        initialRouteName={isFirstLaunch || !locationPermissionStatus?.granted ? 'Onboard' : 'Home'}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Onboard" initialParams={{ page: isFirstLaunch ? 0 : 1 }} component={OnboardScreen} />
        <Stack.Screen name="Home" initialParams={{ initialRegion: preferredRegion }} component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
