import React from "react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getTranslations, getLocale } from "next-intl/server";
import { XCircle, ArrowLeft, Globe } from "lucide-react";
import { Link } from "@/i18n/routing";
import LanguageSwitcher from "@/components/common/language-switcher";

export default async function VerifyPage(props: {
  searchParams: Promise<{ e?: string }>;
}) {
  const searchParams = await props.searchParams;
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
          <p className="text-slate-500 mb-6">No verification token provided.</p>
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
          <p className="text-slate-500 mb-6">The verification token provided is invalid or has expired.</p>
          <Link href="/" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" /> {vt("backToHome")}
          </Link>
        </div>
      </div>
    );
  }

  const isRtl = locale === "ar";

  return (
    <main 
      className="min-h-screen w-full relative font-sans text-slate-900 selection:bg-[#c8a45c]/30 overflow-x-hidden bg-[#efeef0]" 
      dir="rtl"
    >


      {/* 1. TOP-MOST GOVERNMENT BAR (#e8ebee BG) */}
      <nav className="relative z-20 bg-[#e8ebee] border-b border-slate-100">
        <div className="w-full flex justify-start items-center px-6">
          <div className="flex items-center">
            {/* Right side logo from mockup */}
            <div className="relative h-16 w-[400px]">
              <Image src="/verify-logo.png" alt="Government Portal" fill className="object-contain object-left" />
            </div>
          </div>
        </div>
      </nav>

      {/* 2. SECONDARY BRAND BAR (Dark Navy) */}
      <header className="relative z-20 bg-[#243149] shadow-xl">
        <div className="w-full flex justify-between items-center px-6">
          <div className="flex items-center">
            {/* Disabled Language Button with stylized border */}
            <div className="opacity-50 cursor-not-allowed flex items-center gap-3 px-4 py-2 rounded-lg border-2 border-blue-600/40 text-white font-bold text-sm bg-black/10 backdrop-blur-sm">
               <Globe className="w-4 h-4 text-white" />
               <span>{isRtl ? "English" : "العربية"}</span>
            </div>
          </div>
          <div className="flex items-center">
            {/* Left side site logo from mockup */}
            <div className="relative h-16 w-48">
              <Image src="/verify-logo1.png" alt="Tassreeh" fill className="object-contain object-left" />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT WRAPPER (Spans full width for background alignment) */}
      <div className="relative w-full overflow-hidden min-h-[calc(100vh-140px)] bg-[#efeef0]">
        {/* BACKGROUND PATTERN LAYER (Now all the way right with normal blend to avoid seams) */}
        <div className="absolute inset-0 z-0 pointer-events-none  mr-[-50px] mt-[-20px] transition-opacity duration-1000">
          <Image src="/view-bg.png" alt="Background pattern" fill className="object-contain object-right-top" priority />
        </div>

        {/* CENTERED CONTENT AREA - FIXED RTL Layout Consistency */}
        <div className="relative z-10 w-full px-6 sm:px-12 py-8 flex flex-col gap-6">
        
        {/* INSTRUCTION/NOTICE CARD - Fixed Arabic Text */}
        <div className="bg-white/98 rounded-lg p-6 shadow-sm border border-slate-100 max-w-5xl mx-auto text-center animate-in fade-in slide-in-from-top-2 duration-700">
           <p className="text-[#1a2d4b] font-bold text-[15px] sm:text-[15px] leading-relaxed mb-2 px-4 font-sans rtl">
              بإمكانك الآن استعراض شهادة إتمام الحج الخاصة بك داخل تطبيق توكلنا انتقل إلى قسم "معلوماتي"، ثم إلى "مستنداتي" للاطلاع على الشهادة.
           </p>
           <button className="text-[#1a2d4b] font-bold text-[15px] sm:text-[15px]  hover:text-blue-900 transition-all font-sans rtl">
              لدخول التطبيق اضغط هنا
           </button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700 border border-slate-100 w-full">
          <div className="px-6 py-6 sm:px-6 sm:py-6 flex flex-col md:flex-row items-center gap-12 md:gap-24 relative overflow-hidden">
            
            {/* Profile Photo Section (Gold Circle from Mockup) */}
            <div className="flex-shrink-0 ml-14 relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[4px] border-[#c8a45c] p-0.5 bg-white shadow-lg relative z-10 transition-transform duration-500 hover:scale-[1.02]">
                <div className="w-full h-full rounded-full overflow-hidden border-[6px] border-white relative shadow-inner">
                  {employee?.photo ? (
                    <img 
                      src={employee.photo} 
                      alt={employee.name} 
                      className="w-full h-full object-cover m-0" 
                      style={{ transform: 'scale(1.1)' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-200">
                      <span className="text-5xl font-black">{employee?.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Information Grid (Fixed RTL Column Consistency) */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-y-10 gap-x-24 w-full text-right">
              
              {/* Column 1: Name/ID */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-start">
                  <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 font-sans">الاسم</label>
                  <p className="text-[15px] font-extrabold text-[#1a2d4b] uppercase leading-tight">{employee?.name}</p>
                </div>
                <div className="flex flex-col items-start">
                  <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 font-sans">رقم الهوية</label>
                  <p className="text-[15px] font-extrabold text-[#1a2d4b] font-mono">{employee?.idNumber}</p>
                </div>
              </div>

              {/* Column 2: Nationality/Birth */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-start">
                  <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 font-sans">الجنسية</label>
                  <p className="text-[15px] font-extrabold text-[#1a2d4b] uppercase">{employee?.nationality || "--"}</p>
                </div>
                <div className="flex flex-col items-start">
                  <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 font-sans">تاريخ الميلاد</label>
                  <p className="text-[15px] font-extrabold text-[#1a2d4b] font-mono">
                    {employee?.birthDate ? new Date(employee.birthDate).toISOString().split('T')[0] : "1992-02-01"}
                  </p>
                </div>
              </div>

              {/* Column 3: Gender/Blood */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-start">
                  <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 font-sans">الجنس</label>
                  <p className="text-[15px] font-extrabold text-[#1a2d4b] uppercase">{employee?.gender || "--"}</p>
                </div>
                <div className="flex flex-col items-start">
                  <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 font-sans">فصيلة الدم</label>
                  <p className="text-[15px] font-extrabold text-[#1a2d4b] uppercase">{employee?.bloodType || "--"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-start animate-in fade-in slide-in-from-bottom-12 duration-1000 w-full">
          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-5 border border-slate-100 relative overflow-hidden">
            <h3 className="text-[22px] font-black text-[#1a2d4b] mb-6 tracking-tight text-right font-sans">
                بيانات تصريح الحج
            </h3>
            
            <div className="space-y-6">
              <div className="flex flex-col items-start text-right">
                <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wide font-sans">نوع التصريح</label>
                <p className="text-[15px] font-extrabold text-[#1a2d4b] uppercase">
                  {employee?.designation || "تصاريح دخول العاصمة المقدسة"}
                </p>
              </div>
              
              <div className="flex flex-col items-start text-right">
                <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wide font-sans">رقم التصريح</label>
                <p className="text-[18px] font-extrabold text-[#1a2d4b] font-mono tracking-widest">
                  {employee?.permitNumber || "447190104508947"}
                </p>
              </div>

              <div className="flex flex-col items-start text-right">
                <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wide font-sans">الجهة المصدرة</label>
                <p className="text-[15px] font-extrabold text-[#1a2d4b]">{employee?.authority || "--"}</p>
              </div>

              <div className="flex flex-col items-start text-right">
                <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wide font-sans">مقدم الخدمة</label>
                <p className="text-[15px] font-extrabold text-[#1a2d4b]">--</p>
              </div>

              <div className="flex flex-col items-start text-right">
                <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wide font-sans">رقم الشركة</label>
                <p className="text-[15px] font-extrabold text-[#1a2d4b]">--</p>
              </div>

              <div className="flex flex-col items-start text-right">
                <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wide font-sans">مجموعة الخدمة في مكة</label>
                <p className="text-[15px] font-extrabold text-[#1a2d4b]">--</p>
              </div>
            </div>
          </div>
          </div>
      </div>
    </div>

      {/* FOOTER */}
      <footer className="bg-[#1a2d4b] text-white py-8 mt-12 w-full" dir="ltr">
        <div className="w-full px-10 sm:px-32 flex justify-between items-center text-center sm:text-left">
          <div className="text-[13px] sm:text-[14px] text-[#eef1f6] tracking-wide  opacity-90">
            Under the supervision of the Supreme Hajj Committee
          </div>
          <div className="text-[14px] sm:text-[16px] text-[#eef1f6] opacity-90" dir="rtl">
            تحت إشراف لجنة الحج العليا
          </div>
        </div>
      </footer>
    </main>
  );
}
