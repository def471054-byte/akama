"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Edit, Trash2, Printer, ExternalLink } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { QRCodeSVG } from "qrcode.react"; // Assuming qrcode.react for simplicity in SVG rendering
import { toast } from "@/hooks/use-toast";

type Employee = {
  id: string;
  name: string;
  idNumber: string;
  nationality: string;
  verificationToken: string;
};

export default function EmployeeTable({ employees }: { employees: Employee[] }) {
  const t = useTranslations("common");
  const router = useRouter();
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const verificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/ar?e=${selectedToken}` 
    : "";

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: t("success") });
        router.refresh();
      }
    } catch (e) {
      toast({ title: t("error"), variant: "destructive" });
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR - ${selectedName}</title>
          <style>
            body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; gap: 20px; }
            h1 { margin: 0; color: #1e3a5f; }
            .url { color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <h1>${selectedName}</h1>
          <div id="qr-container"></div>
          <p class="url">${verificationUrl}</p>
          <script>
            // Note: In a real scenario, we'd pass the element or re-render
            window.print();
            window.close();
          </script>
        </body>
      </html>
    `);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead className="font-bold">{t("name")}</TableHead>
            <TableHead className="font-bold">{t("idNumber")}</TableHead>
            <TableHead className="font-bold">{t("nationality")}</TableHead>
            <TableHead className="text-right font-bold">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((emp) => (
            <TableRow key={emp.id} className="hover:bg-slate-50 transition-colors">
              <TableCell className="font-medium text-slate-800">{emp.name}</TableCell>
              <TableCell className="text-slate-500 font-mono text-sm">{emp.idNumber}</TableCell>
              <TableCell className="text-slate-600">{emp.nationality}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#1e3a5f] hover:bg-[#1e3a5f]/10" onClick={() => { setSelectedToken(emp.verificationToken); setSelectedName(emp.name); }}>
                        <QrCode className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                          <QrCode className="w-5 h-5 text-[#c8a45c]" /> {t("verified")}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col items-center p-6 space-y-6">
                        <div className="bg-white p-4 rounded-2xl shadow-inner border border-slate-100">
                          <QRCodeSVG 
                            value={`${window.location.origin}/ar?e=${selectedToken}`} 
                            size={200} 
                            level="H" 
                            includeMargin={false}
                            imageSettings={{
                               src: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Saudi_Arabia_National_Emblem.svg",
                               x: undefined, y: undefined, height: 40, width: 40, excavate: true,
                            }}
                          />
                        </div>
                        <div className="text-center">
                          <h3 className="text-lg font-bold text-slate-800">{selectedName}</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Verification URL</p>
                          <p className="text-xs text-blue-600 font-mono break-all mt-1">{verificationUrl}</p>
                        </div>
                        <div className="flex w-full gap-3">
                           <Button variant="outline" className="flex-1 gap-2 border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f]/5" onClick={handlePrint}>
                             <Printer className="w-4 h-4" /> Print
                           </Button>
                           <Button className="flex-1 gap-2 bg-[#1e3a5f] hover:bg-[#162a45]" onClick={() => window.open(verificationUrl, '_blank')}>
                             <ExternalLink className="w-4 h-4" /> View
                           </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-[#c8a45c] hover:bg-[#c8a45c]/10" onClick={() => router.push(`/dashboard/employees/${emp.id}/permit`)}>
                    <Printer className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => router.push(`/dashboard/employees/${emp.id}/edit`)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => handleDelete(emp.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {employees.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center text-slate-400 font-medium">No employees found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
