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
  const labelClass = `${labelWidth} p-3 bg-white border-l-[1px] border-black text-center flex items-center justify-center text-[14px] ${isPdf ? 'font-normal' : 'font-bold'}`;
  const valueClass = `flex-1 p-3 text-center flex items-center justify-center ${isPdf ? 'text-[14px] font-normal' : 'text-[16px] font-normal'}`;
  const boldValueClass = `flex-1 p-3 text-center flex items-center justify-center uppercase ${isPdf ? 'text-[14px] font-normal' : 'text-[15px] font-bold'}`;

  return (
    <div className="w-full bg-white font-ajeer p-6">
      {/* Outer Card Wrapper */}
      <div className={`border-[1px] border-gray-300 rounded-[24px] shadow-sm bg-white overflow-hidden ${isPdf ? 'pb-10' : 'pb-6'}`}>
        
        {/* 1. Main Table Wrapper */}
        <div className="border-[1px] border-gray-900 bg-white mx-5 mt-5 overflow-hidden rounded-xl">
         {/* Header Grid Row */}
         <div 
           className="flex justify-between items-stretch bg-white min-h-[220px] border-b-[1px] border-black text-black"
           style={isPdf ? { paddingLeft: '20px', paddingRight: '20px' } : { paddingLeft: '16px', paddingRight: '16px' }}
         >
            <div className="w-[30%] py-4 flex flex-col items-start justify-center shrink-0">
               <div className="h-48 w-auto relative">
                  <img src="/version-2023.png" alt="Vision 2030" className="h-full w-auto object-contain" />
               </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center ">
               <div className="h-56 w-auto relative">
                  <img src="/ksa-logo.png" alt="Crest" className="h-full w-auto object-contain" />
               </div>
            </div>

            <div className="w-[30%] py-4 flex flex-col items-end justify-center shrink-0">
               <div className="w-36 h-48 bg-[#e6e6e6] border-[1px] p-[1px] border-black relative overflow-hidden flex items-center justify-center">
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
         <div className="flex border-b-[1.5px] border-black min-h-[50px] text-black">
            <div className={labelClass}>رقم التصريح</div>
            <div className={`flex-1 p-3 text-center tracking-[0.1em] flex items-center justify-center font-normal ${isPdf ? 'text-[14px]' : 'text-[16px]'}`}>{employee.permitNumber || "208"}</div>
         </div>

         <div className="flex border-b-[1.5px] border-black min-h-[50px] text-black">
            <div className={labelClass}>اسم حامل التصريح</div>
            <div className={boldValueClass}>{employee.name}</div>
         </div>

         <div className="flex border-b-[1px] border-black min-h-[50px] text-black">
            <div className={labelClass}>تاريخ اصدار التصريح</div>
            <div className={`w-[28%] p-3 text-center flex items-center justify-center border-l-[1px] border-black font-normal ${isPdf ? 'text-[14px]' : 'text-[13px]'}`}>
               {employee.issueDate ? new Date(employee.issueDate).toLocaleDateString('en-GB').replace(/\//g, '-') : '20-09-2025'}
            </div>
            <div className={labelClass}>تاريخ انتهاء التصريح</div>
            <div className={`flex-1 p-3 text-center flex items-center justify-center font-normal ${isPdf ? 'text-[14px]' : 'text-[13px]'}`}>
               {employee.expiryDate ? new Date(employee.expiryDate).toLocaleDateString('en-GB').replace(/\//g, '-') : '27-06-2026'}
            </div>
         </div>

         <div className="flex border-b-[1.5px] border-black min-h-[50px] text-black text-[14px]">
            <div className={labelClass}>رقم الهوية</div>
            <div className="flex-1 p-3 text-center flex items-center justify-center font-normal">{employee.idNumber || "277"}</div>
         </div>

         <div className="flex border-b-[1.5px] border-black min-h-[50px] text-black text-[14px]">
            <div className={labelClass}>الجنسية</div>
            <div className="flex-1 p-3 text-center flex items-center justify-center font-normal">{employee.nationality || "Saudi"}</div>
         </div>

         <div className="flex border-b-[1.5px] border-black min-h-[50px] text-black text-[14px]">
            <div className={labelClass}>الجنس</div>
            <div className="flex-1 p-3 text-center flex items-center justify-center font-normal">{employee.gender || "ذكر"}</div>
         </div>

         <div className="flex border-b-[1.5px] border-black min-h-[50px] text-black text-[14px]">
            <div className={labelClass}>اسم الشركة/المؤسسة</div>
            <div className="flex-1 p-3 text-center flex items-center justify-center uppercase font-normal">{employee.company || "Company Name"}</div>
         </div>

         <div className="flex min-h-[50px] text-black text-[14px]">
            <div className={labelClass}>جهة الموافقة</div>
            <div className="flex-1 p-3 text-center flex items-center justify-center font-normal">{employee.authority || "المديرية العامة للجوازات"}</div>
         </div>
      </div>

       {/* 2. Purpose Table */}
       <div className="border-[1px] border-gray-900 bg-white mx-5 mt-6 overflow-hidden text-black text-[14px] rounded-xl">
         <div className="flex border-b-[1px] border-black min-h-[50px]">
             <div className={labelClass}>غرض التصريح</div>
             <div className="flex-1 p-3 text-center flex items-center justify-center text-[14px] font-normal">{employee.purpose || "عمل دائم"}</div>
         </div>
         <div className="flex min-h-[70px]">
             <div className={`${labelWidth} p-4 bg-white border-l-[1px] border-black text-center flex items-center justify-center leading-tight text-[14px] ${isPdf ? 'font-normal' : 'font-bold'}`}>وصف غرض التصريح</div>
             <div className="flex-1 p-4 text-right leading-relaxed flex items-center justify-center text-[14px] font-normal">
                {employee.description || "السلام عليكم نامل من سعادتكم اصدار تصاريح للعمال علما بانه مقر الشركة داخل مكة"}
             </div>
         </div>
      </div>

       {/* 3. Instructions & QR Section */}
       <div 
         className={`border-[1px] border-gray-900 bg-white mx-5 mt-6 flex justify-between items-center text-black rounded-xl`}
         style={isPdf ? { padding: '15px', minHeight: '180px' } : { padding: '24px', minHeight: '160px' }}
       >
         <div className="flex-1 text-right">
            <div className={`mb-3 ${isPdf ? 'text-[14px] font-normal' : 'text-[18px] font-bold'}`}>التعليمات:</div>
            <ul className="space-y-2 list-none text-[14px] font-normal leading-relaxed">
              <li className="text-right">1. يجب إلصاق صورة حامل التصريح 6x4 (في حال عدم وجودها آلياً) ووضع ختم المنشأة عليها.</li>
              <li className="text-right">2. تتعهد الشركة / المؤسسة بعدم السماح لحامل هذا التصريح بأداء فريضة الحج.</li>
              <li className="text-right">3. يجب إبراز تصريح التنقل والهوية لدى النقاط الأمنية.</li>
            </ul>
         </div>
         <div 
           className="bg-white shrink-0"
           style={{ marginLeft: isPdf ? '0px' : '0px' }}
         >
            {verificationUrl && (
              <QRCodeSVG 
                 value={verificationUrl} 
                 size={180} 
                 level="L" 
                 includeMargin={false}
              />
            )}
         </div>
      </div>

       {/* 4. Print Metadata */}
       <div className={`mt-6 flex justify-end items-center text-[12px] font-normal text-gray-600 px-6 gap-2`}>
          <span>{new Date().toISOString().split('T')[0]}</span>
          <span className="font-bold">:تاريخ الطباعة</span>
       </div>
      </div>
    </div>
  );
}
