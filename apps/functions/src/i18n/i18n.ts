const translations = {
  en: {
    from: (distanceInKm: number) =>
      `From ${distanceInKm < 1 ? Math.round(distanceInKm * 1000) + 'm' : distanceInKm + 'km'} away`,
  },
  fr: {
    from: (distanceInKm: number) =>
      `À ${distanceInKm < 1 ? Math.round(distanceInKm * 1000) + 'm' : distanceInKm + 'km'}`,
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
