import { getTranslations } from "next-intl/server";
import EmployeeForm from "@/components/employee/employee-form";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";

export default async function CreateEmployeePage() {
  const t = await getTranslations("common");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/employees" className="p-2 hover:bg-slate-200 rounded-full transition-all text-slate-500">
           <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">{t("addEmployee")}</h1>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
        <EmployeeForm />
      </div>
    </div>
  );
}
