// src/app/[locale]/layout.tsx
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing, Locale } from "@/i18n/routing"; // Import the Locale type
import Header from "@/app/components/Header";
import localFont from "next/font/local"; // Importing the local font package
import "../globals.css"; // Assuming you still want to use the global styles

// Import the Geist fonts
const geistSans = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: '../fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

// Define the Params interface
interface Params {
  locale: Locale;
}

type Props = {
  children: React.ReactNode;
  params: Params;
};

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Ensure that the locale is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Fetch the messages for the locale
  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider messages={messages}>
      <Header />
      <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
