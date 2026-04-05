"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, Mail, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function LoginPage() {
  const t = useTranslations("auth");
  const common = useTranslations("common");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast({ 
          title: common("error"), 
          description: "Invalid Email or Password. Please check your credentials.", 
          variant: "destructive" 
        });
        setLoading(false);
      } else {
        toast({ title: common("success"), description: "Authenticated successfully. Redirecting..." });
        router.push("/dashboard");
      }
    } catch (e) {
      toast({ title: common("error"), variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-100/50 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,_#1e3a5f_1px,transparent_0)] bg-[size:40px_40px] pointer-events-none"></div>

      <div className="w-full max-w-lg animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center mb-8">
           <div className="w-16 h-16 bg-[#1e3a5f] rounded-2xl flex items-center justify-center shadow-xl mb-4 border-2 border-white transform hover:rotate-6 transition-transform">
             <ShieldCheck className="w-10 h-10 text-[#c8a45c]" />
           </div>
           <h1 className="text-3xl font-black text-[#1e3a5f] tracking-tight uppercase">AKAMA ADMIN</h1>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em] mt-2">Certified Verification Authority</p>
        </div>

        <Card className="shadow-2xl border-none ring-1 ring-slate-200 bg-white/90 backdrop-blur-xl overflow-hidden rounded-3xl">
          <div className="h-2 bg-gradient-to-r from-[#1e3a5f] via-[#c8a45c] to-[#1e3a5f]"></div>
          <CardHeader className="text-center pt-10 pb-6 px-10">
            <CardTitle className="text-2xl font-bold text-slate-800">{t("login")}</CardTitle>
            <CardDescription className="text-slate-400 font-medium">Please enter your administrative credentials below.</CardDescription>
          </CardHeader>
          <CardContent className="px-10 pb-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{t("email")}</label>
                </div>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-300 group-focus-within:text-[#1e3a5f] transition-colors" />
                  <Input 
                    name="email" 
                    type="email" 
                    placeholder="admin@akama.sa" 
                    className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-[#1e3a5f] focus-visible:ring-[#1e3a5f] text-lg font-medium tracking-tight transition-all" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{t("password")}</label>
                  <p className="text-[10px] font-bold text-[#c8a45c] uppercase tracking-widest hover:underline cursor-pointer">Forgot?</p>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-300 group-focus-within:text-[#1e3a5f] transition-colors" />
                  <Input 
                    name="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-[#1e3a5f] focus-visible:ring-[#1e3a5f] text-lg font-medium tracking-tight transition-all" 
                    required 
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 mt-4 bg-[#1e3a5f] hover:bg-[#162a45] rounded-2xl text-lg font-bold uppercase tracking-widest gap-2 shadow-xl shadow-blue-900/20 active:scale-95 transition-all" 
                disabled={loading}
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    <span>{t("login")}</span>
                    <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
