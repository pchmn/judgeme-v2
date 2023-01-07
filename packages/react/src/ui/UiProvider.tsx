import * as NavigationBar from 'expo-navigation-bar';
import { PropsWithChildren, useEffect, useMemo } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';

export function UiProvider({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  const theme: ThemeProp = useMemo(
    () => (colorScheme === 'dark' ? { ...MD3DarkTheme, mode: 'adaptive' } : MD3LightTheme),
    [colorScheme]
  );

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(theme.colors.background);
    NavigationBar.setButtonStyleAsync(theme.dark ? 'light' : 'dark');
  }, [theme]);

  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      {children}
    </PaperProvider>
  );
}
