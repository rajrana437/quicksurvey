"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  // Default to 'en' if pathname is null or undefined
  const currentLang = pathname ? pathname.split("/")[1] : "en";

  const handleLanguageChange = (lang: string) => {
    if (pathname) {
      const newPath = pathname.replace(`/${currentLang}`, `/${lang}`);
      router.push(newPath);
    }
    setDropdownOpen(false); // Close dropdown after selection
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="flex justify-between items-center p-6 bg-white shadow-md">
      <div className="flex items-center">
        <Image
          className="w-8 h-8 mr-2"
          src="/logo.png"
          alt="logo"
          width={100}
          height={100}
        />
        <h1 className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
          QuickSurvey
        </h1>
      </div>
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-md shadow-sm hover:bg-gray-200 transition-colors"
        >
          {currentLang === "en" ? "English" : "Français"}
          <svg
            className={`w-5 h-5 ml-2 transform transition-transform ${
              dropdownOpen ? "rotate-180" : "rotate-0"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <ul>
              <li>
                <button
                  onClick={() => handleLanguageChange("en")}
                  className={`block w-full text-left px-4 py-2 hover:bg-blue-600 hover:text-white ${
                    currentLang === "en" ? "bg-blue-100 text-blue-600" : "text-gray-800"
                  }`}
                >
                  English
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLanguageChange("fr")}
                  className={`block w-full text-left px-4 py-2 hover:bg-blue-600 hover:text-white ${
                    currentLang === "fr" ? "bg-blue-100 text-blue-600" : "text-gray-800"
                  }`}
                >
                  Français
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
