"use client";

import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PermitTemplate from "./permit-template";
import { Button } from "@/components/ui/button";

export default function PermitView({ employee }: any) {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const downloadPDF = async () => {
    if (!pdfRef.current) return;

    // Small delay to ensure any dynamic content is settled
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(pdfRef.current, {
      scale: 3,
      useCORS: true,
      logging: false, // Set to true if debugging is needed
      scrollX: 0,
      scrollY: -window.scrollY, // Critical fix for white-page issues when scrolled
      onclone: (clonedDoc) => {
        // Fix for Tailwind 4 / modern CSS color functions that html2canvas cannot parse
        const elements = clonedDoc.getElementsByTagName('*');
        for (let i = 0; i < elements.length; i++) {
           const el = elements[i] as HTMLElement;
           const style = clonedDoc.defaultView?.getComputedStyle(el);
           if (style) {
              if (style.color.includes('lab') || style.color.includes('oklch')) {
                 el.style.color = '#000000';
              }
              if (style.backgroundColor.includes('lab') || style.backgroundColor.includes('oklch')) {
                 el.style.backgroundColor = el.classList.contains('bg-white') ? '#ffffff' : '#f3f4f6';
              }
              if (style.borderColor.includes('lab') || style.borderColor.includes('oklch')) {
                 el.style.borderColor = '#000000';
              }
           }
        }
      }
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const marginX = 6.35;
    const marginTop = 25.4;

    const pdfWidth = pageWidth - marginX * 2;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    const x = (pageWidth - pdfWidth) / 2;

    pdf.addImage(imgData, "PNG", x, marginTop, pdfWidth, pdfHeight);
    pdf.save(`${employee.idNumber || "permit"}.pdf`);
  };

  const verificationUrl = mounted
    // ? `https://hch.re/?e=${employee.verificationToken}`
    ? `${window.location.origin}/?e=${employee.verificationToken}`
    : "";

  return (
    <div className="flex flex-col items-center gap-6 py-10 bg-gray-100 min-h-screen">

      <Button onClick={downloadPDF} className="bg-[#1e3a5f] hover:bg-[#162a45] text-white px-6 py-2 rounded-md shadow-lg transition-all active:scale-95">
        Download PDF
      </Button>

      {/* Preview */}
      <div dir="rtl" className="w-[794px] bg-white shadow-xl">
        <PermitTemplate employee={employee} verificationUrl={verificationUrl} />
      </div>

      {/* Hidden PDF View - Fixed position behind the scenes to ensure it's in the render tree but invisible. */}
      <div
        ref={pdfRef}
        dir="rtl"
        className="fixed top-0 left-0 w-[794px] -z-50 pointer-events-none bg-white opacity-100"
        style={{ left: '-2000px' }} // Positioned far left to ensure it doesn't overlap even at z-index
      >
        <PermitTemplate employee={employee} verificationUrl={verificationUrl} isPdf />
      </div>

    </div>
  );
}