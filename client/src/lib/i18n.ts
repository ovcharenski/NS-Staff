import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    common: {} as any,
  },
  ru: {
    common: {} as any,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

// Load translations from API
async function loadTranslations() {
  try {
    const [enCommon, ruCommon] = await Promise.all([
      fetch('/locales/en/common.json').then(r => r.json()),
      fetch('/locales/ru/common.json').then(r => r.json()),
    ]);
    
    i18n.addResourceBundle('en', 'common', enCommon, true, true);
    i18n.addResourceBundle('ru', 'common', ruCommon, true, true);
  } catch (error) {
    console.error('Failed to load translations:', error);
  }
}

loadTranslations();

export default i18n;
