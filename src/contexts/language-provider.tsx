
"use client";
import { createContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { translations, Translation, Language } from '@/lib/translations';
import { usePathname } from 'next/navigation';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation;
  dir: 'ltr' | 'rtl';
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = language === 'ar' ? 'rtl' : 'ltr';
    if (language === 'ar' && !pathname.startsWith('/ar')) {
        // an example of how to handle routing, not implemented for this prototype
    }
  }, [language, pathname]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: translations[language],
    dir: language === 'ar' ? 'rtl' : 'ltr',
  }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
