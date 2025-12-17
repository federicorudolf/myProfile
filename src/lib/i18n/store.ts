import { writable, derived } from 'svelte/store';
import { translations, type Language } from './translations';
import { browser } from '$app/environment';

// Get initial language from localStorage or browser
const getInitialLanguage = (): Language => {
  if (browser) {
    const stored = localStorage.getItem('language') as Language;
    if (stored && (stored === 'en' || stored === 'es')) {
      return stored;
    }
    // Detect browser language
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'es' ? 'es' : 'en';
  }
  return 'en';
};

export const currentLanguage = writable<Language>(getInitialLanguage());

// Derived store for translations
export const t = derived(currentLanguage, ($currentLanguage) => translations[$currentLanguage]);

// Function to change language
export const setLanguage = (lang: Language) => {
  currentLanguage.set(lang);
  if (browser) {
    localStorage.setItem('language', lang);
  }
};

// Function to toggle between languages
export const toggleLanguage = () => {
  currentLanguage.update(lang => {
    const newLang = lang === 'en' ? 'es' : 'en';
    if (browser) {
      localStorage.setItem('language', newLang);
    }
    return newLang;
  });
};
