import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  Theme,
} from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { adaptNavigationTheme, MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';

import { createDynamicThemeColors } from './theme';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

type ColorScheme = 'light' | 'dark';

interface UiProviderProps {
  baseColor?: string;
  colorScheme?: ColorScheme;
  toggleColorScheme?: (colorScheme?: ColorScheme) => void;
  changeBaseColor?: (color: string) => void;
  theme?: ThemeProp;
  navigationTheme?: Theme;
}

const UiProviderContext = createContext<UiProviderProps>({} as UiProviderProps);

export function useUiProviderContext() {
  const ctx = useContext(UiProviderContext);
  if (!ctx) {
    throw new Error('useUiProviderContext must be used inside UiProvider');
  }
  return ctx;
}

export function UiProvider({ children, baseColor = '#FFD9DA' }: PropsWithChildren<UiProviderProps>) {
  const { light: lightColors, dark: darkColors } = createDynamicThemeColors(baseColor);
  console.log('darkColors', darkColors);

  const colorScheme = useColorScheme();

  const theme = useMemo(
    () =>
      colorScheme === 'dark' ? { ...MD3DarkTheme, colors: darkColors } : { ...MD3LightTheme, colors: lightColors },
    [colorScheme, darkColors, lightColors]
  );

  const navigationTheme: Theme = useMemo(
    () =>
      colorScheme === 'dark'
        ? {
            ...DarkTheme,
            ...MD3DarkTheme,
            colors: { ...DarkTheme.colors, ...darkColors },
            mode: 'adaptive',
          }
        : { ...LightTheme, ...MD3LightTheme, colors: { ...LightTheme.colors, ...lightColors } },
    [colorScheme, lightColors, darkColors]
  );

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(theme.colors.elevation.level2);
    NavigationBar.setButtonStyleAsync(theme.dark ? 'light' : 'dark');
  }, [theme]);

  return (
    <UiProviderContext.Provider value={{ colorScheme: colorScheme || undefined, theme, navigationTheme }}>
      <PaperProvider theme={theme}>
        <StatusBar style={theme.dark ? 'light' : 'dark'} backgroundColor="transparent" translucent />
        {children}
      </PaperProvider>
    </UiProviderContext.Provider>
  );
}
