"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { Camera, Save, X } from "lucide-react";
import PhotoUpload from "./photo-upload";

type EmployeeFormProps = {
  initialData?: any;
  isEdit?: boolean;
};

export default function EmployeeForm({ initialData, isEdit }: EmployeeFormProps) {
  const t = useTranslations("common");
  const f = useTranslations("fields");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<string | null>(initialData?.photo || null);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Clean data for Prisma (dates)
    const payload = {
      ...data,
      photo,
      issueDate: data.issueDate || null,
      expiryDate: data.expiryDate || null,
      birthDate: data.birthDate || null,
      bloodType: data.bloodType || null,
    };

    try {
      const url = isEdit ? `/api/employees/${initialData.id}` : "/api/employees";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast({ title: t("success") });
        router.push("/dashboard/employees");
        router.refresh();
      } else {
        toast({ title: t("error"), variant: "destructive" });
      }
    } catch (error) {
      toast({ title: t("error"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Photo Upload System */}
        <div className="shrink-0">
          <PhotoUpload 
            label={f("photo")}
            currentPhoto={photo}
            onUploadSuccess={(url) => setPhoto(url)}
          />
        </div>

        {/* Main Form Fields Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 w-full">
           <div className="space-y-2">
             <Label htmlFor="name" className="text-sm font-bold text-slate-700 uppercase tracking-wide">{t("name")}</Label>
             <Input id="name" name="name" defaultValue={initialData?.name} required placeholder="Full Name" className="h-11 border-slate-200 focus-visible:ring-[#1e3a5f]" />
           </div>

           <div className="space-y-2">
             <Label htmlFor="arabicName" className="text-sm font-bold text-slate-700 uppercase tracking-wide">{f("arabicName")}</Label>
             <Input id="arabicName" name="arabicName" defaultValue={initialData?.arabicName} placeholder="الاسم الكامل بالعربية" className="h-11 border-slate-200 focus-visible:ring-[#1e3a5f] font-ajeer" />
           </div>

           <div className="space-y-2">
             <Label htmlFor="idNumber" className="text-sm font-bold text-slate-700 uppercase tracking-wide">{t("idNumber")}</Label>
             <Input id="idNumber" name="idNumber" defaultValue={initialData?.idNumber} required placeholder="ID Number (Iqama/National ID)" className="h-11 border-slate-200 focus-visible:ring-[#1e3a5f]" />
           </div>

           <div className="space-y-2">
             <Label htmlFor="nationality" className="text-sm font-bold text-slate-700 uppercase tracking-wide">{t("nationality")}</Label>
             <Input id="nationality" name="nationality" defaultValue={initialData?.nationality} placeholder="Nationality" className="h-11 border-slate-200 focus-visible:ring-[#1e3a5f]" />
           </div>

           <div className="space-y-2">
             <Label htmlFor="permitNumber" className="text-sm font-bold text-slate-700 uppercase tracking-wide">{f("permitNumber")}</Label>
             <Input id="permitNumber" name="permitNumber" defaultValue={initialData?.permitNumber} placeholder="Permit Number" className="h-11 border-slate-200 focus-visible:ring-[#1e3a5f]" />
           </div>

           <div className="space-y-2">
             <Label htmlFor="issueDate" className="text-sm font-bold text-slate-700 uppercase tracking-wide">{f("issueDate")}</Label>
             <Input id="issueDate" name="issueDate" type="text" defaultValue={initialData?.issueDate || ''} placeholder="1447-12-15" className="h-11 border-slate-200 focus-visible:ring-[#1e3a5f]" />
           </div>

           <div className="space-y-2">
             <Label htmlFor="expiryDate" className="text-sm font-bold text-slate-700 uppercase tracking-wide">{f("expiryDate")}</Label>
             <Input id="expiryDate" name="expiryDate" type="text" defaultValue={initialData?.expiryDate || ''} placeholder="1448-12-15" className="h-11 border-slate-200 focus-visible:ring-[#1e3a5f]" />
           </div>

           <div className="space-y-2">
             <Label htmlFor="designation" className="text-sm font-bold text-slate-700 uppercase tracking-wide">{f("designation")}</Label>
             <Input id="designation" name="designation" defaultValue={initialData?.designation} placeholder="eg: Driver, Security" className="h-11 border-slate-200 focus-visible:ring-[#1e3a5f]" />
           </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-bold text-slate-700 uppercase tracking-wide">{f("company")}</Label>
              <Input id="company" name="company" defaultValue={initialData?.company} placeholder="Company Name" className="h-11 border-slate-200 focus-visible:ring-[#1e3a5f]" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-sm font-bold text-slate-700 uppercase tracking-wide">{f("birthDate")}</Label>
              <Input 
                id="birthDate" 
                name="birthDate" 
                type="text" 
                defaultValue={initialData?.birthDate || ''} 
                placeholder="1410-01-01"
                className="h-11 border-slate-200 focus-visible:ring-[#1e3a5f]" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloodType" className="text-sm font-bold text-slate-700 uppercase tracking-wide">{f("bloodType")}</Label>
              <Input 
                id="bloodType" 
                name="bloodType" 
                defaultValue={initialData?.bloodType} 
                placeholder="eg: A+, O-" 
                className="h-11 border-slate-200 focus-visible:ring-[#1e3a5f]" 
              />
            </div>

           <div className="space-y-2">
             <Label htmlFor="gender" className="text-sm font-bold text-slate-700 uppercase tracking-wide">{t("gender")}</Label>
             <select id="gender" name="gender" defaultValue={initialData?.gender || "ذكر"} className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a5f] focus-visible:ring-offset-2">
               <option value="ذكر">ذكر (Male)</option>
               <option value="أنثى">أنثى (Female)</option>
             </select>
           </div>

           <div className="space-y-2">
             <Label htmlFor="authority" className="text-sm font-bold text-slate-700 uppercase tracking-wide">{f("authority")}</Label>
             <Input id="authority" name="authority" defaultValue={initialData?.authority || "المديرية العامة للجوازات"} placeholder="Approving Body" className="h-11 border-slate-200 focus-visible:ring-[#1e3a5f]" />
           </div>

           <div className="space-y-2">
             <Label htmlFor="purpose" className="text-sm font-bold text-slate-700 uppercase tracking-wide">{f("purpose")}</Label>
             <Input id="purpose" name="purpose" defaultValue={initialData?.purpose || "عمل دائم"} placeholder="eg: Permanent Work" className="h-11 border-slate-200 focus-visible:ring-[#1e3a5f]" />
           </div>

           <div className="space-y-2 md:col-span-2">
             <Label htmlFor="description" className="text-sm font-bold text-slate-700 uppercase tracking-wide">{f("description")}</Label>
             <textarea 
               id="description" 
               name="description" 
               defaultValue={initialData?.description || "السلام عليكم نامل من سعادتكم اصدار تصاريح للعمال علما بانه مقر الشركة داخل مكة"} 
               placeholder="Detailed description of the permit purpose..." 
               className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a5f] focus-visible:ring-offset-2"
             />
           </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
        <Button 
          type="button" 
          variant="ghost" 
          className="text-slate-500 hover:text-slate-800"
          onClick={() => router.push("/dashboard/employees")}
        >
          {t("cancel")}
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-[#1e3a5f] hover:bg-[#162a45] min-w-[120px] gap-2 text-white shadow-lg shadow-blue-900/10"
        >
          <Save className="w-4 h-4" />
          {loading ? t("loading") : t("save")}
        </Button>
      </div>
    </form>
  );
}
