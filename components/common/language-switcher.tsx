"use client";

import { useLocale } from "next-intl";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLocale = () => {
    const nextLocale = locale === "ar" ? "en" : "ar";
    
    // Set cookie for next-intl to read on next request
    Cookies.set("NEXT_LOCALE", nextLocale, { expires: 365, path: "/" });
    
    // Refresh the entire page to ensure server components and next-intl 
    // re-read the cookie without any URL prefixing issues.
    window.location.reload();
  };

  return (
    <Button 
      variant="outline" 
      onClick={toggleLocale}
      className={`
        flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all
        ${locale === "ar" 
          ? "bg-slate-900 text-white hover:bg-slate-800 border-none" 
          : "bg-blue-600 text-white hover:bg-blue-700 border-none"
        }
        shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95
      `}
    >
      <Globe className="w-3.5 h-3.5 opacity-70" />
      <span>{locale === "ar" ? "English" : "العربية"}</span>
    </Button>
  );
}
