const translations = {
  en: {
    from: (distance: string) => `from ${distance} away`,
  },
  fr: {
    from: (distance: string) => `à ${distance}`,
  },
};

type Language = keyof typeof translations;
type Translation = typeof translations;

export function i18n(locale: Language | string) {
  return isObjKey(locale, translations) ? translations[locale] : translations[getLanguageFromLocale(locale)];
}

export function getLanguageFromLocale(locale?: string) {
  const language = getLocaleWithouRegionCode(locale);

  return isObjKey(language, translations) ? language : 'en';
}

export function getLocaleWithouRegionCode(locale?: string) {
  if (!locale) {
    return 'en';
  }

  return locale.includes('-') ? locale.split('-')[0] : locale;
}

function isObjKey(key: PropertyKey, obj: Translation): key is Language {
  return key in obj;
}
