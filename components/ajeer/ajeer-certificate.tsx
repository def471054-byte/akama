'use client';

import React from 'react';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';

interface AjeerCertificateProps {
  employee: {
    id: string;
    name: string;
    designation: string | null;
    idNumber: string | null;
    nationality: string | null;
    company: string | null;
    providerEstNumber: string | null;
    beneficiaryEstName: string | null;
    beneficiaryEstNumber: string | null;
    description: string | null;
    issueDate: Date | null | string;
    expiryDate: Date | null | string;
    workLocations: string | null;
    verificationToken: string | null;
    ajeerId: string | null;
  };
}

export default function AjeerCertificate({ employee }: AjeerCertificateProps) {
  // Format dates
  const formatDate = (date: Date | string | null) => {
    if (!date) return '--';
    // If it's already a string (which it is now in the DB), just return it.
    // Otherwise, convert for backward compatibility during transition.
    if (typeof date === 'string') return date;
    return format(date, 'yyyy/MM/dd');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 print:py-0 print:px-0 font-ajeer" dir="rtl">
      {/* Main Document Container */}
      <div className="max-w-[850px] mx-auto bg-white shadow-2xl p-10 sm:p-12 border border-slate-300 print:shadow-none print:border-none print:p-8 flex flex-col min-h-[1120px] print:h-[1120px]">
        
        {/* 1. DOCUMENT HEADER */}
        <header className="flex border border-gray-300 py-0 px-2 justify-between items-start mb-12 relative">
          {/* Top Left: QR Code Section */}
            <div className="flex items-center">
             {/* HRSD Ministry Logo */}
             <div className="relative h-24 w-40 sm:h-28 sm:w-48">
                <Image 
                  src="/ajeer-logo.png" 
                  alt="Ministry Logo" 
                  fill 
                  className="object-contain" 
                  priority
                />
             </div>
          </div>
          {/* Center: Title */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center flex items-center justify-center">
             <h1 className="text-xl sm:text-[13px] text-slate-800 font-alexandria font-bold tracking-tight whitespace-nowrap">
                إشعار أجير – تعاقد أجير
             </h1>
          </div>

          {/* Right: Logos Group */}
           <div className="flex flex-col items-end">
             <div className="p-1">
                <QRCodeSVG 
                  value={`https://akama.aamardokan.online/ajeer/${employee.id}`} 
                  size={80} 
                  level="H"
                />
             </div>
             <span className="text-[13px] font-mono tracking-tighter">
                {employee.ajeerId || 'TQ6478946'}
             </span>
          </div>
        </header>

        {/* 2. INTRO TEXT */}
        <div className="mb-2 text-gray-900 font-alexandria text-[11px] leading-[20px] sm:text-[11.5px] text-center sm:text-justify max-w-3xl mx-auto">
           نشعركم أنه تم التعاقد من قبلنا كجهة مقدمة للخدمة مع الجهة المستفيدة من الخدمة حسب المعلومات المبينة أدناه، ولذلك تم 
           تسجيل معلومات العقد لتكون بحوزة العامل لإثبات عدم مخالفته لنظام العمل وتقديمها إلى من يهمه الأمر من الجهات المختصة 
           عند طلبها للتحقق من صحة تواجده في مكان تقديم الخدمة
        </div>

        {/* 3. CORE DATA TABLE */}
        <div className="border border-slate-300 rounded-[2px] overflow-hidden text-[13px]">
           
           {/* SECTION: WORKER DATA */}
           <div className="font-alexandria font-semibold py-0 px-4 py-1 text-[12px]  border-b border-slate-300 text-center text-slate-700">
              بيانات العامل
           </div>
           <div className="grid grid-cols-12 border-b border-slate-300">
              <div className="col-span-3 bg-[#ecf0f1] py-1 px-2 font-normal border-l border-slate-300">اسم العامل</div>
              <div className="col-span-3 py-1 px-2 border-l border-slate-300 font-normal uppercase">{employee.name}</div>
              <div className="col-span-3 bg-[#ecf0f1] py-1 px-2 font-normal border-l border-slate-300">المهنة</div>
              <div className="col-span-3 py-1 px-2">{employee.designation || '--'}</div>
           </div>
           <div className="grid grid-cols-12 border-b border-slate-300">
              <div className="col-span-3 bg-[#ecf0f1] py-1 px-2 font-normal border-l border-slate-300">رقم الهوية / الإقامة</div>
              <div className="col-span-3 py-1 px-2 border-l border-slate-300 font-mono font-normal">{employee.idNumber || '--'}</div>
              <div className="col-span-3 bg-[#ecf0f1] py-1 px-2 font-normal border-l border-slate-300">الجنسية</div>
              <div className="col-span-3 py-1 px-2">{employee.nationality || '--'}</div>
           </div>

           {/* SECTION: PROVIDER DATA */}
           <div className="font-alexandria font-semibold py-0 px-4 py-1 text-[13px]  border-b border-slate-300 text-center text-slate-700">
              بيانات مقدم الخدمة
           </div>
           <div className="grid grid-cols-12 border-b border-slate-300">
              <div className="col-span-3 bg-[#ecf0f1] py-1 px-2 font-normal border-l border-slate-300">المنشأة المقدمة للخدمة</div>
              <div className="col-span-3 py-1 px-2 border-l border-slate-300 font-normal">{employee.company || '--'}</div>
              <div className="col-span-3 bg-[#ecf0f1] py-1 px-2 font-normal border-l border-slate-300 text-[11px] leading-tight flex items-center justify-center text-center">رقم المنشأة في وزارة الموارد البشرية</div>
              <div className="col-span-3 py-1 px-2 text-center flex items-center justify-center font-mono">{employee.providerEstNumber || '--'}</div>
           </div>

           {/* SECTION: BENEFICIARY DATA */}
           <div className="font-alexandria font-semibold  py-0 px-4 py-1 text-[13px] border-b border-slate-300 text-center text-slate-700">
              بيانات المستفيد من الخدمة
           </div>
           <div className="grid grid-cols-12 border-b border-slate-300">
              <div className="col-span-3 bg-[#ecf0f1] py-1 px-2 font-normal border-l border-slate-300">المنشأة المستفيدة من الخدمة</div>
              <div className="col-span-3 py-1 px-2 border-l border-slate-300 font-normal">{employee.beneficiaryEstName || '--'}</div>
              <div className="col-span-3 bg-[#ecf0f1] py-1 px-2 font-normal border-l border-slate-300 text-[11px] leading-tight flex items-center justify-center text-center">رقم المنشأة في وزارة الموارد البشرية</div>
              <div className="col-span-3 py-1 px-2 text-center flex items-center justify-center font-mono">{employee.beneficiaryEstNumber || '--'}</div>
           </div>

           {/* SECTION: PERMIT DATA */}
           <div className="font-alexandria font-semibold  py-0 px-4  py-1 text-[13px] border-b border-slate-300 text-center text-slate-700">
              بيانات التصريح
           </div>
           <div className="grid grid-cols-12 border-b border-slate-300">
              <div className="col-span-3 bg-[#ecf0f1] py-1 px-2 font-normal border-l border-slate-300">نبذة عن التعاقد</div>
              <div className="col-span-9 py-1 px-2">{employee.description || '--'}</div>
           </div>
           <div className="grid grid-cols-12 border-b border-slate-300">
              <div className="col-span-3 bg-[#ecf0f1] py-1 px-2 font-normal border-l border-slate-300">تاريخ بداية التصريح</div>
              <div className="col-span-3 py-1 px-2 border-l border-slate-300 text-center font-mono">{formatDate(employee.issueDate)}</div>
              <div className="col-span-3 bg-[#ecf0f1] py-1 px-2 font-normal border-l border-slate-300 text-center">تاريخ نهاية التصريح</div>
              <div className="col-span-3 py-1 px-2 text-center font-mono">{formatDate(employee.expiryDate)}</div>
           </div>
           <div className="grid grid-cols-12 bg-white">
              <div className="col-span-3 bg-[#ecf0f1] py-1 px-2 font-normal border-l border-slate-300">مواقع العمل</div>
              <div className="col-span-9 py-1 px-2 font-normal text-slate-700">{employee.workLocations || '--'}</div>
           </div>
        </div>
2
        {/* 4. DECLARATIONS */}
        <div className="mt-6 space-y-4">
           <h3 className="font-alexandria  font-semibold text-center  text-[12px] mb-2 text-slate-900 underline underline-offset-8 decoration-2 decoration-slate-200">إقرارات</h3>
           <div className="font-semibold font-alexandria text-neutral-800 text-[12px] mb-2 leading-tight">
              أقر أنا المنشأة المقدمة للخدمة والموضحة بياناتي أعلاه وأتعهد بـ:
           </div>
           <ul className="font-alexandria font-normal space-y-2 pr-4 list-disc marker:text-slate-400 text-neutral-700 text-[11px] leading-relaxed">
              <li>إن العامل حامل هذا التصريح بحمله له يقر ويتعهد بأن البيانات المدونة فيه صحيحة على مسؤوليته الشخصية، وأنه يعمل لدي المنشأة ولحسابها، بموجب رخصة إقامة سارية المفعول ويتحمل أي تبعات قانونية أو غرامات تترتب على خلاف المذكور أعلاه.</li>
              <li>الالتزام والتقيد بأنظمة العمل والعمال وأي أنظمة أو لوائح وقرارات أخرى ذات علاقة.</li>
              <li>أن الموقع الإلكتروني الخاص بأجير أو القائمين عليه عبارة عن وسيط إلكتروني ما بين الباحثين عن العمل وأصحاب الأعمال فقط وبدون أي التزام قانوني أو غيره على القائمين على موقع أجير.</li>
              <li>أي تعديل أو كشط في هذا التصريح يجعله لاغياً.</li>
           </ul>
        </div>

        {/* 5. DOCUMENT FOOTER */}
        <footer className="mt-auto flex flex-col items-center gap-2 text-center pb-2">
           <div className="text-neutral-500 text-[12px] space-y-1">
              <p>للتحقق من صحة هذا التصريح وسريان مفعوله بإمكانك زيارة موقع أجير (http://ajeer.com.sa)</p>
              <p className="font-normal text-slate-900">* خدمة معتمدة من وزارة الموارد البشرية والتنمية الاجتماعية *</p>
           </div>
        </footer>
      </div>

      {/* Print Helper Instructions */}
      <div className="mt-8 text-center print:hidden">
         <button 
           onClick={() => window.print()}
           className="bg-[#1e3a5f] text-white px-8 py-3 rounded-xl font-normal hover:shadow-xl transition-all active:scale-95 flex items-center gap-2 mx-auto"
         >
           <span>طباعة التصريح / حفظ PDF</span>
         </button>
      </div>

    </div>
  );
}
