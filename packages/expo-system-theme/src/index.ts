import ExpoSystemThemeModule from './ExpoSystemThemeModule';

type SystemTheme = {
  baseColor: string;
  primary: string[];
  secondary: string[];
  tertiary: string[];
  neutral_1: string[];
  neutral_2: string[];
};

export function getSystemTheme(): SystemTheme | null {
  return ExpoSystemThemeModule.getTheme();
}
