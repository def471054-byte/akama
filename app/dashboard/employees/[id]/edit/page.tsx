import { prisma } from "@/lib/prisma";
import EmployeeForm from "@/components/employee/employee-form";
import { notFound } from "next/navigation";

export default async function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  if (!id) {
    notFound();
  }

  const employee = await prisma.employee.findUnique({
    where: { id },
  });

  if (!employee) {
    notFound();
  }

  return (
    <div className="space-y-6 container mx-auto py-8">
      <div className="flex flex-col gap-1 mb-8">
        <div className="flex items-center gap-2 text-[#1e3a5f] font-bold uppercase tracking-[0.2em] text-[10px]">
          <div className="w-1.5 h-1.5 bg-[#c8a45c] rounded-full animate-pulse" />
          Management / Employee Identity
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">EDIT EMPLOYEE</h1>
        <p className="text-slate-400 font-medium max-w-lg">Modify the identity records and professional credentials for this staff member.</p>
      </div>

      <EmployeeForm initialData={employee} isEdit={true} />
    </div>
  );
}
