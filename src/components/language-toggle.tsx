
"use client"

import { Globe } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleLanguage} aria-label="Toggle language">
        <Globe className="h-5 w-5" />
    </Button>
  )
}
