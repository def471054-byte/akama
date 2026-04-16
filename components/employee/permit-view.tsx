"use client";
 
 import { useRef, useState, useEffect } from "react";
 import { Button } from "@/components/ui/button";
 import { Download } from "lucide-react";
 import html2canvas from "html2canvas";
 import jsPDF from "jspdf";
 import PermitTemplate from "./permit-template";
 import PermitTableExport from "./permit-table-export";
 
 
 
 type PermitViewProps = {
   employee: any;
 };
 
 export default function PermitView({ employee }: PermitViewProps) {
   const pdfCaptureRef = useRef<HTMLDivElement>(null);
   const [mounted, setMounted] = useState(false);
 
   useEffect(() => {
     setMounted(true);
   }, []);
 
   const downloadPDF = async () => {
     if (!pdfCaptureRef.current) return;
     
     // Width for content: A4 (210mm) - 2 * 0.25in (12.7mm) = 197.3mm
     const HORIZONTAL_MARGIN_MM = 6.35; // 0.25 inch
     const VERTICAL_MARGIN_MM = 25.4;   // 1 inch
     
     const canvas = await html2canvas(pdfCaptureRef.current, {
       scale: 3, // High quality capture
       useCORS: true,
       logging: false,
       onclone: (clonedDoc) => {
         const elements = clonedDoc.getElementsByTagName('*');
         for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            const style = clonedDoc.defaultView?.getComputedStyle(el);
            if (style && (style.color.includes('lab') || style.backgroundColor.includes('lab'))) {
               el.style.color = '#000000';
               if (style.backgroundColor.includes('lab')) el.style.backgroundColor = '#ffffff';
            }
         }
       }
     });
     
     const imgData = canvas.toDataURL("image/png");
     const pdf = new jsPDF({
       orientation: "portrait",
       unit: "mm",
       format: "a4",
     });
     
     const imgProps = pdf.getImageProperties(imgData);
     const pdfPageWidth = pdf.internal.pageSize.getWidth();
     
     // Calculate content dimension with margins
     const contentWidth = pdfPageWidth - (HORIZONTAL_MARGIN_MM * 2);
     const contentHeight = (imgProps.height * contentWidth) / imgProps.width;
     
     pdf.addImage(
       imgData, 
       "PNG", 
       HORIZONTAL_MARGIN_MM, 
       VERTICAL_MARGIN_MM, 
       contentWidth, 
       contentHeight
     );
     
     pdf.save(`${employee.idNumber || "Permit"}.pdf`);
   };
 
   const verificationUrl = mounted 
     ? `${window.location.origin}/?e=${employee.verificationToken}` 
     : "";
 
   return (
     <div className={`flex flex-col items-center gap-8 py-10 bg-[#f1f5f9] min-h-screen font-ajeer print-page-root`}>
       {/* 1. Action Buttons: Not Visible during Print */}
       <div className="flex gap-4 no-print">
         <Button 
           onClick={downloadPDF} 
           className="gap-2 bg-[#1e3a5f] hover:bg-[#162a45] text-white shadow-lg text-[14px] font-normal"
         >
           <Download className="w-4 h-4" /> Download PDF
         </Button>
       </div>
 
       {/* 2. Compact View: Visible on screen (Mimics A4 Proportion) */}
       <div 
         dir="rtl"
         className="w-[850px] aspect-[1/1.414] bg-[#f1f5f9] p-8 shadow-none"
       >
          <PermitTemplate employee={employee} verificationUrl={verificationUrl} />
       </div>
 
       {/* 3. Ghost View: Specifically for PDF Export */}
       <div 
         ref={pdfCaptureRef}
         dir="rtl"
         className="absolute left-[-9999px] top-0 w-[850px] bg-white p-0"
         style={{ color: "#000" }}
       >
          <PermitTableExport employee={employee} verificationUrl={verificationUrl} />
       </div>
 
       {/* 4. Global Print Styles */}
       <style jsx global>{`
         @page {
           size: A4 portrait;
           margin: 0.5in;
         }
         @media print {
           body > *:not(.print-page-root) { display: none !important; }
           .print-page-root {
             position: absolute !important;
             left: 0 !important;
             top: 0 !important;
             width: 210mm !important;
             background: white !important;
             padding: 0 !important;
             margin: 0 !important;
           }
           .no-print { display: none !important; }
           * { 
             -webkit-print-color-adjust: exact !important; 
             color-adjust: exact !important; 
           }
         }
       `}</style>
     </div>
   );
 }
