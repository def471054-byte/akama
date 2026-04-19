"use client";

import { useState, useEffect } from "react";
import CloudflareVerification from "./c-loader";

interface LoadingIllusionProps {
  children: React.ReactNode;
}

export default function LoadingIllusion({ children }: LoadingIllusionProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // 5 second delay as requested
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!showContent) {
    return (
      <div dir="ltr" className="w-full flex items-center justify-center py-20 animate-in fade-in duration-500">
        <CloudflareVerification />
      </div>
    );
  }

  return <>{children}</>;
}
