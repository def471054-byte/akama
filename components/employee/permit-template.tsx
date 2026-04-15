"use client";

import { QRCodeSVG } from "qrcode.react";

type PermitTemplateProps = {
  employee: any;
  verificationUrl: string;
  isPdf?: boolean;
};

export default function PermitTemplate({ employee, verificationUrl, isPdf = false }: PermitTemplateProps) {
  const labelWidth = "w-[22%] shrink-0";
  
  // Helper classes to ensure PDF consistency
  // Labels on the RIGHT in RTL, meaning border-l is between label and value
  const labelClass = `${labelWidth} p-3 bg-white border-l-[1.5px] border-black text-center flex items-center justify-center text-[14px] ${isPdf ? 'font-normal' : 'font-bold'}`;
  const boldValueClass = `flex-1 p-3 text-center flex items-center justify-center uppercase ${isPdf ? 'text-[14px] font-normal' : 'text-[15px] font-bold'}`;

  return (
    <div className={`w-full bg-white font-ajeer ${isPdf ? 'pb-10 p-4' : 'p-8'}`}>
      {/* Outer Card Wrapper - To match the "framed" card look */}
      <div className="border-[1.2px] border-gray-300 bg-white overflow-hidden shadow-sm">
        
        {/* 1. Main Table Section */}
        <div className="border-[1.5px] border-black bg-white mx-5 mt-5 overflow-hidden">
           {/* Header Grid Row: Photo Left, Logos Right */}
           <div 
             className="flex flex-row-reverse justify-between items-stretch bg-white min-h-[220px] border-b-[1.5px] border-black text-black"
             style={isPdf ? { paddingLeft: '20px', paddingRight: '20px' } : { paddingLeft: '16px', paddingRight: '16px' }}
           >
              {/* Vision 2030 (Far Right in RTL) */}
              <div className="w-[30%] py-4 flex flex-col items-end justify-center shrink-0">
                 <div className="h-48 w-auto relative">
                    <img src="/version-2023.png" alt="Vision 2030" className="h-full w-auto object-contain" />
                 </div>
              </div>

              {/* Saudi Crest (Center) */}
              <div className="flex-1 flex flex-col items-center justify-center ">
                 <div className="h-56 w-auto relative">
                    <img src="/ksa-logo.png" alt="Crest" className="h-full w-auto object-contain" />
                 </div>
              </div>

              {/* Photo (Far Left) */}
              <div className="w-[30%] py-4 flex flex-col items-start justify-center shrink-0">
                 <div className="w-36 h-48 bg-[#f8fafc] border-[1.2px] p-[1px] border-gray-400 relative overflow-hidden flex items-center justify-center">
                    {employee.photo ? (
                       <img 
                         src={employee.photo.startsWith('/uploads/') ? employee.photo.replace('/uploads/', '/api/uploads/') : employee.photo} 
                         alt="Employee Photo" 
                         className="w-full h-full object-cover" 
                       />
                    ) : (
                       <div className="text-[10px] text-slate-400 uppercase text-center p-2 font-normal">PHOTO</div>
                    )}
                 </div>
              </div>
           </div>

           {/* Data Rows */}
           <div className="flex border-b-[1.5px] border-black min-h-[52px] text-black">
              <div className={labelClass}>رقم التصريح</div>
              <div className={`flex-1 p-3 text-center tracking-[0.1em] flex items-center justify-center font-normal ${isPdf ? 'text-[14px]' : 'text-[16px]'}`}>{employee.permitNumber || "208"}</div>
           </div>

           <div className="flex border-b-[1.5px] border-black min-h-[52px] text-black">
              <div className={labelClass}>اسم حامل التصريح</div>
              <div className={boldValueClass}>{employee.name}</div>
           </div>

           <div className="flex border-b-[1.5px] border-black min-h-[52px] text-black">
              <div className={labelClass}>تاريخ اصدار التصريح</div>
              <div className={`w-[28%] p-3 text-center flex items-center justify-center border-l-[1.5px] border-black font-normal ${isPdf ? 'text-[14px]' : 'text-[13px]'}`}>
                 {employee.issueDate ? new Date(employee.issueDate).toLocaleDateString('en-GB').replace(/\//g, '-') : '20-09-2025'}
              </div>
              <div className={labelClass}>تاريخ انتهاء التصريح</div>
              <div className={`flex-1 p-3 text-center flex items-center justify-center font-normal ${isPdf ? 'text-[14px]' : 'text-[13px]'}`}>
                 {employee.expiryDate ? new Date(employee.expiryDate).toLocaleDateString('en-GB').replace(/\//g, '-') : '27-06-2026'}
              </div>
           </div>

           <div className="flex border-b-[1.5px] border-black min-h-[52px] text-black text-[14px]">
              <div className={labelClass}>رقم الهوية</div>
              <div className="flex-1 p-3 text-center flex items-center justify-center font-normal">{employee.idNumber || "277"}</div>
           </div>

           <div className="flex border-b-[1.5px] border-black min-h-[52px] text-black text-[14px]">
              <div className={labelClass}>الجنسية</div>
              <div className="flex-1 p-3 text-center flex items-center justify-center font-normal">{employee.nationality || "Saudi"}</div>
           </div>

           <div className="flex border-b-[1.5px] border-black min-h-[52px] text-black text-[14px]">
              <div className={labelClass}>الجنس</div>
              <div className="flex-1 p-3 text-center flex items-center justify-center font-normal">{employee.gender || "ذكر"}</div>
           </div>

           <div className="flex border-b-[1.5px] border-black min-h-[52px] text-black text-[14px]">
              <div className={labelClass}>اسم الشركة/المؤسسة</div>
              <div className="flex-1 p-3 text-center flex items-center justify-center uppercase font-normal">{employee.company || "Company Name"}</div>
           </div>

           <div className="flex min-h-[52px] text-black text-[14px]">
              <div className={labelClass}>جهة الموافقة</div>
              <div className="flex-1 p-3 text-center flex items-center justify-center font-normal">{employee.authority || "المديرية العامة للجوازات"}</div>
           </div>
        </div>

        <div className="h-10" />

         {/* 2. Purpose Table Section */}
         <div className="border-[1.5px] border-black bg-white mx-5 overflow-hidden text-black text-[14px]">
           <div className="flex border-b-[1.5px] border-black min-h-[52px]">
               <div className={labelClass}>غرض التصريح</div>
               <div className="flex-1 p-3 text-center flex items-center justify-center text-[14px] font-normal">{employee.purpose || "عمل دائم"}</div>
           </div>
           <div className="flex min-h-[72px]">
               <div className={`${labelWidth} p-4 bg-white border-l-[1.5px] border-black text-center flex items-center justify-center leading-tight text-[14px] ${isPdf ? 'font-normal' : 'font-bold'}`}>وصف غرض التصريح</div>
               <div className="flex-1 p-4 text-center leading-relaxed flex items-center justify-center text-[14px] font-normal">
                  {employee.description || "السلام عليكم نامل من سعادتكم اصدار تصاريح للعمال علما بانه مقر الشركة داخل مكة"}
               </div>
           </div>
        </div>

        <div className="h-10" />

         {/* 3. Instructions & QR Section */}
         <div 
           className="border-[1.5px] border-black bg-white mx-5 flex flex-row items-center text-black overflow-hidden"
           style={isPdf ? { padding: '15px', minHeight: '180px' } : { padding: '24px', minHeight: '160px' }}
         >
           <div 
             className="bg-white shrink-0 border-[1px] border-gray-200 p-2 ml-4"
           >
              {verificationUrl && (
                <QRCodeSVG 
                   value={verificationUrl} 
                   size={150} 
                   level="L" 
                   includeMargin={false}
                />
              )}
           </div>
           <div className="flex-1 text-right">
              <div className={`mb-3 ${isPdf ? 'text-[15px] font-bold' : 'text-[18px] font-bold'}`}>التعليمات:</div>
              <ul className="space-y-2 list-none text-[14px] font-normal leading-relaxed">
                <li className="text-right">1 . يجب إلصاق صورة حامل التصريح 6x4 (في حال عدم وجودها آلياً) ووضع ختم المنشأة عليها.</li>
                <li className="text-right">2 . تتعهد الشركة / المؤسسة بعدم السماح لحامل هذا التصريح بأداء فريضة الحج.</li>
                <li className="text-right">3 . يجب إبراز تصريح التنقل والهوية لدى النقاط الأمنية.</li>
              </ul>
           </div>
        </div>

        {/* 4. Print Metadata */}
        <div className="mt-8 mb-6 flex justify-end items-center text-[13px] font-normal text-black px-6 gap-2" dir="rtl">
           <span className="font-bold">تاريخ الطباعة:</span>
           <span>{new Date().toISOString().split('T')[0]}</span>
        </div>
      </div>
    </div>
  );
}
