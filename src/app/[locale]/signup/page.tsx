'use client';
import { FormEvent, useState } from "react";
import { usePathname } from "next/navigation";
import FormField from "../../components/FormField";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const pathname = usePathname();
  const locale = pathname ? pathname.split('/')[1] : 'en';
  const t = useTranslations("SignUpPage"); // Load translations for SignUpPage

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    // Username validation
    if (!username) {
      newErrors.username = t("validation.usernameRequired");
    } else if (username.length < 3) {
      newErrors.username = t("validation.usernameMinLength");
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      newErrors.email = t("validation.emailRequired");
    } else if (!emailRegex.test(email)) {
      newErrors.email = t("validation.emailInvalid");
    }

    // Password validation
    if (!password) {
      newErrors.password = t("validation.passwordRequired");
    } else if (password.length < 6) {
      newErrors.password = t("validation.passwordMinLength");
    } else if (!/\d/.test(password)) {
      newErrors.password = t("validation.passwordNumber");
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password = t("validation.passwordSpecialChar");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = `/${locale}/survey/create`;
    } else {
      setErrors({ api: t("error.general") });
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href={`/${locale}`}
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <Image className="w-8 h-8 mr-2" src="/logo.png" alt="logo" width={100} height={100} />
          Quick Survey
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {t("title")}
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <FormField
                label={t("username")}
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("username")}
                required
                error={errors.username}
              />
              <FormField
                label={t("email")}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("email")}
                required
                error={errors.email}
              />
              <FormField
                label={t("password")}
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                error={errors.password}
              />
              {errors.api && <p className="text-red-500 text-sm">{errors.api}</p>}
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
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">
                      {t("rememberMe")}
                    </label>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {t("signUp")}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                {t("signUpQuestion")}{" "}
                <a
                  href={`/${locale}/login`}
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  {t("signIn")}
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
