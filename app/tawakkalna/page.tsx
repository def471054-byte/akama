import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { LiveClock } from "@/components/tawakkalna/live-clock";
import { CopyButton } from "@/components/tawakkalna/copy-button";
import { IoShareSocialOutline, IoCopyOutline, IoHeartOutline } from "react-icons/io5";
import { RxShare2 } from "react-icons/rx";
import { BackButton } from "@/components/tawakkalna/back-button";

function Barcode({ value }: { value: string }) {
  const bars = value.split("").map((char) => char.charCodeAt(0) % 4);
  return (
    <div className="flex h-[22px] gap-[0.5px] overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="bg-black"
          style={{
            width: i % 3 === 0 ? "2px" : "1px",
            opacity: bars[i % bars.length] > 1 ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
}

type Employee = {
  name: string;
  arabicName?: string | null;
  nationality: string | null;
  idNumber: string;
  permitNumber: string;
  gender: string | null;
  photo: string | null;
  verificationToken: string;
  birthDate: string | null;
  designation: string | null;
  permitSites?: string | null;
  bloodType?: string | null;
  authority?: string | null;
  providerEstNumber?: string | null;
  company?: string | null;
  permitGroup?: string | null;
};



export default async function PermitPage(props: {
    searchParams: Promise<{ e?: string }>;
}) {
    
    
    const { e: token } = await props.searchParams;
    
    if (!token) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white text-center px-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">No Token Provided</h1>
          <p className="text-gray-400">Please provide a valid verification token.</p>
        </div>
      </div>
    );
  }
    
    const headersList = await headers();
    const host = headersList.get("host") || "hch.re";
    const protocol = host.includes("localhost") ? "http" : "https";
    const verificationUrl = `${protocol}://${host}/?e=${token}`;

  const employee = await prisma.employee.findUnique({
    where: { verificationToken: token },
  }) as Employee | null;

  if (!employee) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-center px-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Permit Not Found</h1>
          <p className="text-gray-400">The verification token provided is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  const getArabicName = (emp: Employee) => {
    return emp.arabicName || "موظف معتمد";
  };

  return (
    <div dir="ltr" className="min-h-screen bg-black flex flex-col items-center text-white font-sans">

      {/* HEADER */}
      <div className="w-full max-w-md px-4 py-5 flex justify-start items-center gap-2">
        <BackButton />
        <h1 className="text-lg font-semibold">Makkah Entry Permit</h1>
      </div>

      {/* CARD */}
      <div className="w-full max-w-md px-4">
        <div
          className="relative w-full h-[260px] rounded-xl overflow-hidden text-[#1a2d4b]"
          style={{
            backgroundImage: "url('/cardBG.png')",
            backgroundSize: "100% 100%",
          }}
        >
          {/* ROW 1 - BARCODE */}
          <div className="absolute top-2 left-2 mt-2 ml-1">
            
            <Barcode value={employee.permitNumber} />
            <div className="text-[8px] text-black text-center font-mono opacity-80">
              {employee.permitNumber}
            </div>
          </div>

          {/* ROW 2 */}
          <div className="absolute top-[40px] left-0 right-0 flex px-4">

            {/* LEFT (DATA) */}
            <div className="flex-[2] text-right pr-2 mt-2 ml-1">
              
              {/* NAME */}
              <div className="mb-1">
                <p className="text-[10px] font-9old text-gray-800 font-medium">Name / الاسم</p>
                <p className="text-[11px] font-bold text-black">
                  {getArabicName(employee)}
                </p>
                <p className="text-[10px] font-bold tracking-tight text-black">
                  {employee.name}
                </p>
              </div>

              {/* NATIONALITY */}
              <div className="border-b border-gray-300/50 pb-1 mb-1 flex justify-end">
                <div className="text-right">
                  <p className="text-[9px] text-gray-800 font-medium">الجنسية</p>
                  <p className="text-[11px] font-bold text-black">{employee.nationality || "--"}</p>
                </div>
                <div className="text-right w-[100px]">
                  <p className="text-[9px] text-gray-800 font-medium">Nationality</p>
                  <p className="text-[11px] font-bold text-black">{employee.nationality || "--"}</p>
                </div>
              </div>

              {/* PERMIT TYPE + ID */}
              <div className="border-b border-gray-300/50 pb-1 flex justify-end">
                <div className="text-right">
                  <p className="text-[9px] text-gray-800 font-medium">نوع التصريح/Permit Type</p>
                  <p className="text-[11px] font-bold text-black">Makkah Entry / دخل مكة
</p>
                </div>
                <div className="text-right  w-[100px]">
                  <p className="text-[9px] text-gray-800 font-medium">ID</p>
                  <p className="text-[11px] font-bold text-black">{employee.idNumber}</p>
                </div>
              </div>
            </div>

            {/* RIGHT (PHOTO) */}
            <div className="flex justify-end">
              <div className="w-[90px] h-[110px] bg-white border mt-4 mr-1">
                {employee.photo ? (
                  <img
                    src={employee.photo.startsWith('/uploads/') ? employee.photo.replace('/uploads/', '/api/uploads/') : employee.photo}
                    alt="photo"
                    width={90}
                    height={110}
                    className="object-cover h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs text-center p-2">
                    No Photo
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ROW 3 */}
          <div className="absolute bottom-[55px] left-0 right-0 px-4 flex border-t border-gray-300/50 pt-1">

            <div className="flex-1 flex justify-end text-right">
              <div>
                <p className="text-[9px] text-gray-800 font-medium">الجنس/Gender</p>
                <p className="text-[11px] font-bold text-black">{employee.gender || "--"}</p>
              </div>
              <div className="w-[100px]">
                <p className="text-[9px] text-gray-800 font-medium">Date of Birth/تاريخ الميلاد</p>
                <p className="text-[11px] font-bold text-black">{employee.birthDate || "01/01/1972"}</p>
              </div>
            </div>

            <div className="flex-row w-[100px] text-right border-r border-gray-300/50">
              <p className="text-[9px] text-gray-800 font-medium">Permit ID/رقم التصريح</p>
              <p className="text-[11px] font-bold text-black tracking-tighter">
                {employee.permitNumber}
              </p>
            </div>
          </div>

          {/* ROW 4 */}
          <div className="absolute bottom-6 right-4 text-right">
            <p className="text-[9px] text-gray-800 font-medium">Permit Sites</p>
            <p className="text-[11px] font-bold text-black">
              {employee.permitSites || "أحياء العاصمة المقدسة"}
            </p>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3 mt-6 w-full max-w-md px-6">
        <div className="w-12 h-12 rounded-full bg-[#1c1c1e] flex items-center justify-center cursor-pointer hover:bg-[#2c2c2e] transition-colors">
            <RxShare2 className="w-6 h-6 text-gray-400"/>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#1c1c1e] flex items-center justify-center cursor-pointer hover:bg-[#2c2c2e] transition-colors">
            <IoCopyOutline className="w-6 h-6 text-gray-400" />
        </div>
        <div className="w-12 h-12 rounded-full bg-[#1c1c1e] flex items-center justify-center cursor-pointer hover:bg-[#2c2c2e] transition-colors">
            <IoHeartOutline className="w-6 h-6 text-gray-400" />
        </div>
      </div>

      {/* QR */}
      <div className="w-full max-w-md px-6 mt-6 flex justify-end">
        <div className="bg-white p-3 rounded-xl text-black text-center">
            {verificationUrl && (
              <QRCodeSVG 
                 value={verificationUrl} 
                 size={130} 
                 level="L" 
                 includeMargin={false}
              />
            )}
          <LiveClock />
        </div>
      </div>

      {/* DETAILS */}
      <div className="w-full max-w-md px-6 mt-8 space-y-4 pb-12">
        <div className="border-b border-gray-800 pb-4">
          <p className="text-gray-400 text-sm mb-1">Permitted Areas for Access</p>
          <div className="flex justify-between items-center">
            <p className="text-lg">أحياء العاصمة المقدسة</p>
            <CopyButton text="أحياء العاصمة المقدسة" />
          </div>
        </div>  

        <div className="border-b border-gray-800 pb-4">
          <p className="text-gray-400 text-sm mb-1">Name in Arabic</p>
          <div className="flex justify-between items-center">
            <p className="text-lg">{getArabicName(employee) || "--"}</p>
            <CopyButton text={getArabicName(employee)} />
          </div>
        </div>

        <div className="border-b border-gray-800 pb-4">
          <p className="text-gray-400 text-sm mb-1">Name</p>
          <div className="flex justify-between items-center">
            <p className="text-lg">{employee.name || "--"}</p>
            <CopyButton text={employee.name} />
          </div>
        </div>

        <div className="border-b border-gray-800 pb-4">
          <p className="text-gray-400 text-sm mb-1">ID</p>
          <div className="flex justify-between items-center">
            <p className="text-lg">{employee.idNumber || "--"}</p>
            <CopyButton text={employee.idNumber} />
          </div>
        </div>

        <div className="border-b border-gray-800 pb-4">
          <p className="text-gray-400 text-sm mb-1">Date of Birth</p>
          <div className="flex justify-between items-center">
            <p className="text-lg">{employee.birthDate || "--"}</p>
            <CopyButton text={employee.birthDate || ""} />
          </div>
        </div>

        <div className="border-b border-gray-800 pb-4">
          <p className="text-gray-400 text-sm mb-1">Gender</p>
          <div className="flex justify-between items-center">
            <p className="text-lg">{employee.gender || "--"}</p>
            <CopyButton text={employee.gender || ""} />
          </div>
        </div>

        <div className="border-b border-gray-800 pb-4">
          <p className="text-gray-400 text-sm mb-1">Blood Type</p>
          <div className="flex justify-between items-center">
            <p className="text-lg">{"--"}</p>
            <CopyButton text="" />
          </div>
        </div>

        <div className="border-b border-gray-800 pb-4">
          <p className="text-gray-400 text-sm mb-1">Permit Number</p>
          <div className="flex justify-between items-center">
            <p className="text-lg">{employee.permitNumber}</p>
            <CopyButton text={employee.permitNumber} />
          </div>
        </div>

        <div className="border-b border-gray-800 pb-4">
          <p className="text-gray-400 text-sm mb-1">Issueing Authority</p>
          <div className="flex justify-between items-center">
            <p className="text-lg">{employee.authority || "--"}</p>
            <CopyButton text={employee.authority || ""} />
          </div>
        </div>

        <div className="border-b border-gray-800 pb-4">
          <p className="text-gray-400 text-sm mb-1">Service Provider</p>
          <div className="flex justify-between items-center">
            <p className="text-lg">{employee.providerEstNumber || "--"}</p>
            <CopyButton text={employee.providerEstNumber || ""} />
          </div>
        </div>

        <div className="border-b border-gray-800 pb-4">
          <p className="text-gray-400 text-sm mb-1">Company Name</p>
          <div className="flex justify-between items-center">
            <p className="text-lg">{employee.company || "--"}</p>
            <CopyButton text={employee.company || ""} />
          </div>
        </div>

        <div className="border-b border-gray-800 pb-4">
          <p className="text-gray-400 text-sm mb-1">Service Group in Makkah</p>
          <div className="flex justify-between items-center">
            <p className="text-lg">{employee.permitGroup || "--"}</p>
            <CopyButton text={employee.permitGroup || ""} />
          </div>
        </div>
      </div>
    </div>
  );
}