"use client";

import { IoCopyOutline } from "react-icons/io5";
import { toast } from "sonner";

export function CopyButton({ text }: { text: string }) {
  const handleCopy = () => {
    if (!text || text === "--") return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard", {
      duration: 1500,
      position: "bottom-center",
      style: {
        background: "#29b8d8",
        color: "#000",
        border: "none",
        fontWeight: "bold",
        borderRadius: "20px",
      }
    });
  };

  return (
    <button 
      onClick={handleCopy} 
      className="text-gray-600 hover:text-white transition-colors p-1"
      aria-label="Copy to clipboard"
    >
      <IoCopyOutline className="w-5 h-5" />
    </button>
  );
}
