import 'expo-dev-client';
import '@/core/i18n';

import { useUiProviderContext } from '@kuzpot/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { hideAsync } from 'expo-splash-screen';

import { useAuth } from '@/core/auth';
import { linking } from '@/core/routes';
import HomeScreen from '@/screens/Home';
import OnboardScreen, { LocationPermissionView } from '@/screens/Onboard';
import { useInitialRegion, useIsFirstLaunch, useLocationPermissions } from '@/shared/hooks';

const Stack = createNativeStackNavigator();

export default function App() {
  const { navigationTheme } = useUiProviderContext();

  const [isFirstLaunch] = useIsFirstLaunch();
  const { locationPermissions, isLoading: locationPermissionsLoading } = useLocationPermissions();
  const { isLoading: authLoading } = useAuth();
  const { initialRegion, isLoading: initialRegionLoading } = useInitialRegion();

  if (!authLoading && !locationPermissionsLoading && !initialRegionLoading) {
    hideAsync();
  }

  if (authLoading || initialRegionLoading || locationPermissionsLoading) {
    return null;
  }

  if (!locationPermissions?.granted && !isFirstLaunch) {
    return <LocationPermissionView />;
  }

  return (
    <NavigationContainer theme={navigationTheme} linking={linking}>
      <Stack.Navigator
        initialRouteName={isFirstLaunch ? 'Onboard' : 'Home'}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Onboard" component={OnboardScreen} />
        <Stack.Screen name="Home" initialParams={{ initialRegion }} component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
