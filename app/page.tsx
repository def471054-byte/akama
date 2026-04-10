import React from "react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getTranslations, getLocale } from "next-intl/server";
import { Globe, Search, ArrowLeft, CheckCircle2, HelpCircle } from "lucide-react";
import { Link } from "@/i18n/routing";

/**
 * TASREEH PORTAL REDESIGN - HIGH FIDELITY
 * Matches the official Saudi Tasreeh portal aesthetic.
 */
export default async function VerifyPage(props: {
  searchParams: Promise<{ e?: string }>;
}) {
  const searchParams = await props.searchParams;
  const locale = await getLocale();
  const t = await getTranslations("common");
  const vt = await getTranslations("verify");
  const f = await getTranslations("fields");

  const token = searchParams.e;
  // Force RTL/Arabic for the home/error views as requested
  const isRtl = locale === "ar" || !token; 
  
  const employee = token 
    ? await prisma.employee.findUnique({ where: { verificationToken: token } })
    : null;

  /**
   * COMMON LAYOUT WRAPPER 
   * Centered headers and footers with high-resolution assets.
   */
  const LayoutWrapper = ({ children, hideBg = false }: { children: React.ReactNode, hideBg?: boolean }) => (
    <main 
      className="min-h-screen w-full relative font-sans text-slate-900 selection:bg-[#1e3a5f]/30 overflow-x-hidden bg-[#f8f9fa] flex flex-col" 
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* 1. TOP WHITE GOVERNMENT BAR */}
      <nav className="bg-[#f2f4f6] h-12 flex items-center px-4 border-b border-slate-200 relative z-50">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center h-full">
            {/* Logo positioned using absolute to match the top-bar feel */}
            <div className="relative h-full w-[400px]">
               <Image 
                 src="/verify-logo.png" 
                 alt="Government of Saudi Arabia" 
                 fill 
                 className={`object-contain ${isRtl ? "object-right" : "object-left"}`} 
               />
            </div>
            {/* Placeholder for 'How to verify' if not in the image */}
            {!isRtl && <div className="text-[12px] text-green-700 font-bold hidden sm:block">How to verify ⌵</div>}
        </div>
      </nav>

      {/* 2. MAIN NAVY PORTAL HEADER */}
      <header className="bg-[#1e3a5f] h-20 flex items-center px-4 relative z-50 shadow-xl">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center text-white h-full">
          {/* Left: Language Selection */}
          <div className="flex items-center">
             <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-all cursor-pointer bg-black/5">
                <span className="text-sm font-bold">{isRtl ? "English" : "العربية"}</span>
                <Globe className="w-4 h-4 text-white/80" />
             </div>
          </div>
          
          {/* Right: Tasreeh Identity */}
          <div className="relative h-12 w-56">
            <Image 
              src="/verify-logo1.png" 
              alt="Tasreeh Portal" 
              fill 
              className={`object-contain ${isRtl ? "object-left" : "object-right"}`} 
            />
          </div>
        </div>
      </header>

      {/* 3. MAIN CONTENT BODY */}
      <div className="flex-1 relative w-full overflow-hidden flex flex-col items-center py-16 px-4">
        {/* Background Watermark - Matches SS positioning */}
        {!hideBg && (
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none z-0 select-none overflow-hidden">
             <div className="absolute bottom-[-5%] right-[-5%] w-[110%] h-[110%]">
                <Image 
                  src="/view-bg.png" 
                  alt="Background pattern" 
                  fill 
                  className="object-contain object-bottom-right scale-110" 
                  priority 
                />
             </div>
          </div>
        )}

        {/* Card Content */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center">
           {children}
        </div>
      </div>

      {/* 4. FOOTER */}
      <footer className="bg-[#1e3a5f] text-white py-8 relative z-50">
        <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left opacity-90">
          <div className="text-[14px] font-sans tracking-wide">
             Under the supervision of the Supreme Hajj Committee
          </div>
          <div className="text-[16px] font-bold" dir="rtl">
             تحت إشراف لجنة الحج العليا
          </div>
        </div>
      </footer>
    </main>
  );

  /**
   * STATE 1: HOME PAGE / SEARCH
   * Simplified centered card to match the "Tasreeh" portal landing.
   */
  if (!token) {
    return (
      <LayoutWrapper>
         <div className="w-full flex justify-center py-12 animate-in fade-in duration-1000">
            <div className="bg-white rounded-[20px] py-16 px-12 shadow-sm border border-slate-100/50 max-w-[1100px] w-full text-center flex flex-col items-center justify-center gap-12">
               <h1 className="text-[64px] font-bold text-[#1a2d48] tracking-tight leading-tight">
                  الاستعلام عن تصريح الحج
               </h1>
               <p className="text-[32px] font-normal text-slate-500/90 leading-relaxed max-w-3xl px-6 mt-2">
                  تتيح هذه الخدمة الاستعلام عن حالة تصاريح الحج والتحقق من صلاحيتها بشكل إلكتروني
               </p>
            </div>
         </div>
      </LayoutWrapper>
    );
  }

  /**
   * STATE 2: ERROR / INVALID TOKEN
   * Matches the "حدث خطأ" card EXACTLY from the screenshot.
   * Minimalist, wide, and centered.
   */
  if (token && !employee) {
    return (
      <LayoutWrapper>
         {/* Auto-redirect after 5 seconds */}
         <script dangerouslySetInnerHTML={{ __html: `setTimeout(() => { window.location.href = "/"; }, 5000);` }} />
         
         <div className="w-full flex justify-center py-16 animate-in fade-in duration-1000">
            <div className="bg-white rounded-[20px] py-16 px-12 shadow-sm border border-slate-100/50 max-w-[1100px] w-full text-center flex flex-col items-center justify-center gap-10">
               <h1 className="text-[82px] font-bold text-[#1a2d48] tracking-tight leading-none italic">
                  حدث خطأ
               </h1>
               <p className="text-[36px] font-normal text-slate-500/90 leading-relaxed font-sans mt-6 px-10">
                  حدث خطأ اثناء عمليه جلب البيانات
               </p>
            </div>
         </div>
      </LayoutWrapper>
    );
  }

  const currentEmployee = employee!;

  /**
   * STATE 3: SUCCESS (Employee Details)
   */
  return (
    <LayoutWrapper>
       <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full max-w-6xl">
          
          <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-100 text-center">
             <p className="text-[#1a2d48] font-bold text-xl leading-relaxed">
                {isRtl 
                  ? "بإمكانك الآن استعراض شهادة إتمام الحج الخاصة بك داخل تطبيق توكلنا انتقل إلى قسم 'معلوماتي'، ثم إلى 'مستنداتي' للاطلاع على الشهادة."
                  : "You can now view your Hajj completion certificate in the Tawakkalna application. Go to 'My Info' then 'My Documents'."}
             </p>
          </div>

          <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 p-10 flex flex-col lg:flex-row items-center lg:items-start gap-16">
             <div className="flex-shrink-0 relative">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-[6px] border-[#c8a45c] p-2 bg-white shadow-2xl relative z-10">
                   <div className="w-full h-full rounded-full overflow-hidden border-[8px] border-white relative">
                     {currentEmployee.photo ? (
                       <img 
                         src={currentEmployee.photo.startsWith('/uploads/') ? currentEmployee.photo.replace('/uploads/', '/api/uploads/') : currentEmployee.photo} 
                         alt={currentEmployee.name} 
                         className="w-full h-full object-cover" 
                       />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center bg-slate-50 text-[#1a2d48]/20">
                         <span className="text-[80px] font-black">{currentEmployee.name.charAt(0)}</span>
                       </div>
                     )}
                   </div>
                </div>
             </div>

             <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-12 w-full text-right">
                {[
                  { label: "الاسم", value: currentEmployee.name, bold: true },
                  { label: "رقم الهوية", value: currentEmployee.idNumber, mono: true },
                  { label: "الجنسية", value: currentEmployee.nationality },
                  { label: "تاريخ الميلاد", value: currentEmployee.birthDate ? new Date(currentEmployee.birthDate).toISOString().split('T')[0] : "--" },
                  { label: "الجنس", value: currentEmployee.gender || "--" },
                  { label: "فصيلة الدم", value: currentEmployee.bloodType || "--" },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                     <label className="text-sm font-black text-slate-400 uppercase tracking-widest">{item.label}</label>
                     <p className={`text-xl ${item.bold ? "font-black" : "font-extrabold"} text-[#1a2d48] ${item.mono ? "font-mono" : ""}`}>
                        {item.value}
                     </p>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-white rounded-[32px] shadow-xl p-10 border border-slate-100 max-w-xl text-right ml-auto">
             <h3 className="text-2xl font-black text-[#1a2d48] mb-8 border-r-4 border-[#c8a45c] pr-4">
                بيانات تصريح الحج
             </h3>
             <div className="space-y-8">
                {[
                  { label: "نوع التصريح", value: currentEmployee.designation },
                  { label: "رقم التصريح", value: currentEmployee.permitNumber || "--", mono: true, large: true },
                  { label: "الجهة المصدرة", value: currentEmployee.authority },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest">{item.label}</label>
                    <p className={`${item.large ? "text-2xl" : "text-xl"} font-extrabold text-[#1a2d48] ${item.mono ? "font-mono tracking-widest text-[#c8a45c]" : ""}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </LayoutWrapper>
  );
}
