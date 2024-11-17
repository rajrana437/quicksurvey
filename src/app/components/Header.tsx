"use client";

import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (lang: string) => {
    router.push(`/${lang}${pathname}`);
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 shadow">
      <h1 className="text-black font-bold color-black">QuickSurvey</h1>
      <div>
        <button
          onClick={() => handleLanguageChange("en")}
          className="px-4 py-2 text-blue-600"
        >
          English
        </button>
        <button
          onClick={() => handleLanguageChange("fr")}
          className="px-4 py-2 text-gray-600"
        >
          Français
        </button>
      </div>
    </header>
  );
}
