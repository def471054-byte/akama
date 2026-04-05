import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Users, LogOut, LayoutDashboard, ShieldCheck, UserCircle, Settings } from "lucide-react";
import SignOutButton from "@/components/auth/sign-out-button";
import LanguageSwitcher from "@/components/common/language-switcher";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("common");

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#1e3a5f] text-white hidden md:flex flex-col shadow-2xl z-50">
        <div className="p-8 border-b border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 bg-[#c8a45c] rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
             <ShieldCheck className="w-6 h-6 text-[#1e3a5f]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight leading-none uppercase">AKAMA IDENTITY</span>
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Admin Portal</span>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-3 mt-4 overflow-y-auto">
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] mb-4 ml-4">Main Menu</p>
          <Link href="/dashboard" className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-white/10 transition-all font-semibold group border border-transparent hover:border-white/5 shadow-none hover:shadow-lg">
            <LayoutDashboard className="w-5 h-5 text-white/50 group-hover:text-[#c8a45c] group-hover:scale-110 transition-transform" />
            <span className="text-white/80 group-hover:text-white">{t("dashboard")}</span>
          </Link>
          <Link href="/dashboard/employees" className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 border border-white/10 shadow-lg font-semibold group">
            <Users className="w-5 h-5 text-[#c8a45c] scale-110" />
            <span className="text-white">{t("employees")}</span>
          </Link>
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] mb-4 ml-4 mt-8">System Control</p>
          <Link href="/dashboard/settings" className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-white/10 transition-all font-semibold group text-white/50 hover:text-white">
            <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-6 border-t border-white/5 bg-[#152a45]">
           <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl mb-4">
              <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                 <UserCircle className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex flex-col">
                 <p className="text-xs font-bold text-white leading-none">Security Admin</p>
                 <p className="text-[10px] text-white/40 mt-1 uppercase">Active session</p>
              </div>
           </div>
           <SignOutButton />
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
        <header className="h-20 bg-white/80 backdrop-blur-md px-10 flex items-center justify-between border-b border-slate-200/60 sticky top-0 z-40">
           <div className="flex flex-col">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">{t("employees")}</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Management Panel</p>
           </div>
           <div className="flex items-center gap-6">
              <LanguageSwitcher />
              <div className="w-10 h-10 rounded-2xl bg-[#1e3a5f] flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform cursor-pointer">
                 <UserCircle className="w-6 h-6" />
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
           <div className="p-10 container max-w-7xl mx-auto">
             {children}
           </div>
           <footer className="p-10 text-center border-t border-slate-200/60 bg-white/40">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.25em]">© 2026 Admin Verification Engine • All Rights Reserved</p>
           </footer>
        </div>
      </main>
    </div>
  );
}
