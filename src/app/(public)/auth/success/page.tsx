// page.tsx
"use client";

import AuthSuccessPage from "@/components/success";
import { Loader2 } from "lucide-react";
import React, { Suspense } from "react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium">Logging you in...</p>
          </div>
        </div>
      }
    >
      <AuthSuccessPage />
    </Suspense>
  );
}
