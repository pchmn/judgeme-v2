import { describe, expect, test } from 'vitest';

import { getLanguageFromLocale } from './i18n';

describe('[i18n] getLanguageFromLocale', () => {
  test('should return en if locale is undefined', () => {
    expect(getLanguageFromLocale()).toBe('en');
  });

  test('should return en if locale is empty', () => {
    expect(getLanguageFromLocale('')).toBe('en');
  });

  test('should return en if locale is not found', () => {
    expect(getLanguageFromLocale('ru')).toBe('en');
  });

  test('should return fr if locale has region code', () => {
    expect(getLanguageFromLocale('fr-FR')).toBe('fr');
  });

  test('should return fr if locale is fr', () => {
    expect(getLanguageFromLocale('fr')).toBe('fr');
  });
});
