import 'expo-dev-client';

import { Flex, useEffectOnce, useSignInAnonymously, useUiProviderContext } from '@kavout/react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ToastAndroid } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { linking } from '@/core/routes';
import { HomeScreen } from '@/modules/Home';
import { OnboardScreen, useOnboard } from '@/modules/Onboard';

import { useRegisterDevice } from './core/notifications';

const Stack = createNativeStackNavigator();

export default function App() {
  const { navigationTheme } = useUiProviderContext();
  const { isFirstLaunch, locationPermissionStatus, isLoading: onboardLoading } = useOnboard();
  const { mutate: signInAnonymously, isLoading: signInLoading } = useSignInAnonymously();

  const { register } = useRegisterDevice();

  useEffectOnce(() => {
    signInAnonymously(undefined, {
      onSuccess: (user) => {
        register(user.user.uid);
        ToastAndroid.show('Signed in as ' + user.user.uid, ToastAndroid.LONG);
      },
    });
  });

  if (onboardLoading && signInLoading) {
    return (
      <Flex flex={1} align="center" justify="center">
        <ActivityIndicator size="large" />
      </Flex>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme} linking={linking}>
      <Stack.Navigator
        initialRouteName={isFirstLaunch || !locationPermissionStatus?.granted ? 'Onboard' : 'Home'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Onboard" initialParams={{ page: isFirstLaunch ? 0 : 1 }} component={OnboardScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
