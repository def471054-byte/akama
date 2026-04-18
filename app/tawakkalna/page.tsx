import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { prisma } from "@/lib/prisma";
import { LiveClock } from "@/components/tawakkalna/live-clock";

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
    <div className="min-h-screen bg-black flex flex-col items-center text-white font-sans">

      {/* HEADER */}
      <div className="w-full max-w-md px-4 py-5 flex justify-between items-center">
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
        <div className="w-12 h-12 rounded-full bg-[#1c1c1e] flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#1c1c1e] flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#1c1c1e] flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        </div>
      </div>

      {/* QR */}
      <div className="w-full max-w-md px-6 mt-6 flex justify-end">
        <div className="bg-white p-3 rounded-xl text-black text-center">
          <QRCodeSVG value={employee.verificationToken || ""} size={120} />
          <LiveClock />
        </div>
      </div>

      {/* DETAILS */}
      <div className="w-full max-w-md px-6 mt-8 space-y-4 pb-12">
        <div className="border-b border-gray-800 pb-4">
          <p className="text-gray-400 text-sm">Permitted Areas for Access</p>
          <p className="text-lg">أحياء العاصمة المقدسة</p>
        </div>  

        <div className="border-b border-gray-800 pb-4">
          <p className="text-gray-400 text-sm">Name in Arabic</p>
          <p className="text-lg">{getArabicName(employee) || "--"}</p>
        </div>

        <div className="border-b border-gray-800 pb-4">
          <p className="text-gray-400 text-sm">Name</p>
          <p className="text-lg">{employee.name || "--"}</p>
        </div>

        <div className="border-b border-gray-800 pb-4">
          <p className="text-gray-400 text-sm">ID</p>
          <p className="text-lg">{employee.idNumber || "--"}</p>
        </div>

        <div className="border-b border-gray-800 pb-4">
          <p className="text-gray-400 text-sm">Date of Birth</p>
          <p className="text-lg">{employee.birthDate || "--"}</p>
        </div>

        <div className="border-b border-gray-800 pb-4">
          <p className="text-gray-400 text-sm">Gender</p>
          <p className="text-lg">{employee.gender || "--"}</p>
        </div>

        <div className="border-b border-gray-800 pb-4">
          <p className="text-gray-400 text-sm">Blood Type</p>
          <p className="text-lg">{employee.bloodType || "--"}</p>
        </div>

        <div className="border-b border-gray-800 pb-4">
          <p className="text-gray-400 text-sm">Permit Number</p>
          <p className="text-lg">{employee.permitNumber}</p>
        </div>

        <div className="border-b border-gray-800 pb-4">
          <p className="text-gray-400 text-sm">Issueing Authority</p>
          <p className="text-lg">{employee.authority || "--"}</p>
        </div>

        <div className="border-b border-gray-800 pb-4">
          <p className="text-gray-400 text-sm">Service Provider</p>
          <p className="text-lg">{employee.providerEstNumber || "--"}</p>
        </div>

        <div className="border-b border-gray-800 pb-4">
          <p className="text-gray-400 text-sm">Company Name</p>
          <p className="text-lg">{employee.company || "--"}</p>
        </div>

        <div className="border-b border-gray-800 pb-4">
          <p className="text-gray-400 text-sm">Service Group in Makkah</p>
          <p className="text-lg">{employee.permitGroup || "--"}</p>
        </div>
      </div>
    </div>
  );
}