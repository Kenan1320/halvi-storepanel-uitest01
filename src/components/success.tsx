"use client";

import { useEffect } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "cookies-next/client";
import { Loader2 } from "lucide-react";

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  useEffect(() => {
    if (!token) {
      redirect("/login");
    } else {
      setCookie("token", token);
      redirect("/");
    }
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg font-medium">Logging you in...</p>
      </div>
    </div>
  );
}
