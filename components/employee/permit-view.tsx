"use client";
 
 import { useRef } from "react";
 import { Almarai } from "next/font/google";
 import { QRCodeSVG } from "qrcode.react";
 import { Button } from "@/components/ui/button";
 import { Download, Printer } from "lucide-react";
 import html2canvas from "html2canvas";
 import jsPDF from "jspdf";
 
 const almarai = Almarai({ 
   weight: ['400', '700', '800'],
   subsets: ['arabic'],
   display: 'swap',
 });
 
 type PermitViewProps = {
   employee: any;
 };
 
 export default function PermitView({ employee }: PermitViewProps) {
   const permitRef = useRef<HTMLDivElement>(null);
 
   const downloadPDF = async () => {
     if (!permitRef.current) return;
     
     const canvas = await html2canvas(permitRef.current, {
       scale: 3, // High quality
       useCORS: true,
       logging: false,
     });
     
     const imgData = canvas.toDataURL("image/png");
     const pdf = new jsPDF({
       orientation: "portrait",
       unit: "mm",
       format: "a4",
     });
     
     const imgProps = pdf.getImageProperties(imgData);
     const pdfWidth = pdf.internal.pageSize.getWidth();
     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
     
     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
     pdf.save(`Permit_${employee.name.replace(/\s+/g, "_")}.pdf`);
   };
 
   const verificationUrl = typeof window !== 'undefined' 
     ? `${window.location.origin}/ar?e=${employee.verificationToken}` 
     : "";
 
   // Static Label column width for perfect alignment
   const labelWidth = "w-[200px]";
   const innerLabelWidth = "w-[160px]";
 
   return (
     <div className={`flex flex-col items-center gap-8 py-10 bg-slate-100 min-h-screen ${almarai.className}`}>
       {/* Action Buttons */}
       <div className="flex gap-4 no-print">
         <Button 
           onClick={() => window.print()} 
           variant="outline" 
           className="gap-2 border-[#1e3a5f] text-[#1e3a5f] bg-white text-[14px] font-normal"
         >
           <Printer className="w-4 h-4" /> Print
         </Button>
         <Button 
           onClick={downloadPDF} 
           className="gap-2 bg-[#1e3a5f] hover:bg-[#162a45] text-white shadow-lg text-[14px] font-normal"
         >
           <Download className="w-4 h-4" /> Download PDF
         </Button>
       </div>
 
       {/* Permit Container */}
       <div 
         ref={permitRef}
         dir="rtl"
         className="w-[800px] bg-white border-[1px] border-slate-400 shadow-2xl overflow-hidden relative print:w-full print:shadow-none print:border-none"
         style={{ color: "#000" }}
       >
         {/* Table 1: Integrated Header + Main Info */}
         <div className="border-[1.5px] border-black bg-white mx-4 mt-4 overflow-hidden">
            {/* Integrated Header Row */}
            <div className="flex justify-between items-stretch bg-white min-h-[220px] border-b-[1.5px] border-black text-black">
               <div className="w-[240px] p-6 flex flex-col items-center justify-center shrink-0">
                  <img src="/version-2023.png" alt="Vision 2030" className="w-full object-contain" />
               </div>
 
               <div className="flex-1 flex flex-col items-center justify-center p-4">
                  <div className="w-[180px] h-[180px] relative">
                     <img src="/ksa-logo.png" alt="Header Graphic" className="w-full h-full object-contain" />
                  </div>
               </div>
 
               <div className="w-[240px] p-6 flex items-center justify-center shrink-0">
                  <div className="w-36 h-48 bg-slate-50 border-[1.2px] border-black relative overflow-hidden flex items-center justify-center shadow-sm">
                     {employee.photo ? (
                        <img src={employee.photo} alt="Photo" className="w-full h-full object-cover" />
                     ) : (
                        <div className="text-[10px] text-slate-400 uppercase text-center p-2 font-normal">PHOTO</div>
                     )}
                  </div>
               </div>
            </div>
 
            {/* Main Data Rows */}
            <div className="flex border-b-[1.5px] border-black min-h-[52px] text-black text-[14px] font-normal">
               <div className={`${labelWidth} p-3 bg-white border-l-[1.5px] border-black text-center flex items-center justify-center`}>رقم التصريح</div>
               <div className="flex-1 p-3 text-center tracking-[0.1em] flex items-center justify-center">{employee.permitNumber || "447190104508947"}</div>
            </div>
 
            <div className="flex border-b-[1.5px] border-black min-h-[52px] text-black text-[14px] font-normal">
               <div className={`${labelWidth} p-3 bg-white border-l-[1.5px] border-black text-center flex items-center justify-center`}>اسم حامل التصريح</div>
               <div className="flex-1 p-3 text-center flex items-center justify-center uppercase">{employee.name}</div>
            </div>
 
            <div className="flex border-b-[1.5px] border-black min-h-[52px] text-black text-[14px] font-normal">
               <div className={`${labelWidth} p-3 bg-white border-l-[1.5px] border-black text-center flex items-center justify-center leading-tight`}>تاريخ اصدار التصريح</div>
               <div className="flex-1 p-3 text-center flex items-center justify-center border-l-[1.5px] border-black">
                  {employee.issueDate ? new Date(employee.issueDate).toISOString().split('T')[0].split('-').reverse().join('-') : '13-10-1447'}
               </div>
               <div className={`${innerLabelWidth} p-3 bg-white border-l-[1.5px] border-black text-center flex items-center justify-center leading-tight`}>تاريخ انتهاء التصريح</div>
               <div className="flex-1 p-3 text-center flex items-center justify-center">
                  {employee.expiryDate ? new Date(employee.expiryDate).toISOString().split('T')[0].split('-').reverse().join('-') : '15-12-1447'}
               </div>
            </div>
 
            <div className="flex border-b-[1.5px] border-black min-h-[52px] text-black text-[14px] font-normal">
               <div className={`${labelWidth} p-3 bg-white border-l-[1.5px] border-black text-center flex items-center justify-center`}>رقم الهوية</div>
               <div className="flex-1 p-3 text-center flex items-center justify-center">{employee.idNumber}</div>
            </div>
 
            <div className="flex border-b-[1.5px] border-black min-h-[52px] text-black text-[14px] font-normal">
               <div className={`${labelWidth} p-3 bg-white border-l-[1.5px] border-black text-center flex items-center justify-center`}>الجنسية</div>
               <div className="flex-1 p-3 text-center flex items-center justify-center">{employee.nationality}</div>
            </div>
 
            <div className="flex border-b-[1.5px] border-black min-h-[52px] text-black text-[14px] font-normal">
               <div className={`${labelWidth} p-3 bg-white border-l-[1.5px] border-black text-center flex items-center justify-center`}>الجنس</div>
               <div className="flex-1 p-3 text-center flex items-center justify-center">{employee.gender || "ذكر"}</div>
            </div>
 
            <div className="flex border-b-[1.5px] border-black min-h-[52px] text-black text-[14px] font-normal">
               <div className={`${labelWidth} p-3 bg-white border-l-[1.5px] border-black text-center flex items-center justify-center leading-tight`}>اسم الشركة/المؤسسة</div>
               <div className="flex-1 p-3 text-center flex items-center justify-center">{employee.company}</div>
            </div>
 
            <div className="flex min-h-[52px] text-black text-[14px] font-normal">
               <div className={`${labelWidth} p-3 bg-white border-l-[1.5px] border-black text-center flex items-center justify-center`}>جهة الموافقة</div>
               <div className="flex-1 p-3 text-center flex items-center justify-center">{employee.authority || "المديرية العامة للجوازات"}</div>
            </div>
         </div>
 
         {/* Table 2: Purpose */}
         <div className="border-[1.5px] border-black mt-6 bg-white mx-4 overflow-hidden text-black text-[14px] font-normal">
             <div className="flex border-b-[1.5px] border-black min-h-[52px]">
                 <div className={`${labelWidth} p-3 bg-white border-l-[1.5px] border-black text-center flex items-center justify-center`}>غرض التصريح</div>
                 <div className="flex-1 p-3 text-center flex items-center justify-center">{employee.purpose || "عمل دائم"}</div>
             </div>
             <div className="flex min-h-[70px]">
                 <div className={`${labelWidth} p-4 bg-white border-l-[1.5px] border-black text-center flex items-center justify-center leading-tight`}>وصف غرض التصريح</div>
                 <div className="flex-1 p-4 text-right leading-relaxed flex items-center justify-end">
                    {employee.description || "السلام عليكم نامل من سعادتكم اصدار تصاريح للعمال علما بانه مقر الشركة داخل مكة"}
                 </div>
             </div>
         </div>
 
         {/* Table 3: Footer Content (Mirrored from Screenshot) */}
         <div className="border-[1.5px] border-black mt-6 bg-white mx-4 p-6 flex justify-between items-center min-h-[140px] text-black text-[14px] font-normal">
            {/* Instructions: Right Side */}
            <div className="flex-1 text-right">
               <div className="mb-2 font-bold">التعليمات:</div>
               <ul className="space-y-1 list-none">
                 <li className="text-right">يجب إلصاق صورة حامل التصريح 4×6 (في حال عدم وجودها آلياً) ووضع ختم المنشأة عليها . 1</li>
                 <li className="text-right">تتعهد الشركة / المؤسسة بعدم السماح لحامل هذا التصريح بأداء فريضة الحج . 2</li>
                 <li className="text-right">يجب إبراز تصريح التنقل والهوية لدى النقاط الأمنية . 3</li>
               </ul>
            </div>

            {/* QR Code: Left Side */}
            <div className="bg-white p-2 shrink-0">
               <QRCodeSVG value={verificationUrl} size={110} level="H" />
            </div>
         </div>
 
         {/* Dynamic Meta Info: Right Aligned */}
         <div className="mt-4 pb-10 flex justify-start text-[12px] font-normal text-black px-4 gap-2">
            <span>تاريخ الطباعة:</span>
            <span>{new Date().toISOString().split('T')[0]}</span>
         </div>
       </div>
  
       <style jsx global>{`
         @page {
           size: A4 portrait;
           margin: 10mm;
         }
         @media print {
           .no-print { display: none !important; }
           body { 
             background: white !important; 
             padding: 0 !important; 
             margin: 0 !important;
           }
           .min-h-screen { min-height: 0 !important; height: auto !important; }
           .bg-slate-100 { background: white !important; }
           shadow-2xl { box-shadow: none !important; }
           .flex-col { display: block !important; }
           .w-[800px] { 
             width: 100% !important; 
             border: none !important;
             margin: 0 !important;
           }
         }
       `}</style>
     </div>
   );
 }
