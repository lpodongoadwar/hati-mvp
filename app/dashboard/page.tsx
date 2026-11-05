"use client";

import { Suspense } from "react";
import { DashboardContent } from "@/components/dashboard-content";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}