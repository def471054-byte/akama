"use client";
 
 import { useRef, useState, useEffect } from "react";
 import { Button } from "@/components/ui/button";
 import { Download } from "lucide-react";
 import html2canvas from "html2canvas";
 import jsPDF from "jspdf";
 import PermitTemplate from "./permit-template";
 
 
 
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
     
     const canvas = await html2canvas(pdfCaptureRef.current, {
       scale: 3, // High quality
       useCORS: true,
       logging: false,
       onclone: (clonedDoc) => {
         // Fix for Tailwind 4 / modern CSS color functions that html2canvas cannot parse
         const elements = clonedDoc.getElementsByTagName('*');
         for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            const style = clonedDoc.defaultView?.getComputedStyle(el);
            if (style && (style.color.includes('lab') || style.backgroundColor.includes('lab') || style.borderColor.includes('lab'))) {
               // Fallback to basic colors if lab() is detected
               el.style.color = '#000000';
               if (style.backgroundColor.includes('lab')) el.style.backgroundColor = '#ffffff';
               if (style.borderColor.includes('lab')) el.style.borderColor = '#000000';
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
     const margin = 5; // Reduced margin to fill more of the page
     const pdfWidth = pdf.internal.pageSize.getWidth() - (margin * 2);
     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
     
     pdf.addImage(imgData, "PNG", margin, margin, pdfWidth, pdfHeight);
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
 
       {/* 2. Compact View: Visible on screen */}
       <div 
         dir="rtl"
         className="w-[850px] bg-[#f1f5f9] p-8 shadow-none"
       >
          <PermitTemplate employee={employee} verificationUrl={verificationUrl} isPdf={false} />
       </div>
 
       {/* 3. Ghost View: Specifically for PDF Export (Width reduced to force larger relative scale on PDF) */}
       <div 
         ref={pdfCaptureRef}
         dir="rtl"
         className="absolute left-[-9999px] top-0 w-[850px] bg-white p-0"
         style={{ color: "#000" }}
       >
          <PermitTemplate employee={employee} verificationUrl={verificationUrl} isPdf={true} />
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
