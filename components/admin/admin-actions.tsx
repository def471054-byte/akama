"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { 
  FileDown, 
  FileUp, 
  Database, 
  Upload, 
  Download, 
  RefreshCcw, 
  ShieldCheck, 
  FileJson, 
  Trash,
  Loader2
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";

export default function AdminActions() {
  const t = useTranslations("common");
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleExport = async () => {
    setLoading("export");
    window.location.href = "/api/export";
    setLoading(null);
  };

  const handleBackup = async () => {
    setLoading("backup");
    window.location.href = "/api/backup";
    setLoading(null);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading("import");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/import", { method: "POST", body: formData });
      if (res.ok) {
        toast({ title: t("success"), description: "Employees imported successfully" });
        router.refresh();
      } else {
        toast({ title: t("error"), variant: "destructive" });
      }
    } catch (e) {
      toast({ title: t("error"), variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm("Warning: Restoring will overwrite existing data. Proceed?")) return;

    setLoading("restore");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/restore", { method: "POST", body: formData });
      if (res.ok) {
        toast({ title: t("success"), description: "System restored successfully" });
        router.refresh();
      } else {
        toast({ title: t("error"), variant: "destructive" });
      }
    } catch (e) {
      toast({ title: t("error"), variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="lg" className="rounded-2xl gap-2 border-slate-200 text-[#1e3a5f] hover:bg-slate-50 shadow-sm px-6 font-bold uppercase tracking-widest text-xs">
            <Database className="w-4 h-4" /> System Control
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl rounded-3xl p-8 border-none shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 bg-[#1e3a5f] rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-[#c8a45c]" />
               </div>
               <DialogTitle className="text-2xl font-black text-[#1e3a5f] uppercase tracking-tight tracking-widest">Admin Control Panel</DialogTitle>
            </div>
            <DialogDescription className="text-slate-400 font-medium">Manage your identity database assets and system recovery.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* EXPORT CARD */}
            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center group hover:bg-white hover:shadow-xl transition-all duration-500">
               <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileDown className="w-7 h-7 text-green-600" />
               </div>
               <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest leading-none mb-2">Data Export</h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">Convert DB to Excel spreadsheet</p>
               <Button onClick={handleExport} disabled={loading === "export"} className="w-full bg-white text-green-600 border border-green-100 hover:bg-green-600 hover:text-white rounded-xl h-12 shadow-sm font-bold uppercase tracking-widest text-[10px] gap-2">
                  {loading === "export" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} {t("export")}
               </Button>
            </div>

            {/* BACKUP CARD */}
            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center group hover:bg-white hover:shadow-xl transition-all duration-500">
               <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Database className="w-7 h-7 text-blue-600" />
               </div>
               <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest leading-none mb-2">Full Backup</h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">Backup database + physical photos</p>
               <Button onClick={handleBackup} disabled={loading === "backup"} className="w-full bg-white text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white rounded-xl h-12 shadow-sm font-bold uppercase tracking-widest text-[10px] gap-2">
                  {loading === "backup" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} {t("backup")}
               </Button>
            </div>

            {/* IMPORT CARD */}
            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center group hover:bg-white hover:shadow-xl transition-all duration-500 relative overflow-hidden">
               <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileUp className="w-7 h-7 text-amber-600" />
               </div>
               <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest leading-none mb-2">Bulk Import</h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">Import employees via CSV file</p>
               <div className="relative w-full">
                  <label className="flex items-center justify-center w-full bg-white text-amber-600 border border-amber-100 hover:bg-amber-600 hover:text-white rounded-xl h-12 shadow-sm font-bold uppercase tracking-widest text-[10px] gap-2 cursor-pointer transition-colors">
                     {loading === "import" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} {t("import")}
                     <input type="file" accept=".csv" className="hidden" onChange={handleImport} disabled={loading === "import"} />
                  </label>
               </div>
            </div>

            {/* RESTORE CARD */}
            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center group hover:bg-white hover:shadow-xl transition-all duration-500 relative overflow-hidden">
               <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <RefreshCcw className="w-7 h-7 text-red-600" />
               </div>
               <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest leading-none mb-2">System Restore</h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">Restore data from ZIP backup</p>
               <div className="relative w-full">
                  <label className="flex items-center justify-center w-full bg-white text-red-600 border border-red-100 hover:bg-red-600 hover:text-white rounded-xl h-12 shadow-sm font-bold uppercase tracking-widest text-[10px] gap-2 cursor-pointer transition-colors">
                     {loading === "restore" ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />} {t("restore")}
                     <input type="file" accept=".zip" className="hidden" onChange={handleRestore} disabled={loading === "restore"} />
                  </label>
               </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
             <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">Identity Verification Administration Center</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
