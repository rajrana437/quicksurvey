import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  i18n: {
    locales: ["en", "fr"], // Add supported languages here
    defaultLocale: "en",   // Set the default language
  },
  // Add other configurations as needed
};

export default nextConfig;
