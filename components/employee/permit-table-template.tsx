"use client";

import { QRCodeSVG } from "qrcode.react";

type PermitTemplateProps = {
  employee: any;
  verificationUrl: string;
  isPdf?: boolean;
};

import PermitTableBase from "./permit-table-base";

export default function PermitTableTemplate({ employee, verificationUrl }: PermitTemplateProps) {
  const styles = {
    containerPadding: "p-6",
    labelClass: "w-[22%] shrink-0 p-3 bg-white border-l-[1px] border-black text-center flex items-center justify-center text-[14px] font-bold leading-relaxed",
    valueClass: "flex-1 p-3 text-center flex items-center justify-center text-[16px] font-normal leading-relaxed",
    boldValueClass: "flex-1 p-3 text-center flex items-center justify-center text-[15px] font-bold uppercase leading-relaxed",
    headerPadding: { paddingLeft: '16px', paddingRight: '16px' },
    spacerHeight: {
      s1: "h-8",
      s2: "h-4",
      s3: "h-4"
    }
  };

  return (
    <PermitTableBase 
      employee={employee} 
      verificationUrl={verificationUrl} 
      isPdf={false} 
      styles={styles} 
    />
  );
}
