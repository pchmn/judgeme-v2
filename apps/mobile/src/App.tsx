import { useAsyncStorage, useUiProviderContext } from '@judgeme/react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { linking } from '@/core/routes';
import { HomeScreen } from '@/modules/Home';
import { WelcomeScreen } from '@/modules/Welcome';

const Stack = createNativeStackNavigator();

export default function App() {
  const { navigationTheme } = useUiProviderContext();
  const { value, isLoading } = useAsyncStorage<boolean>('isFirstLaunch');

  console.log('value', { value, isLoading });

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer theme={navigationTheme} linking={linking}>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ header: (props) => <></> }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
