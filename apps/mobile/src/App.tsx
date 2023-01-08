import { useUiProviderContext } from '@judgeme/react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';

import { Appbar } from '@/core/layouts';
import { WelcomeScreen } from '@/modules/Welcome';

const Stack = createNativeStackNavigator();

export default function App() {
  const { navigationTheme } = useUiProviderContext();
  const theme = useTheme();

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ header: (props) => <Appbar {...props} /> }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
