"use client";

import { QRCodeSVG } from "qrcode.react";

type PermitTableBaseProps = {
  employee: any;
  verificationUrl: string;
  isPdf: boolean;
  styles: {
    containerPadding: string;
    labelClass: string;
    valueClass: string;
    boldValueClass: string;
    headerPadding: React.CSSProperties;
    spacerHeight: {
      s1: string;
      s2: string;
      s3: string;
    };
  };
};

export default function PermitTableBase({ employee, verificationUrl, isPdf, styles }: PermitTableBaseProps) {
  return (
    <div className={`w-full bg-white font-ajeer ${styles.containerPadding}`}>
      {/* 1. Main Table Wrapper */}
      <div className="border-[1px] border-black bg-white mx-4 mt-4 overflow-hidden">
         {/* Header Grid Row */}
         <div 
           className="flex justify-between items-stretch bg-white min-h-[220px] border-b-[1px] border-black text-black"
           style={styles.headerPadding}
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
               <div className="w-36 h-48 bg-[#e6e6e6] border-[1px] border-gray-300 p-[1px] border-black relative overflow-hidden flex items-center justify-center">
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
         <div className="flex border-b-[1px] border-black min-h-[60px] text-black">
            <div className={styles.labelClass}>رقم التصريح</div>
            <div className={styles.valueClass} style={{ letterSpacing: '0.1em' }}>{employee.permitNumber || "208"}</div>
         </div>

         <div className="flex border-b-[1px] border-black min-h-[50px] text-black">
            <div className={styles.labelClass}>اسم حامل التصريح</div>
            <div className={styles.boldValueClass}>{employee.name}</div>
         </div>

         <div className="flex border-b-[1px] border-black min-h-[50px] text-black">
            <div className={styles.labelClass}>تاريخ اصدار التصريح</div>
            <div className={`${styles.valueClass} w-[28%] border-l-[1px] border-black`}>
               {employee.issueDate ? new Date(employee.issueDate).toLocaleDateString('en-GB').replace(/\//g, '-') : '20-09-2025'}
            </div>
            <div className={styles.labelClass}>تاريخ انتهاء التصريح</div>
            <div className={styles.valueClass}>
               {employee.expiryDate ? new Date(employee.expiryDate).toLocaleDateString('en-GB').replace(/\//g, '-') : '27-06-2026'}
            </div>
         </div>

         <div className="flex border-b-[1px] border-black min-h-[50px] text-black">
            <div className={styles.labelClass}>رقم الهوية</div>
            <div className={styles.valueClass}>{employee.idNumber || "277"}</div>
         </div>

         <div className="flex border-b-[1px] border-black min-h-[50px] text-black">
            <div className={styles.labelClass}>الجنسية</div>
            <div className={styles.valueClass}>{employee.nationality || "Saudi"}</div>
         </div>

         <div className="flex border-b-[1px] border-black min-h-[50px] text-black">
            <div className={styles.labelClass}>الجنس</div>
            <div className={styles.valueClass}>{employee.gender || "ذكر"}</div>
         </div>

         <div className="flex border-b-[1px] border-black min-h-[50px] text-black">
            <div className={styles.labelClass}>اسم الشركة/المؤسسة</div>
            <div className={styles.valueClass + " uppercase"}>{employee.company || "Company Name"}</div>
         </div>

         <div className="flex min-h-[50px] text-black">
            <div className={styles.labelClass}>جهة الموافقة</div>
            <div className={styles.valueClass}>{employee.authority || "المديرية العامة للجوازات"}</div>
         </div>
      </div>

      <div className={styles.spacerHeight.s1} />

       {/* 2. Purpose Table */}
       <div className="border-[1px] border-black bg-white mx-4 overflow-hidden text-black">
         <div className="flex border-b-[1px] border-black min-h-[50px]">
             <div className={styles.labelClass}>غرض التصريح</div>
             <div className={styles.valueClass}>{employee.purpose || "عمل دائم"}</div>
         </div>
         <div className="flex min-h-[80px]">
             <div className={styles.labelClass + " leading-tight"}>وصف غرض التصريح</div>
             <div className="flex-1 p-4 text-right leading-relaxed flex items-center justify-center text-[14px] font-normal">
                {employee.description || "السلام عليكم نامل من سعادتكم اصدار تصاريح للعمال علما بانه مقر الشركة داخل مكة"}
             </div>
         </div>
      </div>

      <div className={styles.spacerHeight.s2} />

       {/* 3. Instructions & QR Section */}
       <div 
         className={`border-[1px] border-black bg-white mx-4 flex justify-between items-start text-black`}
         style={{ padding: '15px 25px', minHeight: '150px'}}
       >
         <div className="flex-1 text-right">
            <div className={`mb-3 text-[18px] font-bold`}>التعليمات:</div>
            <ul className="space-y-2 list-none text-[17px] font-normal leading-relaxed">
              <li className="text-right">1. يجب إلصاق صورة حامل التصريح 6x4 (في حال عدم وجودها آلياً) ووضع ختم المنشأة عليها.</li>
              <li className="text-right">2. تتعهد الشركة / المؤسسة بعدم السماح لحامل هذا التصريح بأداء فريضة الحج.</li>
              <li className="text-right">3. يجب إبراز تصريح التنقل والهوية لدى النقاط الأمنية.</li>
            </ul>
         </div>
         <div className="bg-white shrink-0">
            {verificationUrl && (
              <QRCodeSVG 
                 value={verificationUrl} 
                 size={130} 
                 level="L" 
                 includeMargin={false}
              />
            )}
         </div>
      </div>

       {/* 4. Print Metadata */}
       <div className={`mt-4 mb-4 pb-4 flex justify-start items-center text-[14px] font-normal text-black px-4 gap-2`} dir="rtl">
          <span className="font-bold">تاريخ الطباعة:</span>
          <span>{new Date().toISOString().split('T')[0]}</span>
       </div>
      <div className={styles.spacerHeight.s3} />
    </div>
  );
}
