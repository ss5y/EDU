"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { usePathname } from "next/navigation";
import { translations, type Translation, type Language } from "@/lib/translations";

export type LanguageContextType = {
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
  t: Translation;
  dir: "ltr" | "rtl";
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

type LanguageProviderProps = {
  children: ReactNode;
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const pathname = usePathname();
  const [language, setLanguage] = useState<Language>("ar");

  // نحدد اللغة أول مرة من localStorage أو من الـ URL
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("edu-smart-language") as Language | null;
    let initial: Language = stored || "ar";

    if (!stored && pathname) {
      if (pathname.startsWith("/en")) initial = "en";
      if (pathname.startsWith("/ar")) initial = "ar";
    }

    setLanguage(initial);
  }, [pathname]);

  // نعدّل dir و lang في <html> ونخزن اللغة
  useEffect(() => {
    const dir: "ltr" | "rtl" = language === "ar" ? "rtl" : "ltr";

    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
      document.documentElement.dir = dir;
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem("edu-smart-language", language);
    }
  }, [language]);

  const value: LanguageContextType = useMemo(
    () => ({
      language,
      setLanguage,
      t: translations[language],
      dir: language === "ar" ? "rtl" : "ltr",
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
