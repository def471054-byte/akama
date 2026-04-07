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
   DialogTrigger,
   DialogFooter
 } from "@/components/ui/dialog";
 import { Button } from "@/components/ui/button";
 import { QrCode, Edit, Trash2, Printer, ExternalLink, AlertCircle, Loader2 } from "lucide-react";
 import { useRouter } from "@/i18n/routing";
 import { QRCodeSVG } from "qrcode.react";
 import { toast } from "@/hooks/use-toast";
 
 type Employee = {
   id: string;
   name: string;
   idNumber: string;
   nationality: string;
   verificationToken: string;
   photo?: string;
   birthDate?: string | Date;
   bloodType?: string;
 };
 
 export default function EmployeeTable({ employees }: { employees: Employee[] }) {
   const t = useTranslations("common");
   const router = useRouter();
   
   // QR Modal State
   const [selectedToken, setSelectedToken] = useState<string | null>(null);
   const [selectedName, setSelectedName] = useState<string | null>(null);
 
   // Delete Dialog State
   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
   const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
   const [isDeleting, setIsDeleting] = useState(false);
 
   const verificationUrl = typeof window !== 'undefined' 
     ? `${window.location.origin}/?e=${selectedToken}` 
     : "";
 
   const handleDelete = async () => {
     if (!employeeToDelete) return;
     
     setIsDeleting(true);
     try {
       const res = await fetch(`/api/employees/${employeeToDelete.id}`, { 
         method: "DELETE" 
       });
       
       if (res.ok) {
         toast({ title: t("success") });
         setIsDeleteDialogOpen(false);
         setEmployeeToDelete(null);
         router.refresh();
       } else {
         const err = await res.json();
         toast({ 
           title: t("error"), 
           description: err.error || "Failed to delete", 
           variant: "destructive" 
         });
       }
     } catch (e) {
       toast({ title: t("error"), variant: "destructive" });
     } finally {
       setIsDeleting(false);
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
           <TableRow className="bg-slate-50/50 border-slate-100">
             <TableHead className="font-bold">{t("name")}</TableHead>
             <TableHead className="font-bold">{t("idNumber")}</TableHead>
             <TableHead className="font-bold">{t("nationality")}</TableHead>
             <TableHead className="text-right font-bold">{t("actions")}</TableHead>
           </TableRow>
         </TableHeader>
         <TableBody>
           {employees.map((emp) => (
             <TableRow key={emp.id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
               <TableCell className="font-medium">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-50 border border-slate-100 shrink-0 flex items-center justify-center">
                     {emp.photo ? (
                       <img src={emp.photo.startsWith("/uploads/") ? emp.photo.replace("/uploads/", "/api/uploads/") : emp.photo} alt={emp.name} className="w-full h-full object-cover" />
                     ) : (
                       <div className="text-[10px] text-slate-400 font-bold uppercase">NA</div>
                     )}
                   </div>
                   <span className="text-slate-800">{emp.name}</span>
                 </div>
               </TableCell>
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
                             value={`${window.location.origin}/?e=${selectedToken}`} 
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
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     className="h-8 w-8 text-red-600 hover:bg-red-50" 
                     onClick={() => {
                       setEmployeeToDelete(emp);
                       setIsDeleteDialogOpen(true);
                     }}
                   >
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
 
       {/* DELETE CONFIRMATION DIALOG */}
       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
         <DialogContent className="sm:max-w-md">
           <DialogHeader>
             <DialogTitle className="flex items-center gap-2 text-red-600">
               <AlertCircle className="w-5 h-5" /> 
               {t("confirm_delete") || "Confirm Deletion"}
             </DialogTitle>
           </DialogHeader>
           <div className="py-4">
             <p className="text-slate-600">
                {t("delete_warning") || "Are you sure you want to delete this employee? This action cannot be undone."}
             </p>
             {employeeToDelete && (
               <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                 <p className="text-sm font-bold text-red-900">{employeeToDelete.name}</p>
                 <p className="text-xs text-red-700">{employeeToDelete.idNumber}</p>
               </div>
             )}
           </div>
           <DialogFooter className="flex gap-3 sm:justify-end">
             <Button 
               variant="outline" 
               onClick={() => setIsDeleteDialogOpen(false)}
               disabled={isDeleting}
             >
               {t("cancel")}
             </Button>
             <Button 
               variant="destructive" 
               onClick={handleDelete}
               disabled={isDeleting}
               className="gap-2"
             >
               {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
               {t("delete") || "Delete"}
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
     </>
   );
 }
