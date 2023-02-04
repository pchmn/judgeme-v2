import { argbFromHex, hexFromArgb, Scheme, themeFromSourceColor } from '@importantimport/material-color-utilities';
import color from 'color';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

const opacity = {
  level1: 0.08,
  level2: 0.12,
  level3: 0.16,
  level4: 0.38,
};

const elevations = ['transparent', 0.05, 0.08, 0.11, 0.12, 0.14];

export function createDynamicThemeColors(sourceColor: string) {
  const { schemes, palettes } = themeFromSourceColor(argbFromHex(sourceColor));

  return { light: generateSchemeFrom(schemes.light, palettes), dark: generateSchemeFrom(schemes.dark, palettes) };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateSchemeFrom(scheme: Scheme, palettes: any) {
  const materialScheme: Partial<MD3Colors> = {};
  const jsonScheme = scheme.toJSON();
  type schemeKeys = Exclude<keyof MD3Colors, 'elevation' | 'surfaceDisabled' | 'onSurfaceDisabled' | 'backdrop'>;

  for (const key in jsonScheme) {
    materialScheme[key as schemeKeys] = hexFromArgb(jsonScheme[key as schemeKeys]);
  }

  const elevation = elevations.reduce(
    (a, v, index) => ({
      ...a,
      [`level${index}`]:
        index === 0 ? v : color(jsonScheme.surface).mix(color(jsonScheme.primary), Number(v)).rgb().string(),
    }),
    {}
  ) as MD3Colors['elevation'];

  const customColors = {
    surfaceDisabled: color(jsonScheme.onSurface).alpha(opacity.level2).rgb().string(),
    onSurfaceDisabled: color(jsonScheme.onSurface).alpha(opacity.level4).rgb().string(),
    backdrop: color(palettes.neutralVariant.tone(20)).alpha(0.4).rgb().string(),
  };

  return { ...materialScheme, elevation, ...customColors } as MD3Colors;
}
