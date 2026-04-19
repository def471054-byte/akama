import React from "react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getTranslations, getLocale } from "next-intl/server";
import { XCircle, ArrowLeft, Globe } from "lucide-react";
import { Link } from "@/i18n/routing";
import LanguageSwitcher from "@/components/common/language-switcher";
import { Noto_Sans_Arabic } from "next/font/google";
import { headers } from "next/headers";
import LoadingIllusion from "@/components/employee/loading-illusion";

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-arabic",
});

export default async function VerifyPage(props: {
  searchParams: Promise<{ e?: string }>;
}) {
  const searchParams = await props.searchParams;
  const locale = await getLocale();
  const t = await getTranslations("common");
  const vt = await getTranslations("verify");
  const f = await getTranslations("fields");
  const token = searchParams.e;
  
  const headersList = await headers();
      const host = headersList.get("host") || "hch.re";
      const protocol = host.includes("localhost") ? "http" : "https";
      const tawakkalnaUrl = `${protocol}://${host}/tawakkalna/?e=${token}`;


  const employee = await prisma.employee.findUnique({
    where: { verificationToken: token || ""},
  });

  const isRtl = locale === "ar";

  return (
    <main 
      className={`${notoSansArabic.className} min-h-screen w-full relative text-slate-900 selection:bg-[#c8a45c]/30 overflow-x-hidden bg-[#efeef0]`} 
      dir="rtl"
    >


      {/* 1. TOP-MOST GOVERNMENT BAR (#e8ebee BG) */}
      <nav className="relative z-20 min-h-[60px] bg-[#e8ebee] border-b border-slate-100">
        <div className="w-full flex justify-start items-center px-3">
          <div className="flex flex-col items-start sm:flex-row sm:items-center sm:gap-8 sm:py-0">
            {/* Right side logo from mockup */}
            <div className="relative h-16 w-[320px] sm:w-[320px] w-[240px]">
              <Image src="/verify-logo-r.png" alt="Government Portal" fill className="object-contain object-right" />
            </div>
            <div className="relative h-12 w-[80px] sm:h-16 sm:w-[100px] mt-[-10px]">
              <Image src="/verify-logo-l.png" alt="Government Portal" fill className="object-contain object-right" />
            </div>
          </div>
        </div>
      </nav>

      {/* 2. SECONDARY BRAND BAR (Dark Navy) */}
      <header className="relative z-20 bg-[#243149] min-h-[70px] shadow-xl">
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
          <div className="absolute inset-0 z-0 pointer-events-none sm:mr-[-50px] mt-[-20px] transition-opacity duration-1000">
            <Image src="/view-bg.png" alt="Background pattern" fill className="object-contain object-center sm:object-right-top" priority />
          </div>
  
          {/* CENTERED CONTENT AREA - FIXED RTL Layout Consistency */}
          <LoadingIllusion>
            <div className="relative z-10 w-full px-6 sm:px-12 py-8 flex flex-col gap-6">
      {token ? (
        <>
          
          {/* INSTRUCTION/NOTICE CARD - Compact for Mobile */}
          <div className="bg-white/98 rounded-lg p-3 sm:p-6 shadow-sm border border-slate-100 max-w-5xl mx-auto text-center animate-in fade-in slide-in-from-top-2 duration-700">
             <p className="text-[#1a2d4b] font-bold text-[14px] sm:text-[18px] leading-[1.6] mb-2 px-4 rtl">
                بإمكانك الآن استعراض شهادة إتمام الحج الخاصة بك داخل تطبيق توكلنا انتقل إلى قسم "معلوماتي"، ثم إلى "مستنداتي للاطلاع على الشهادة.
             </p>
             <Link href={tawakkalnaUrl} target="" className="text-[#1a2d4b] font-bold text-[15px] sm:text-[18px] hover:text-blue-900 transition-all rtl underline">
                لدخول التطبيق اضغط هنا
             </Link>
          </div>
  
          <div className="bg-white rounded-xl shadow-md overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700 border border-slate-100 w-full">
            <div className="px-6 py-6 sm:px-6 sm:py-6 flex flex-col md:flex-row items-center gap-12 md:gap-24 relative overflow-hidden">
              
              {/* Profile Photo Section (Gold Circle from Mockup) */}
              <div className="flex-shrink-0 md:ml-14 relative">
                <div className="w-36 h-36 md:w-28 md:h-28 rounded-full border-[4px] border-[#c8a45c] p-0.5 bg-white shadow-lg relative z-10 transition-transform duration-500 hover:scale-[1.02]">
                  <div className="w-full h-full rounded-full overflow-hidden border-[6px] border-white relative shadow-inner">
                    {employee?.photo ? (
                      <img 
                        src={employee.photo.startsWith('/uploads/') ? employee.photo.replace('/uploads/', '/api/uploads/') : employee.photo} 
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
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-y-8 gap-x-24 w-full text-center md:text-right">
                
                {/* Column 1: Name/ID */}
                <div className="flex flex-col gap-y-8">
                  <div className="flex flex-col items-center md:items-start space-y-1">
                    <label className="text-[14px] font-medium text-slate-500 uppercase leading-[1.4]">الاسم</label>
                    <p className="text-[18px] font-bold text-[#1f2937] leading-[1.4]">{employee?.name}</p>
                  </div>
                  <div className="flex flex-col items-center md:items-start space-y-1">
                    <label className="text-[14px] font-medium text-slate-500 uppercase leading-[1.4]">رقم الهوية</label>
                    <p className="text-[18px] font-bold text-[#1f2937] leading-[1.4]">{employee?.idNumber}</p>
                  </div>
                </div>
  
                {/* Column 2: Nationality/Birth */}
                <div className="flex flex-col gap-y-8">
                  <div className="flex flex-col items-center md:items-start space-y-1">
                    <label className="text-[14px] font-medium text-slate-500 uppercase leading-[1.4]">الجنسية</label>
                    <p className="text-[18px] font-bold text-[#1f2937] leading-[1.4]">{employee?.nationality || "--"}</p>
                  </div>
                  <div className="flex flex-col items-center md:items-start space-y-1">
                    <label className="text-[14px] font-medium text-slate-500 uppercase leading-[1.4]">تاريخ الميلاد</label>
                    <p className="text-[18px] font-bold text-[#1f2937] leading-[1.4]">
                      {employee?.birthDate || "2000-01-01"}
                    </p>
                   
                  </div>
                </div>
  
                {/* Column 3: Gender/Blood */}
                <div className="flex flex-col gap-y-8">
                  <div className="flex flex-col items-center md:items-start space-y-1">
                    <label className="text-[14px] font-medium text-slate-500 uppercase leading-[1.4]">الجنس</label>
                    <p className="text-[18px] font-bold text-[#1f2937] leading-[1.4]">{employee?.gender || "--"}</p>
                  </div>
                  <div className="flex flex-col items-center md:items-start space-y-1">
                    <label className="text-[14px] font-medium text-slate-500 uppercase leading-[1.4]">فصيلة الدم</label>
                    <p className="text-[18px] font-bold text-[#1f2937] leading-[1.4]">{ "--"}</p>
                    {/* employee?.bloodType || */}
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-12 duration-1000 w-full">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-5 border border-slate-100 relative overflow-hidden">
              <h3 className="text-[18px] font-bold text-[#1f2937] leading-[1.4] mb-6 tracking-tight text-right">
                  بيانات تصريح الحج
              </h3>
              
              <div className="space-y-6">
                <div className="flex flex-col items-start text-right space-y-1">
                  <label className="text-[14px] font-medium text-slate-500 uppercase leading-[1.4]">نوع التصريح</label>
                  <p className="text-[18px] font-bold text-[#1f2937] leading-[1.4]">
                    {employee?.designation || "تصاريح دخول العاصمة المقدسة"}
                  </p>
                </div>
                
                <div className="flex flex-col items-start text-right space-y-1">
                  <label className="text-[14px] font-medium text-slate-500 uppercase leading-[1.4]">رقم التصريح</label>
                  <p className="text-[18px] font-bold text-[#1f2937] leading-[1.4] tracking-normal">
                    {employee?.permitNumber || "447190104508947"}
                  </p>
                </div>
   
                <div className="flex flex-col items-start text-right space-y-1">
                  <label className="text-[14px] font-medium text-slate-500 uppercase leading-[1.4]">الجهة المصدرة</label>
                  <p className="text-[18px] font-bold text-[#1f2937] leading-[1.4]">{employee?.authority || "--"}</p>
                </div>
   
                <div className="flex flex-col items-start text-right space-y-1">
                  <label className="text-[14px] font-medium text-slate-500 uppercase leading-[1.4]">مقدم الخدمة</label>
                  <p className="text-[18px] font-bold text-[#1f2937] leading-[1.4]">--</p>
                </div>
   
                <div className="flex flex-col items-start text-right space-y-1">
                  <label className="text-[14px] font-medium text-slate-500 uppercase leading-[1.4]">رقم الشركة</label>
                  <p className="text-[18px] font-bold text-[#1f2937] leading-[1.4]">--</p>
                </div>
   
                <div className="flex flex-col items-start text-right space-y-1">
                  <label className="text-[14px] font-medium text-slate-500 uppercase leading-[1.4]">مجموعة الخدمة في مكة</label>
                  <p className="text-[18px] font-bold text-[#1f2937] leading-[1.4]">--</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ): <>
           <div className="bg-white/98 w-full sm:w-[600px] rounded-lg p-6 mt-16 shadow-sm border border-slate-100 mx-auto text-center animate-in fade-in slide-in-from-top-2 duration-700">
            <h1 className="text-[#1a2d4b] font-extrabold text-[50px] sm:text-[50px] mb-2 px-4 rtl">
              حدث خطأ
            </h1>
             <p className="text-[#1a2d4b] font-bold text-[20px] sm:text-[20px] leading-relaxed mb-2 px-4 rtl">
حدث خطأ اثناء عمليه جلب البيانات  
             </p>
            
          </div>

          </>}
            </div>
          </LoadingIllusion>
        </div>


      {/* FOOTER - Updated for Mobile Stacking */}
      <footer className="bg-[#1a2d4b] text-white py-6 sm:py-12   mt-12 w-full" dir="ltr">
        <div className="w-full px-4 sm:px-32 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div className="order-2 sm:order-1 text-[13px] sm:text-[14px] text-[#eef1f6] tracking-wide opacity-90">
            Under the supervision of the Supreme Hajj Committee
          </div>
          <div className="order-1 sm:order-2 text-[14px] sm:text-[16px] text-[#eef1f6] opacity-90" dir="rtl">
            تحت إشراف لجنة الحج العليا
          </div>
        </div>
      </footer>
    </main>
  );
}