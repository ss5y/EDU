import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/contexts/theme-provider';
import { LanguageProvider } from '@/contexts/language-provider';
import { Toaster } from '@/components/ui/toaster';
import { AiPlatformHelper } from '@/components/ai-platform-helper';

export const metadata: Metadata = {
  title: 'EDU Smart',
  description: 'An innovative educational platform for university students.',
  icons: {
    icon: 'https://i.ibb.co/h1X4FPxF/5261fa16-9817-4c6a-924e-9f5aaf3c9d57.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Playfair+Display:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <Toaster />
            {/* 🔹 المساعد الذكي العام للمنصّة – يظهر كزر عائم في كل الصفحات */}
            <AiPlatformHelper />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
