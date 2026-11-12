"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, pathname, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center gap-4">
        <LoaderCircle
          size={38}
          className="animate-spin text-[var(--primary)]"
        />
        <p className="text-sm text-[var(--muted)]">
          {loading ? "Checking your session..." : "Redirecting to login..."}
        </p>
      </div>
    );
  }

  return children;
}