import 'intl-pluralrules';

import { getLocales } from 'expo-localization';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './en.json';
import frTranslations from './fr.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  fr: {
    translation: frTranslations,
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: getLocales()[0].languageCode || 'en',
  interpolation: {
    escapeValue: false,
  },
  fallbackLng: 'en',
});

export default i18next;
