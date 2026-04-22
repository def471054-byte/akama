import React from "react";
import { Settings, Hammer, Clock, Shield, AlertTriangle } from "lucide-react";
import Image from "next/image";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[150px] animate-pulse delay-1000" />
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-5xl w-full relative z-10">
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(30,58,138,0.2)] flex flex-col md:flex-row items-stretch">
          
          {/* Left Visual Section */}
          <div className="w-full md:w-[45%] p-8 md:p-16 flex flex-col items-center justify-center bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/10 border-b md:border-b-0 md:border-r border-white/5 relative">
            <div className="relative group">
                {/* Glowing ring around the icon */}
                <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-3xl animate-pulse scale-125" />
                
                <div className="relative bg-slate-800/80 p-10 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-md">
                    <div className="relative w-32 h-32 md:w-40 md:h-40">
                        <Settings className="w-full h-full text-blue-400 opacity-90 animate-[spin_10s_linear_infinite]" />
                        <Hammer className="absolute -top-2 -right-2 w-12 h-12 text-indigo-300 animate-bounce" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <AlertTriangle className="w-12 h-12 text-amber-400/80 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-12 space-y-4 w-full">
                <div className="flex items-center gap-4 px-6 py-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em]">Estimated Time</span>
                        <span className="text-white text-sm font-semibold">Back in ~2 Hours</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 px-6 py-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em]">Security Status</span>
                        <span className="text-white text-sm font-semibold">Data 100% Secure</span>
                    </div>
                </div>
            </div>
          </div>

          {/* Right Content Section */}
          <div className="w-full md:w-[55%] p-10 md:p-16 flex flex-col justify-center">
            <div className="mb-12 flex justify-center md:justify-start">
                <div className="relative h-14 w-52 opacity-90 filter brightness-200 contrast-125">
                    <Image src="/verify-logo-r.png" alt="Logo" fill className="object-contain object-left" priority />
                </div>
            </div>

            <div className="space-y-6">
                <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                    <span className="text-blue-400 text-xs font-bold uppercase tracking-[0.3em]">System Upgrade</span>
                </div>
                
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                        Under <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Maintenance</span>
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-bold text-white/70" style={{ fontFamily: 'var(--font-noto-arabic)' }}>
                        الموقع قيد التطوير
                    </h2>
                </div>

                <div className="space-y-6 pt-4 border-t border-white/5">
                    <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                        We're currently polishing the experience to serve you better. We apologize for the temporary interruption.
                    </p>
                    <p className="text-slate-500 text-lg leading-relaxed max-w-md" dir="rtl" style={{ fontFamily: 'var(--font-noto-arabic)' }}>
                        نحن نقوم حالياً بتحسين تجربة المستخدم لخدمتكم بشكل أفضل. نعتذر عن هذا الانقطاع المؤقت.
                    </p>
                </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
                <div className="flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                    <span className="text-blue-400/80 text-sm font-bold tracking-widest uppercase">Live Progress 85%</span>
                </div>
                
                <div className="h-px flex-1 bg-white/5 hidden sm:block" />
            </div>

            <div className="mt-auto pt-12 flex justify-between items-center border-t border-white/5">
                <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
                    &copy; 2026 Akama Systems
                </p>
                <div className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
