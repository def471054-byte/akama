"use client";

import PermitTableBase from "./permit-table-base";

type PermitTemplateProps = {
  employee: any;
  verificationUrl: string;
};

export default function PermitTableExport({ employee, verificationUrl }: PermitTemplateProps) {
  // Styles optimized for PDF capture via html2canvas
  // Arabic text often reports its bounding box higher than its visual baseline.
  // We use pt-[12px] and pb-[10px] (offset by 2px) to visually center the text 
  // and leading-none to prevent the browser from adding extra space that might vary by viewport.
  const styles = {
    containerPadding: "pb-20", // Bottom padding to ensure last elements are captured
    labelClass: "w-[22%] shrink-0 pt-[12px] pb-[10px] bg-white border-l-[1px] border-black text-center flex items-center justify-center text-[14px] font-normal leading-none",
    valueClass: "flex-1 pt-[12px] pb-[10px] text-center flex items-center justify-center text-[14px] font-normal leading-none",
    boldValueClass: "flex-1 pt-[12px] pb-[10px] text-center flex items-center justify-center text-[14px] font-normal uppercase leading-none",
    headerPadding: { paddingLeft: '20px', paddingRight: '20px' },
    spacerHeight: {
      s1: "h-[30px]",
      s2: "h-[25px]",
      s3: "h-[20px]"
    }
  };

  return (
    <PermitTableBase 
      employee={employee} 
      verificationUrl={verificationUrl} 
      isPdf={true} 
      styles={styles} 
    />
  );
}
