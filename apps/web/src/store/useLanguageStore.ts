import { create } from 'zustand';
import { LOCALES } from '../locales';

export type SupportedLanguage = 
  | 'en' 
  | 'es' 
  | 'zh' 
  | 'hi' 
  | 'ur' 
  | 'ar' 
  | 'fr' 
  | 'de' 
  | 'ja' 
  | 'pt' 
  | 'ru' 
  | 'it';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', dir: 'rtl' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr' },
  { code: 'zh', name: 'Mandarin', nativeName: '中文', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', dir: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', dir: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', dir: 'ltr' }
];

export function isRTLLanguage(lang: SupportedLanguage): boolean {
  return lang === 'ur' || lang === 'ar';
}

export function isNonLatinLanguage(lang: SupportedLanguage): boolean {
  return lang === 'hi' || lang === 'zh' || lang === 'ur' || lang === 'ar' || lang === 'ja' || lang === 'ru';
}

interface LanguageStoreState {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

function applyDocumentLanguage(lang: SupportedLanguage) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
    const isRTL = isRTLLanguage(lang);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    if (isRTL) {
      document.documentElement.classList.add('rtl-active');
    } else {
      document.documentElement.classList.remove('rtl-active');
    }
  }
}

const savedLang = (typeof localStorage !== 'undefined' ? localStorage.getItem('openguide_lang') : null) as SupportedLanguage;
const initialLanguage: SupportedLanguage = LANGUAGES.some(l => l.code === savedLang) ? savedLang : 'en';

// Apply on startup
applyDocumentLanguage(initialLanguage);

export const useLanguageStore = create<LanguageStoreState>((set, get) => ({
  language: initialLanguage,
  setLanguage: (lang: SupportedLanguage) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('openguide_lang', lang);
    }
    applyDocumentLanguage(lang);
    set({ language: lang });
  },
  t: (key: string) => {
    const lang = get().language;
    const aliases: Record<string, string> = {
      firstPrinciplesLabel: 'hero_first_principles_label',
      first_principles_label: 'hero_first_principles_label',
      exploreAllQuestions: 'hero_explore_questions',
      explore_all_questions: 'hero_explore_questions',
    };
    const lookupKey = aliases[key] || key;
    const snakeKey = lookupKey.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    const camelKey = lookupKey.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    return (
      LOCALES[lang]?.[lookupKey] || 
      LOCALES[lang]?.[snakeKey] || 
      LOCALES[lang]?.[camelKey] || 
      LOCALES.en?.[lookupKey] || 
      LOCALES.en?.[snakeKey] || 
      LOCALES.en?.[camelKey] || 
      key
    );
  }
}));
