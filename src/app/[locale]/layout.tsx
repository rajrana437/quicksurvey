import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing, Locale } from "@/i18n/routing"; // Import the Locale type
import Header from "@/app/components/Header";
import localFont from "next/font/local"; // Importing the local font package
import "../globals.css"; // Assuming you still want to use the global styles

// Import the Geist fonts
const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Define the Params interface
interface Params {
  locale: Locale; // Locale type matches with your routing logic
}

type Props = {
  children: React.ReactNode;
  params: Promise<Params> | Params; // Account for async params
};

export async function generateStaticParams() {
  // Ensuring correct typing for the locales
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const resolvedParams = await params; // Await params if it's a Promise
  const { locale } = resolvedParams;

  // Ensure that the locale is valid
  if (!routing.locales.includes(locale)) {
    notFound(); // Handle invalid locale by showing 404 or similar
  }

  // Fetch the messages for the locale. Assuming getMessages() expects an object like { locale: 'en' }
  const messages = await getMessages({ locale }); // Pass an object with locale

  return (
    <NextIntlClientProvider messages={messages}>
      <Header />
      <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
