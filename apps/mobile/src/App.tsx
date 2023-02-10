import 'expo-dev-client';

import { useUiProviderContext } from '@kavout/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { hideAsync, preventAutoHideAsync } from 'expo-splash-screen';
import { useEffect, useRef } from 'react';

import { useAuth } from '@/core/auth';
import { linking } from '@/core/routes';
import { HomeScreen } from '@/modules/Home';
import { OnboardScreen, useOnboard } from '@/modules/Onboard';

const Stack = createNativeStackNavigator();

preventAutoHideAsync();

export default function App() {
  const { navigationTheme } = useUiProviderContext();
  const { isFirstLaunch, locationPermissionStatus, isLoading: onboardLoading } = useOnboard();
  const { isLoading: authLoading } = useAuth();

  const rootViewReady = useRef(false);

  useEffect(() => {
    console.log('App: useEffect', { authLoading, onboardLoading, rootViewReady: rootViewReady.current });
    if (!authLoading && !onboardLoading && rootViewReady.current) {
      hideAsync();
    }
  }, [authLoading, onboardLoading, rootViewReady]);

  if (onboardLoading && authLoading) {
    return null;
  }

  return (
    <NavigationContainer theme={navigationTheme} linking={linking} onReady={() => (rootViewReady.current = true)}>
      <Stack.Navigator
        initialRouteName={isFirstLaunch || !locationPermissionStatus?.granted ? 'Onboard' : 'Home'}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Onboard" initialParams={{ page: isFirstLaunch ? 0 : 1 }} component={OnboardScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
