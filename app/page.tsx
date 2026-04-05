import React from "react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getTranslations, getLocale } from "next-intl/server";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import LanguageSwitcher from "@/components/common/language-switcher";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: { e?: string };
}) {
  const locale = await getLocale();
  const t = await getTranslations("common");
  const vt = await getTranslations("verify");
  const f = await getTranslations("fields");

  const token = searchParams.e;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">{t("invalid")}</h1>
          <p className="text-slate-500 mb-6 font-outfit">No verification token provided.</p>
          <Link href="/" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" /> {vt("backToHome")}
          </Link>
        </div>
      </div>
    );
  }

  const employee = await prisma.employee.findUnique({
    where: { verificationToken: token },
  });

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center animate-in fade-in duration-500">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">{t("invalid")}</h1>
          <p className="text-slate-500 mb-6 font-outfit">The verification token provided is invalid or has expired.</p>
          <Link href="/" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" /> {vt("backToHome")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-12">
      {/* HEADER */}
      <header className="bg-[#1e3a5f] text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-3">
             {/* Logo Placeholder */}
             <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
               <span className="font-bold text-xl">🇸🇦</span>
             </div>
             <h1 className="text-lg font-bold tracking-tight hidden sm:block uppercase">Digital Identity Verification</h1>
          </div>
          <div className="flex gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="container mx-auto mt-8 px-4 flex justify-center">
        <div className="max-w-xl w-full">
          {/* MAIN CARD */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative">
            {/* Top Pattern Header */}
            <div className="h-32 bg-[#1e3a5f] relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,_white_1px,transparent_0)] bg-[size:40px_40px]"></div>
            </div>

            {/* Profile Photo - Overlapping */}
            <div className="flex flex-col items-center -mt-16 relative z-10">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-[#c8a45c] bg-white overflow-hidden shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  {employee.photo ? (
                    <Image src={employee.photo} alt={employee.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                      <CheckCircle2 className="w-16 h-16 opacity-20" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-full shadow-lg">
                   <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-slate-800 font-outfit">{employee.name}</h2>
              <p className="text-slate-500 font-medium mb-2 tracking-wider">{employee.idNumber}</p>
            </div>

            {/* PERSONAL INFO SECTION */}
            <div className="px-8 pb-8 space-y-6">
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">{f("nationality")}</p>
                  <p className="text-slate-700 font-semibold">{employee.nationality || "N/A"}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">{f("gender")}</p>
                  <p className="text-slate-700 font-semibold">{employee.gender || "M"}</p>
                </div>
              </div>

              {/* HIGHLIGHT BAR */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-center gap-2 text-slate-600 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#c8a45c]" />
                  <span>{vt("supervision")}</span>
              </div>

              {/* PERMIT INFO SECTION */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#1e3a5f] uppercase tracking-[0.2em]">{t("permitInfo")}</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                   <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{f("permitNumber")}</p>
                      <p className="text-slate-800 font-semibold">{employee.permitNumber || "ID-" + employee.id.slice(-6)}</p>
                   </div>
                   <div className="space-y-1 text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{f("designation")}</p>
                      <p className="text-slate-800 font-semibold">{employee.designation || "Employee"}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{f("issueDate")}</p>
                      <p className="text-slate-800 font-semibold">{employee.issueDate?.toLocaleDateString() || "-"}</p>
                   </div>
                   <div className="space-y-1 text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{f("expiryDate")}</p>
                      <p className="text-slate-800 font-semibold">{employee.expiryDate?.toLocaleDateString() || "-"}</p>
                   </div>
                </div>
              </div>

              <div className="flex flex-col items-center pt-4">
                 <div className="bg-green-50 text-green-700 px-8 py-3 rounded-full font-bold flex items-center gap-2 border border-green-200 animate-pulse">
                    <CheckCircle2 className="w-6 h-6" />
                    {vt("verifiedStatus")}
                 </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center text-slate-400 text-xs font-medium uppercase tracking-widest">
            © 2026 Employee Identity & Verification Service
          </div>
        </div>
      </main>
    </div>
  );
}
