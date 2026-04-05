"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  const t = useTranslations("common");
  return (
    <Button
      variant="ghost"
      className="w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-white/10"
      onClick={() => signOut({ callbackUrl: "/ar/login" })}
    >
      <LogOut className="w-5 h-5" />
      <span>{t("logout")}</span>
    </Button>
  );
}
