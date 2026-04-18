"use client";

import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";

export function BackButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()} 
      className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
      aria-label="Go back"
    >
      <IoMdClose className="h-6 w-6" />
    </button>
  );
}
