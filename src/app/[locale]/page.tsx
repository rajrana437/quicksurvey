'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Home() {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path
  const t = useTranslations('HomePage');

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

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Empty content as redirection will handle page navigation */}
    </div>
  );
}
