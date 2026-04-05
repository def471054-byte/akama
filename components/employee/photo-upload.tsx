"use client";
 
 import React, { useState, useCallback, useRef } from "react";
 import Cropper from "react-easy-crop";
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
 import { Button } from "@/components/ui/button";
 import { Camera, Upload, X } from "lucide-react";
 import getCroppedImg from "@/lib/image-utils";
 import { toast } from "@/hooks/use-toast";
 
 interface PhotoUploadProps {
   onUploadSuccess: (url: string) => void;
   currentPhoto?: string | null;
   label: string;
 }
 
 export default function PhotoUpload({ onUploadSuccess, currentPhoto, label }: PhotoUploadProps) {
   const [image, setImage] = useState<string | null>(null);
   const [crop, setCrop] = useState({ x: 0, y: 0 });
   const [zoom, setZoom] = useState(1);
   const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [uploading, setUploading] = useState(false);
   const fileInputRef = useRef<HTMLInputElement>(null);
 
   const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
     setCroppedAreaPixels(croppedAreaPixels);
   }, []);
 
   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files.length > 0) {
       const file = e.target.files[0];
       const reader = new FileReader();
       reader.addEventListener("load", () => {
         setImage(reader.result as string);
         setIsModalOpen(true);
       });
       reader.readAsDataURL(file);
     }
   };
 
   const handleUpload = async () => {
     if (!image || !croppedAreaPixels) return;
 
     try {
       setUploading(true);
       const croppedImage = await getCroppedImg(image, croppedAreaPixels);
       if (!croppedImage) throw new Error("Could not crop image");
 
       const formData = new FormData();
       formData.append("file", croppedImage, "photo.jpg");
 
       const res = await fetch("/api/upload", {
         method: "POST",
         body: formData,
       });
 
       const result = await res.json();
 
       if (result.success) {
         onUploadSuccess(result.url);
         setIsModalOpen(false);
         setImage(null);
         toast({ title: "Success", description: "Photo uploaded and cropped successfully" });
       } else {
         throw new Error(result.error || "Upload failed");
       }
     } catch (error: any) {
       console.error("Upload error:", error);
       toast({ 
         title: "Error", 
         description: error.message || "Failed to process photo", 
         variant: "destructive" 
       });
     } finally {
       setUploading(false);
     }
   };
 
   const triggerFileSelect = () => {
     fileInputRef.current?.click();
   };
 
   return (
     <div className="flex flex-col items-center">
       {/* Clickable Area */}
       <div 
         onClick={triggerFileSelect}
         className="w-40 h-48 relative group cursor-pointer"
       >
         <div className="w-full h-full rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#1e3a5f] group-hover:bg-[#1e3a5f]/5">
           {currentPhoto ? (
             <img src={`${currentPhoto}?t=${Date.now()}`} alt="Profile" className="w-full h-full object-cover" />
           ) : (
             <Camera className="w-10 h-10 text-slate-300" />
           )}
           
           {/* Overlay on hover */}
           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="w-8 h-8 text-white" />
           </div>
         </div>
         <p className="text-[10px] text-center mt-2 text-slate-400 font-bold uppercase tracking-widest">{label}</p>
         
         <input 
           type="file" 
           ref={fileInputRef} 
           className="hidden" 
           accept="image/*" 
           onChange={handleFileChange} 
         />
       </div>
 
       {/* Cropping Modal */}
       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
         <DialogContent className="max-w-[500px] bg-white">
           <DialogHeader>
             <DialogTitle>Crop Photo (3:4 Portrait)</DialogTitle>
           </DialogHeader>
           
           <div className="relative w-full h-[400px] bg-slate-900 rounded-lg overflow-hidden mt-4">
             {image && (
               <Cropper
                 image={image}
                 crop={crop}
                 zoom={zoom}
                 aspect={3 / 4}
                 onCropChange={setCrop}
                 onCropComplete={onCropComplete}
                 onZoomChange={setZoom}
               />
             )}
           </div>
 
           <div className="mt-4 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Zoom</span>
                <input 
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-[#1e3a5f]"
                />
              </div>
           </div>
 
           <DialogFooter className="mt-6 flex gap-2">
             <Button variant="outline" onClick={() => setIsModalOpen(false)}>
               Cancel
             </Button>
             <Button 
               onClick={handleUpload} 
               disabled={uploading}
               className="bg-[#1e3a5f] hover:bg-[#162a45] text-white"
             >
               {uploading ? "Processing..." : "Save & Upload"}
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
     </div>
   );
 }
