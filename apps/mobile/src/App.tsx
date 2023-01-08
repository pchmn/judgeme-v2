import { useUiProviderContext } from '@judgeme/react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Appbar } from '@/core/layouts';
import { linking } from '@/core/routes';
import { WelcomeScreen } from '@/modules/Welcome';

const Stack = createNativeStackNavigator();

export default function App() {
  const { navigationTheme } = useUiProviderContext();

  return (
    <NavigationContainer theme={navigationTheme} linking={linking}>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ header: (props) => <Appbar {...props} /> }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
