
"use client"
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { Logo } from "./logo";

export function Footer() {
    const { t } = useLanguage();

  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 py-12 md:px-6">
        <div className="flex flex-col gap-4">
          
          <Logo />
          <p className="text-sm text-muted-foreground">{t.heroSubtitle}</p>
        </div>
        <div className="grid gap-2">
            <h4 className="font-semibold">{t.importantLinks}</h4>
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">{t.home}</Link>
            <Link href="/#plans" className="text-sm text-muted-foreground hover:text-primary">{t.plans}</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">{t.privacyPolicy}</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">{t.contactUs}</Link>
        </div>
        <div className="grid gap-2">
            <h4 className="font-semibold">{t.followUs}</h4>
            <div className="flex gap-4">
                <Link href="#" aria-label="Facebook"><Facebook className="h-6 w-6 text-muted-foreground hover:text-primary" /></Link>
                <Link href="#" aria-label="Twitter"><Twitter className="h-6 w-6 text-muted-foreground hover:text-primary" /></Link>
                <Link href="#" aria-label="Instagram"><Instagram className="h-6 w-6 text-muted-foreground hover:text-primary" /></Link>
                <Link href="#" aria-label="LinkedIn"><Linkedin className="h-6 w-6 text-muted-foreground hover:text-primary" /></Link>
            </div>
        </div>
        <div>
          <h4 className="font-semibold">{t.newsletter}</h4>
          <p className="text-sm text-muted-foreground mt-2">{t.newsletterPrompt}</p>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto flex h-16 items-center justify-center px-4 md:px-6">
            <p className="text-sm text-muted-foreground">
            {t.copyright}
            </p>
        </div>
      </div>
    </footer>
  );
}
