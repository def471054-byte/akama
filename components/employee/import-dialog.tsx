"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  FileUp, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  FileSpreadsheet,
  ArrowRight,
  RefreshCw,
  X
} from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { toast } from "@/hooks/use-toast";

type ImportStep = "SELECT" | "PREVIEW" | "IMPORTING" | "COMPLETE";

export default function ImportEmployeeDialog() {
  const t = useTranslations("common");
  const router = useRouter();
  
  const [step, setStep] = useState<ImportStep>("SELECT");
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentInfo, setCurrentInfo] = useState("");
  const [results, setResults] = useState<{ success: number; failed: number }>({ success: 0, failed: 0 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dateMode, setDateMode] = useState<"GREGORIAN" | "HIJRI">("GREGORIAN");

  // 1. CSV Parsing Logic — smart encoding detection for Arabic files
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      if (!arrayBuffer) return;

      // Step 1: Try UTF-8 first (correct for files saved as UTF-8 with/without BOM)
      let text = new TextDecoder("utf-8").decode(arrayBuffer);

      // Step 2: If UTF-8 decoding produced replacement characters (U+FFFD),
      // the file is likely Windows-1256 (Arabic Windows encoding from Excel/Word).
      // Re-decode the same bytes with the correct encoding.
      if (text.includes("\uFFFD")) {
        try {
          text = new TextDecoder("windows-1256").decode(arrayBuffer);
        } catch {
          // windows-1256 not supported in this browser — keep UTF-8 result
        }
      }

      // Step 3: Strip BOM (U+FEFF) if present — Excel adds this to UTF-8 exports
      if (text.charCodeAt(0) === 0xFEFF) {
        text = text.slice(1);
      }

      // Step 4: Feed the clean, correctly-decoded string to PapaParse
      Papa.parse(text, {
        header: true,
        skipEmptyLines: "greedy",
        transformHeader: (h) => h.trim(),
        transform: (value) => value.trim(),
        complete: (results) => {
          setParsedData(results.data);
          setStep("PREVIEW");
        },
        error: (err: { message: string }) => {
          toast({ title: t("error"), description: err.message, variant: "destructive" });
        }
      });
    };
    reader.readAsArrayBuffer(file);
  }, [t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false
  });

  // 2. Sample CSV Generation
  const downloadSample = () => {
    const headers = [
      "name", "photo", "idNumber", "nationality", "gender", "designation", 
      "description", "company", "permitNumber", "issueDate", 
      "expiryDate", "birthDate", "bloodType", "workLocation", "purpose"
    ];
    
    const sampleRows = [
      [
        "MUHAMMAD YOUSUF GULZAR AHMED", 
        "/api/uploads/2183694914.jpg", 
        "2183694914", 
        "باكستان", 
        "ذكر", 
        "عامل تحميل وتفريغ", 
        "العمل داخل مكة", 
        "المديرية العامة للجوازات", 
        "447190104675035", 
        "26-10-1447", 
        "28-12-1447", 
        "", 
        "", 
        "منطقة الرياض", 
        "عمل دائم"
      ],
      [
        "ABDULJALIL EBRAHIM AHMED KDHAM", 
        "/api/uploads/2363526753.jpeg", 
        "2363526753", 
        "اليمن", 
        "ذكر", 
        "عامل نادل", 
        "العمل داخل مكة", 
        "المديرية العامة للجوازات", 
        "447190109869563", 
        "26-10-1447", 
        "28-12-1447", 
        "", 
        "", 
        "منطقة الرياض", 
        "عمل دائم"
      ]
    ];
    
    // Use BOM for Excel UTF-8 support
    const csvContent = "\uFEFF" + [headers.join(","), ...sampleRows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "akama_employee_sample.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Batch Import Logic
  const startImport = async () => {
    setStep("IMPORTING");
    setProgress(0);
    let successCount = 0;
    let failCount = 0;
    const batchSize = 10;

    for (let i = 0; i < parsedData.length; i += batchSize) {
      const batch = parsedData.slice(i, i + batchSize);
      setCurrentInfo(`Processing records ${i + 1} to ${Math.min(i + batchSize, parsedData.length)}...`);
      
      try {
        const res = await fetch("/api/employees/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employees: batch, dateMode })
        });

        const data = await res.json();
        if (res.ok) {
          successCount += data.successCount;
          failCount += data.failCount;
        } else {
          failCount += batch.length;
        }
      } catch (err) {
        failCount += batch.length;
      }

      const newProgress = Math.round(((i + batch.length) / parsedData.length) * 100);
      setProgress(newProgress);
    }

    setResults({ success: successCount, failed: failCount });
    setStep("COMPLETE");
  };

  const resetDialog = () => {
    setStep("SELECT");
    setParsedData([]);
    setProgress(0);
    setCurrentInfo("");
    setResults({ success: 0, failed: 0 });
    if (step === "COMPLETE") {
       router.refresh();
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => {
      setIsDialogOpen(open);
      if (!open) resetDialog();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="rounded-2xl gap-2 border-slate-200 text-[#1e3a5f] hover:bg-slate-50 shadow-sm px-6 font-bold uppercase tracking-widest text-xs">
          <FileUp className="w-4 h-4" /> {t("import")}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-3xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-[#1e3a5f] p-8 text-white relative">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <FileSpreadsheet className="w-6 h-6 text-[#c8a45c]" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black uppercase tracking-tight">Bulk Import Nodes</DialogTitle>
                <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mt-1">Multi-stage ingestion pipeline</p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-8 bg-white min-h-[400px] flex flex-col">
          
          {/* STEP 1: SELECT FILE */}
          {step === "SELECT" && (
            <div className="flex-1 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div 
                {...getRootProps()} 
                className={`flex-1 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-12 transition-all cursor-pointer ${
                  isDragActive ? "border-[#c8a45c] bg-[#c8a45c]/5" : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-6">
                  <FileUp className={`w-10 h-10 ${isDragActive ? "text-[#c8a45c]" : "text-slate-300"}`} />
                </div>
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                  {isDragActive ? "Drop CSV here" : "Drag & Drop Employee Manifest"}
                </h3>
                <p className="text-slate-400 text-sm mt-2 font-medium">Support for .csv data streams</p>
                <Button variant="secondary" className="mt-8 rounded-2xl px-8 font-black uppercase tracking-widest text-xs h-12">
                   Browse Local Files
                </Button>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 flex flex-col gap-6 border border-slate-100">
                <div className="flex items-center justify-between gap-4">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                         <Download className="w-5 h-5 text-[#1e3a5f]" />
                      </div>
                      <div>
                         <p className="text-sm font-black text-slate-800 uppercase">Need a template?</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Download our standardized Saudi-ready schema</p>
                      </div>
                   </div>
                   <Button onClick={downloadSample} variant="outline" className="rounded-xl border-slate-200 bg-white hover:bg-slate-100 font-black text-[10px] uppercase tracking-widest h-10">
                      Download Sample
                   </Button>
                </div>

                <div className="pt-6 border-t border-slate-200/60">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-[#c8a45c]/10 flex items-center justify-center">
                            <RefreshCw className="w-4 h-4 text-[#c8a45c]" />
                         </div>
                         <p className="text-xs font-black text-slate-700 uppercase tracking-widest">{t("dateMode")}</p>
                      </div>
                      <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                         <button 
                           onClick={() => setDateMode("GREGORIAN")}
                           className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${dateMode === "GREGORIAN" ? 'bg-[#1e3a5f] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                         >
                            {t("gregorian")}
                         </button>
                         <button 
                           onClick={() => setDateMode("HIJRI")}
                           className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${dateMode === "HIJRI" ? 'bg-[#1e3a5f] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                         >
                            {t("hijri")}
                         </button>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PREVIEW */}
          {step === "PREVIEW" && (
            <div className="flex-1 flex flex-col animate-in fade-in duration-500">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                     <Badge variant="outline" className="rounded-lg h-7 border-slate-200 text-slate-500 px-3 uppercase tracking-widest text-[10px] font-black">
                        {parsedData.length} Records Detected
                     </Badge>
                  </div>
                  <Button variant="ghost" onClick={() => setStep("SELECT")} className="text-slate-400 hover:text-red-500 gap-2 font-black uppercase text-[10px] tracking-widest">
                     <RefreshCw className="w-3 h-3" /> Start Over
                  </Button>
               </div>

               <div className="flex-1 rounded-2xl border border-slate-100 overflow-hidden shadow-sm bg-slate-50/30 max-h-[300px] overflow-y-auto">
                  <Table>
                    <TableHeader className="bg-white sticky top-0 z-10">
                      <TableRow>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest min-w-[180px]">Name</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest">ID Number</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest min-w-[100px]">Nationality</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest min-w-[160px]">Designation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedData.slice(0, 50).map((row, i) => (
                        <TableRow key={i} className="bg-white">
                          <TableCell 
                            dir="auto" 
                            className="font-bold text-slate-700 font-ajeer"
                          >
                            {row.name || "---"}
                          </TableCell>
                          <TableCell className="text-slate-500 font-mono text-xs">{row.idNumber || "---"}</TableCell>
                          <TableCell 
                            dir="auto" 
                            className="text-slate-500 font-ajeer"
                          >
                            {row.nationality || "---"}
                          </TableCell>
                          <TableCell 
                            dir="auto" 
                            className="text-slate-400 font-ajeer"
                          >
                            {row.designation || "---"}
                          </TableCell>
                        </TableRow>
                      ))}
                      {parsedData.length > 50 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-slate-400 text-xs font-bold uppercase tracking-widest bg-slate-50">
                             ... and {parsedData.length - 50} more records
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
               </div>

               <div className="mt-8 flex justify-end">
                  <Button onClick={startImport} className="bg-[#1e3a5f] hover:bg-[#162a45] rounded-2xl px-12 h-14 font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-900/10 gap-2 text-white">
                     Proceed with Import <ArrowRight className="w-5 h-5" />
                  </Button>
               </div>
            </div>
          )}

          {/* STEP 3: IMPORTING */}
          {step === "IMPORTING" && (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in zoom-in duration-500">
               <div className="relative w-32 h-32 mb-8">
                  <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                  <div className="absolute inset-0 border-t-4 border-[#c8a45c] rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Loader2 className="w-10 h-10 text-[#1e3a5f] animate-pulse" />
                  </div>
               </div>
               <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">Synchronizing Nodes</h3>
               <p className="text-slate-400 text-sm font-medium mb-10 max-w-sm">{currentInfo}</p>
               
               <div className="w-full max-w-md space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <span>Task Progress</span>
                    <span className="text-[#1e3a5f]">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-4 rounded-full" />
               </div>
            </div>
          )}

          {/* STEP 4: COMPLETE */}
          {step === "COMPLETE" && (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-top-4 duration-700">
               <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border-2 border-emerald-100 shadow-xl shadow-emerald-500/10">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
               </div>
               <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight mb-2">Ingestion Complete</h3>
               <p className="text-slate-400 text-sm font-medium mb-8">Your registry has been updated with new verified nodes.</p>

               <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Success</p>
                     <p className="text-2xl font-black text-emerald-600">{results.success}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Failed</p>
                     <p className="text-2xl font-black text-red-500">{results.failed}</p>
                  </div>
               </div>

               <Button onClick={() => setIsDialogOpen(false)} className="bg-[#1e3a5f] hover:bg-[#162a45] rounded-2xl px-12 h-14 font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-900/10 text-white">
                  Close and Refresh Registry
               </Button>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}
