"use client";

import { QRCodeSVG } from "qrcode.react";

type PermitTemplateProps = {
  employee: any;
  verificationUrl: string;
  isPdf?: boolean;
};

export default function PermitTemplate({ employee, verificationUrl, isPdf = false }: PermitTemplateProps) {
  const labelWidth = "w-[22%] shrink-0";

  const labelClass = `${labelWidth} ${
    isPdf ? "py-[14px] leading-[1.8]" : "leading-none items-center"
  } bg-white border-l border-black text-center flex justify-center text-[14px] ${
    isPdf ? "font-normal" : "font-bold"
  }`;

  const valueClass = `flex-1 ${
    isPdf ? "py-[14px] leading-[1.8]" : "items-center leading-none"
  } text-center flex justify-center ${
    isPdf ? "text-[14px]" : "text-[16px]"
  }`;

  const boldValueClass = `flex-1 ${
    isPdf ? "py-[14px] leading-[1.8]" : "items-center leading-none"
  } text-center flex justify-center uppercase ${
    isPdf ? "text-[14px]" : "text-[15px] font-bold"
  }`;

  return (
    <div className={`bg-white font-ajeer ${isPdf ? "w-[794px] mx-auto" : "w-full p-6 pb-20"}`}>

      {/* A4 inner margin */}
      <div className={isPdf ? "px-[24px] pt-[96px] pb-[96px]" : ""}>

        {/* MAIN TABLE */}
        <div className="border border-black mt-4 overflow-hidden w-full">

          {/* HEADER */}
          <div className="flex justify-between min-h-[220px] border-b border-black px-4">
            <div className="w-[30%] flex items-center">
              <img src="/version-2023.png" className="h-40 object-contain" />
            </div>

            <div className="flex-1 flex justify-center items-center">
              <img src="/ksa-logo.png" className="h-44 object-contain" />
            </div>

            <div className="w-[30%] flex justify-end items-center">
              <div className="w-36 h-48 border border-black overflow-hidden">
                {employee.photo ? (
                  <img src={employee.photo} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-xs text-gray-400 text-center">PHOTO</div>
                )}
              </div>
            </div>
          </div>

          {/* ROWS */}
          <div className="flex border-b border-black min-h-[50px]">
            <div className={labelClass}>رقم التصريح</div>
            <div className={valueClass}>{employee.permitNumber}</div>
          </div>

          <div className="flex border-b border-black min-h-[50px]">
            <div className={labelClass}>اسم حامل التصريح</div>
            <div className={boldValueClass}>{employee.name}</div>
          </div>

          <div className="flex border-b border-black min-h-[50px]">
            <div className={labelClass}>تاريخ اصدار التصريح</div>
            <div className={`w-[28%] border-l border-black ${valueClass}`}>
              {employee.issueDate}
            </div>
            <div className={labelClass}>تاريخ انتهاء التصريح</div>
            <div className={valueClass}>{employee.expiryDate}</div>
          </div>

          <div className="flex border-b border-black min-h-[50px]">
            <div className={labelClass}>رقم الهوية</div>
            <div className={valueClass}>{employee.idNumber}</div>
          </div>

          <div className="flex border-b border-black min-h-[50px]">
            <div className={labelClass}>الجنسية</div>
            <div className={valueClass}>{employee.nationality}</div>
          </div>

          <div className="flex border-b border-black min-h-[50px]">
            <div className={labelClass}>الجنس</div>
            <div className={valueClass}>{employee.gender}</div>
          </div>

          <div className="flex border-b border-black min-h-[50px]">
            <div className={labelClass}>اسم الشركة</div>
            <div className={valueClass}>{employee.company}</div>
          </div>

          <div className="flex min-h-[50px]">
            <div className={labelClass}>جهة الموافقة</div>
            <div className={valueClass}>{employee.authority}</div>
          </div>
        </div>

        <div className="h-6" />

        {/* PURPOSE */}
        <div className="border border-black w-full">
          <div className="flex border-b border-black min-h-[50px]">
            <div className={labelClass}>غرض التصريح</div>
            <div className={valueClass}>{employee.purpose}</div>
          </div>

          <div className="flex min-h-[80px]">
            <div className={labelClass}>الوصف</div>
            <div className={`${valueClass} text-right`}>
              {employee.description}
            </div>
          </div>
        </div>

        <div className="h-6" />

        {/* QR */}
        <div className="border border-black flex justify-between p-5">
          <div className="text-right flex-1">
            <div className="font-bold mb-2">التعليمات:</div>
            <p>...</p>
          </div>
          <QRCodeSVG value={verificationUrl} size={130} />
        </div>

        {/* FOOTER */}
        <div className="mt-4 text-right text-sm">
          <span className="font-bold">تاريخ الطباعة:</span>{" "}
          {new Date().toISOString().split("T")[0]}
        </div>

      </div>
    </div>
  );
}