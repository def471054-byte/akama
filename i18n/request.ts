import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { cookies } from "next/headers";

export default getRequestConfig(async ({ requestLocale }) => {
  // Try to get locale from requestLocale (passed by middleware) or manually from cookies
  let locale = await requestLocale;
  
  if (!locale) {
    const cookieStore = await cookies();
    locale = cookieStore.get("NEXT_LOCALE")?.value;
  }

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
