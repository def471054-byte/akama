import { prisma } from "@/lib/prisma";
import { getTranslations, getLocale } from "next-intl/server";
import EmployeeForm from "@/components/employee/employee-form";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { redirect } from "next/navigation";

export default async function EditEmployeePage({ params: { id } }: { params: { id: string } }) {
  const t = await getTranslations("common");
  
  const employee = await prisma.employee.findUnique({
    where: { id },
  });

  if (!employee) {
    redirect("/dashboard/employees");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/employees" className="p-2 hover:bg-slate-200 rounded-full transition-all text-slate-500">
           <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">{t("edit")}: <span className="text-[#c8a45c] font-outfit">{employee.name}</span></h1>
      </div>

      <EmployeeForm initialData={JSON.parse(JSON.stringify(employee))} isEdit />
    </div>
  );
}
