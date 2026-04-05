import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { Users, ShieldCheck, Activity, Calendar, ArrowUpRight, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

export default async function DashboardHomePage() {
  const t = await getTranslations("common");
  const employeeCount = await prisma.employee.count();
  const recentEmployees = await prisma.employee.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  const stats = [
    { label: "Verified Employees", value: employeeCount, icon: Users, color: "text-blue-600", bg: "bg-blue-500/10" },
    { label: "Active Nodes", value: "SA-DH-" + employeeCount.toString().padStart(3, '0'), icon: ShieldCheck, color: "text-[#c8a45c]", bg: "bg-[#c8a45c]/10" },
    { label: "System Uptime", value: "99.98%", icon: Activity, color: "text-green-600", bg: "bg-green-500/10" },
    { label: "Current Cycle", value: "Hajj 1447H", icon: Calendar, color: "text-purple-600", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col">
          <h1 className="text-4xl font-black text-[#1e3a5f] tracking-tight uppercase leading-none">Command Center</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em] mt-3">{t("dashboard")} Overview</p>
        </div>
        <div className="flex items-center gap-4 bg-white/50 border border-slate-100 p-2 rounded-2xl shadow-sm">
           <div className="bg-green-500 w-2.5 h-2.5 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none pr-4">Global Network Active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-500">
            <CardContent className="p-8">
              <div className="flex justify-between items-start">
                <div className={`${stat.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}>
                   <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <div className="flex items-center gap-1 text-green-500">
                   <TrendingUp className="w-3 h-3" />
                   <span className="text-[10px] font-bold">12%</span>
                </div>
              </div>
              <h3 className="text-2xl font-black text-[#1e3a5f] mb-1">{stat.value}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#1e3a5f] uppercase tracking-tight">Recent Registrations</h2>
            <Link href="/dashboard/employees" className="text-[10px] font-black text-[#c8a45c] uppercase tracking-widest hover:underline flex items-center gap-1">
               View All <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-4">
             <div className="space-y-2">
                {recentEmployees.map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-100 hover:shadow-lg group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-[#1e3a5f] group-hover:bg-[#1e3a5f] group-hover:text-white transition-colors">
                          {emp.name.charAt(0)}
                       </div>
                       <div className="flex flex-col">
                          <p className="font-bold text-[#1e3a5f]">{emp.name}</p>
                          <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold font-mono">{emp.idNumber}</p>
                       </div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(emp.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
           <h2 className="text-xl font-black text-[#1e3a5f] uppercase tracking-tight">Quick Shortcuts</h2>
           <Link href="/dashboard/employees/create" className="bg-[#1e3a5f] p-8 rounded-3xl group shadow-2xl shadow-blue-900/20 hover:scale-95 transition-all text-white flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#c8a45c] transition-colors">
                 <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-1 tracking-tight">Register Employee</h3>
              <p className="text-xs text-white/50 leading-relaxed max-w-[160px]">Create new identity node and generate secure QR token.</p>
           </Link>
        </div>
      </div>
    </div>
  );
}
