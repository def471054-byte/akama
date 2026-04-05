import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Plus, Search, FileDown, FileUp, Database, RefreshCw } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Input } from "@/components/ui/input";
import EmployeeTable from "@/components/employee/employee-table";
import AdminActions from "@/components/admin/admin-actions";

export default async function EmployeesPage() {
  const t = await getTranslations("common");
  const employees = await prisma.employee.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-black text-[#1e3a5f] tracking-tight uppercase">{t("employees")}</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em] mt-1">Manage and verify identity nodes</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <AdminActions />
          <Link href="/dashboard/employees/create">
            <Button size="lg" className="gap-2 bg-[#1e3a5f] hover:bg-[#162a45] rounded-2xl shadow-xl shadow-blue-900/10 px-6 font-bold uppercase tracking-widest text-xs">
              <Plus className="w-4 h-4" /> 
              {t("addEmployee")}
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-6 bg-slate-50/30">
           <div className="relative flex-1 max-w-md group">
             <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-300 group-focus-within:text-[#1e3a5f] transition-colors" />
             <Input 
                placeholder={t("search")} 
                className="pl-12 h-12 rounded-2xl border-slate-100 bg-white shadow-inner focus:ring-[#1e3a5f] focus-visible:ring-[#1e3a5f] transition-all" 
             />
           </div>
           <div className="flex items-center gap-4">
              <div className="text-right flex flex-col justify-center">
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Total Assets</p>
                 <p className="text-xl font-black text-[#1e3a5f] leading-none">{employees.length}</p>
              </div>
              <div className="h-10 w-px bg-slate-200 mx-2"></div>
              <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl text-[#c8a45c] hover:bg-[#c8a45c]/5 border border-slate-100 bg-white shadow-sm">
                 <RefreshCw className="w-5 h-5" />
              </Button>
           </div>
        </div>
        <div className="p-2">
           <EmployeeTable employees={JSON.parse(JSON.stringify(employees))} />
        </div>
      </div>
    </div>
  );
}
