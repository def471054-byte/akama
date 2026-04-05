"use client";

import { useTransition, useState, useEffect } from "react";
import { setupAdmin } from "./actions";
import { 
  ShieldCheck, 
  UserPlus, 
  Key, 
  Mail, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check,
  RefreshCcw
} from "lucide-react";
import Link from "next/link";

export default function SetupPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; data?: any; message?: string } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("akama_setup_result");
    if (saved) {
      try {
        setResult(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem("akama_setup_result");
      }
    }
  }, []);

  const handleSetup = async () => {
    startTransition(async () => {
      const resp = await setupAdmin();
      setResult(resp);
      if (resp.success) {
        localStorage.setItem("akama_setup_result", JSON.stringify(resp));
      }
    });
  };

  const clearSetup = () => {
    localStorage.removeItem("akama_setup_result");
    setResult(null);
  };

  const copyToClipboard = (text: string, type: 'email' | 'pass') => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              System Initialization
            </h1>
            <p className="text-white/50 text-sm leading-relaxed max-w-[280px] mx-auto">
              Set up your primary administrative account to begin managing Akama.
            </p>
          </div>

          {!result ? (
            <div className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex gap-4 items-start">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div className="text-xs text-blue-100/70 leading-relaxed pt-1">
                  Click the button below to generate a new admin account. This can only be done once if no users exist.
                </div>
              </div>

              <button
                onClick={handleSetup}
                disabled={isPending}
                className="w-full group relative flex items-center justify-center gap-3 py-4 bg-white text-black font-semibold rounded-2xl transition-all hover:bg-white/90 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isPending ? (
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Create Admin Account</span>
                  </>
                )}
              </button>
            </div>
          ) : result.success ? (
            <div className="space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="space-y-4">
                <div className="relative group">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1 mb-1.5 block font-medium">Administrative Email</label>
                  <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl focus-within:border-white/20 transition-colors group">
                    <Mail className="w-4 h-4 text-white/30 group-focus-within:text-white/60" />
                    <code className="flex-1 text-sm text-white/90 font-mono">{result.data.email}</code>
                    <button 
                      onClick={() => copyToClipboard(result.data.email, 'email')}
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
                    >
                      {copiedEmail ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="relative group">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1 mb-1.5 block font-medium">Temporary Password</label>
                  <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl focus-within:border-white/20 transition-colors group">
                    <Key className="w-4 h-4 text-white/30 group-focus-within:text-white/60" />
                    <code className="flex-1 text-sm text-white/90 font-mono tracking-wider">{result.data.password}</code>
                    <button 
                      onClick={() => copyToClipboard(result.data.password, 'pass')}
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
                    >
                      {copiedPass ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex gap-4 items-start">
                <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs text-green-100/70 leading-relaxed pt-1">
                  Account created successfully! Copy your credentials and proceed to the login page. <b>Record your password carefully.</b>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={clearSetup}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 text-white/60 font-medium rounded-2xl hover:bg-white/10 transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" />
                  <span>Reset View</span>
                </button>
                <Link
                  href="/login"
                  className="flex-[2] flex items-center justify-center gap-3 py-4 bg-white text-black font-semibold rounded-2xl transition-all hover:bg-white/90 hover:scale-[1.02] active:scale-95"
                >
                  <span>Go to Login</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center text-red-400">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-red-200">Action Blocked</p>
                  <p className="text-sm text-red-500/70 leading-relaxed">
                    {result.message}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={clearSetup}
                  className="flex-1 py-4 bg-white/5 border border-white/10 text-white/60 font-medium rounded-2xl hover:bg-white/10 transition-colors"
                >
                  Retry
                </button>
                <Link
                  href="/login"
                  className="flex-1 py-4 bg-white text-black font-semibold rounded-2xl hover:bg-white/90 transition-all text-center"
                >
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer info */}
        <p className="text-center mt-8 text-white/20 text-[10px] uppercase tracking-[0.2em]">
          Akama Security Framework • Secure Identity
        </p>
      </div>
    </div>
  );
}
