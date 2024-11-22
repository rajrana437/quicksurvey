'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing'; // Import Link for routing
import "../globals.css"; // Import global styles for fonts and themes

const geistSans = "font-[var(--font-geist-sans)]"; // Assuming font is globally defined

export default function LocaleHome() {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path

  // Extract locale from the pathname, fallback to a default locale if pathname is null
  const locale = pathname ? pathname.split('/')[1] : 'en'; // Default to 'en'

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // Redirect to survey dashboard with locale
      router.push(`/${locale}/survey/dashboard`);
    } else {
      // Redirect to login page with locale
      router.push(`/${locale}/login`);
    }
  }, [router, locale]);

  const t = useTranslations('Home');

  return (
    <div className={`grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ${geistSans}`}>
      {/* You can keep the translation content if needed */}
      <h1>{t("welcome", { locale })}</h1>
      {/* Empty content, as the redirect will handle page navigation */}
    </div>
  );
}
