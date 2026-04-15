"use client";

import { QRCodeSVG } from "qrcode.react";

type PermitTemplateProps = {
  employee: any;
  verificationUrl: string;
  isPdf?: boolean;
};

export default function PermitTableTemplate({ employee, verificationUrl, isPdf = false }: PermitTemplateProps) {
  const labelWidth = "22%";
  const valueWidth = "78%";
  
  // Custom styles for table cells to match the original design exactly
  const cellStyle = {
    border: '1px solid black',
    padding: isPdf ? '12px 10px' : '15px 12px',
    verticalAlign: 'middle',
    textAlign: 'center' as const,
  };

  const labelCellStyle = {
    ...cellStyle,
    width: labelWidth,
    backgroundColor: 'white',
    fontWeight: isPdf ? '400' : '700',
    fontSize: '14px',
    lineHeight: '1',
  };

  const valueCellStyle = {
    ...cellStyle,
    width: valueWidth,
    fontWeight: '400',
    fontSize: isPdf ? '14px' : '16px',
    lineHeight: '1',
  };

  return (
    <div className={`w-full bg-white font-ajeer ${isPdf ? 'pb-20' : 'p-6'}`}>
      {/* 1. Main Data Table */}
      <table className="w-full border-collapse border-black mx-4 mt-4 overflow-hidden" style={{ tableLayout: 'fixed', border: '1px solid black' }}>
        <tbody>
          {/* Header row with Logos and Photo */}
          <tr style={{ minHeight: '220px' }}>
            <td style={{ ...cellStyle, width: '30%', padding: '20px' }} className="align-middle">
               <img src="/version-2023.png" alt="Vision 2030" className="h-48 w-auto object-contain mx-auto" />
            </td>
            <td style={{ ...cellStyle, padding: '20px' }} className="align-middle">
               <img src="/ksa-logo.png" alt="Crest" className="h-56 w-auto object-contain mx-auto" />
            </td>
            <td style={{ ...cellStyle, width: '30%', padding: '20px' }} className="align-middle">
               <div className="w-36 h-48 bg-[#e6e6e6] border-[1px] border-gray-300 p-[1px] border-black relative overflow-hidden flex items-center justify-center mx-auto">
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
            </td>
          </tr>

          {/* Permit Number Row */}
          <tr>
            <td dir="rtl" style={labelCellStyle}>رقم التصريح</td>
            <td colSpan={2} style={{ ...valueCellStyle, letterSpacing: '0.1em' }}>{employee.permitNumber || "208"}</td>
          </tr>

          {/* Name Row */}
          <tr>
            <td dir="rtl" style={labelCellStyle}>اسم حامل التصريح</td>
            <td colSpan={2} style={{ ...valueCellStyle, fontWeight: isPdf ? '400' : '700', textTransform: 'uppercase' }}>{employee.name}</td>
          </tr>

          {/* Dates Row (Special 4-column layout) */}
          <tr>
            <td dir="rtl" style={labelCellStyle}>تاريخ اصدار التصريح</td>
            <td style={{ ...cellStyle, width: '28%', fontSize: isPdf ? '14px' : '13px' }}>
               {employee.issueDate ? new Date(employee.issueDate).toLocaleDateString('en-GB').replace(/\//g, '-') : '20-09-2025'}
            </td>
            <td dir="rtl" style={{ ...cellStyle, width: '50%', padding: '0' }} colSpan={1}>
              <table className="w-full h-full border-collapse" style={{ tableLayout: 'fixed' }}>
                <tbody>
                  <tr>
                    <td dir="rtl" style={{ ...labelCellStyle, width: '44%', border: 'none', borderLeft: '1px solid black' }}>تاريخ انتهاء التصريح</td>
                    <td style={{ ...valueCellStyle, width: '56%', border: 'none', fontSize: isPdf ? '14px' : '13px' }}>
                      {employee.expiryDate ? new Date(employee.expiryDate).toLocaleDateString('en-GB').replace(/\//g, '-') : '27-06-2026'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* ID Number Row */}
          <tr>
            <td dir="rtl" style={labelCellStyle}>رقم الهوية</td>
            <td colSpan={2} style={valueCellStyle}>{employee.idNumber || "277"}</td>
          </tr>

          {/* Nationality Row */}
          <tr>
            <td dir="rtl" style={labelCellStyle}>الجنسية</td>
            <td colSpan={2} style={valueCellStyle}>{employee.nationality || "Saudi"}</td>
          </tr>

          {/* Gender Row */}
          <tr>
            <td dir="rtl" style={labelCellStyle}>الجنس</td>
            <td colSpan={2} style={valueCellStyle}>{employee.gender || "ذكر"}</td>
          </tr>

          {/* Company Row */}
          <tr>
            <td dir="rtl" style={labelCellStyle}>اسم الشركة/المؤسسة</td>
            <td colSpan={2} style={{ ...valueCellStyle, textTransform: 'uppercase' }}>{employee.company || "Company Name"}</td>
          </tr>

          {/* Authority Row */}
          <tr>
            <td dir="rtl" style={labelCellStyle}>جهة الموافقة</td>
            <td colSpan={2} style={valueCellStyle}>{employee.authority || "المديرية العامة للجوازات"}</td>
          </tr>
        </tbody>
      </table>

      <div className={isPdf ? "h-[30px]" : "h-8"} />

      {/* 2. Purpose Table */}
      <table className="w-full border-collapse border-black mx-4 overflow-hidden" style={{ tableLayout: 'fixed', border: '1px solid black' }}>
        <tbody>
          <tr>
            <td dir="rtl" style={labelCellStyle}>غرض التصريح</td>
            <td style={valueCellStyle}>{employee.purpose || "عمل دائم"}</td>
          </tr>
          <tr>
            <td dir="rtl" style={{ ...labelCellStyle, height: '80px', lineHeight: '1.2' }}>وصف غرض التصريح</td>
            <td dir="rtl" style={{ ...valueCellStyle, height: '80px', lineHeight: '1.2', textAlign: 'right', padding: '16px' }}>
               {employee.description || "السلام عليكم نامل من سعادتكم اصدار تصاريح للعمال علما بانه مقر الشركة داخل مكة"}
            </td>
          </tr>
        </tbody>
      </table>

      <div className={isPdf ? "h-[25px]" : "h-4"} />

      {/* 3. Instructions & QR Section */}
      <table className="w-full border-collapse border-black mx-4 overflow-hidden" style={{ tableLayout: 'fixed', border: '1px solid black' }}>
        <tbody>
          <tr style={{ minHeight: '150px' }}>
            <td className="p-[15px_25px] align-top text-right" style={{ border: 'none' }}>
               <div className="mb-3 text-[18px] font-bold">التعليمات:</div>
               <ul className="space-y-2 list-none text-[17px] font-normal leading-relaxed text-black">
                  <li>1. يجب إلصاق صورة حامل التصريح 6x4 (في حال عدم وجودها آلياً) ووضع ختم المنشأة عليها.</li>
                  <li>2. تتعهد الشركة / المؤسسة بعدم السماح لحامل هذا التصريح بأداء فريضة الحج.</li>
                  <li>3. يجب إبراز تصريح التنقل والهوية لدى النقاط الأمنية.</li>
               </ul>
            </td>
            <td className="p-[15px_25px] align-top text-center w-[180px]" style={{ border: 'none' }}>
               <div className="bg-white inline-block">
                  {verificationUrl && (
                    <QRCodeSVG 
                       value={verificationUrl} 
                       size={130} 
                       level="L" 
                       includeMargin={false}
                    />
                  )}
               </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* 4. Print Metadata */}
      <div className="mt-4 mb-4 pb-4 flex justify-start items-center text-[14px] font-normal text-black px-4 gap-2" dir="rtl">
          <span className="font-bold">تاريخ الطباعة:</span>
          <span>{new Date().toISOString().split('T')[0]}</span>
      </div>
      <div className={isPdf ? "h-[20px]" : "h-4"} />
    </div>
  );
}
