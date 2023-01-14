import 'expo-dev-client';

import { Flex, useUiProviderContext } from '@kavout/react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native-paper';

import { linking } from '@/core/routes';
import { HomeScreen } from '@/modules/Home';
import { OnboardScreen, useOnboard } from '@/modules/Onboard';

const Stack = createNativeStackNavigator();

export default function App() {
  const { navigationTheme } = useUiProviderContext();
  const { isFirstLaunch, locationPermissionStatus, isLoading } = useOnboard();

  if (isLoading) {
    return (
      <Flex flex={1} align="center" justify="center">
        <ActivityIndicator size="large" />
      </Flex>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme} linking={linking}>
      <Stack.Navigator
        initialRouteName={isFirstLaunch || !locationPermissionStatus.granted ? 'Onboard' : 'Home'}
        screenOptions={{ header: (props) => <></> }}
      >
        <Stack.Screen name="Onboard" initialParams={{ page: isFirstLaunch ? 0 : 1 }} component={OnboardScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
