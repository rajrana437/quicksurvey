"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import FormField from "../../components/FormField";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function LoginPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const locale = pathname ? pathname.split("/")[1] : "en"; // Default to 'en'
  const t = useTranslations("LoginPage");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userName, password }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = `/${locale}/survey/dashboard`;
      } else {
        setError(t("error.invalidCredentials"));
      }
    } catch (err) {
      setError(t("error.general"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <Image
            className="w-8 h-8 mr-2"
            src="/logo.png"
            alt="logo"
            width={100}
            height={100}
          />
          {t("projectName")}
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {t("title")}
            </h1>
            {error && <p className="text-red-500 text-sm">{error}</p>}{" "}
            {/* Show error message */}
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <FormField
                id="username"
                label={t("username")}
                type="username"
                placeholder={t("username")}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              <FormField
                id="password"
                label={t("password")}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      {t("rememberMe")}
                    </label>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  {t("forgotPassword")}
                </a>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {loading ? t("signingIn") : t("signIn")}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                {t("signUpQuestion")}{" "}
                <a
                  href={`/${locale}/signup`}
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  {t("signUp")}
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
