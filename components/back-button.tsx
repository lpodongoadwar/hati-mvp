"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton({ fallbackHref = "/dashboard", label = "Back" }) {
  const router = useRouter();

  const handleBack = () => {
    // If the user has a history in this session, go back
    if (window.history.length > 2) {
      router.back();
    } else {
      // If they landed directly on this page (e.g., from an email link), send them to the fallback
      router.push(fallbackHref);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft className="mr-2 size-4" /> {label}
    </button>
  );
}