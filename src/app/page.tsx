'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // Redirect to survey response page if logged in
      router.push('/survey/responses');
    } else {
      // Redirect to login page if not logged in
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Empty content as redirection will handle page navigation */}
    </div>
  );
}
