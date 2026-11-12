"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function GoogleLoginButton() {
  const router = useRouter();
  const { googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleSuccess(response) {
    if (!response.credential) {
      toast.error("Google did not return a valid credential");
      return;
    }

    setLoading(true);

    try {
      await googleLogin(response.credential);

      toast.success("Successfully signed in with Google!");

      const params = new URLSearchParams(window.location.search);
      const requestedPath = params.get("next");

      const destination =
        requestedPath?.startsWith("/") &&
        !requestedPath.startsWith("//") &&
        !requestedPath.startsWith("/\\")
          ? requestedPath
          : "/";

      router.replace(destination);
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      {loading ? (
        <div className="flex items-center gap-2 py-3 text-sm text-[var(--muted)]">
          <LoaderCircle size={18} className="animate-spin" />
          Signing in with Google...
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => toast.error("Google sign-in was unsuccessful")}
          theme="outline"
          size="large"
          text="continue_with"
          shape="pill"
          width="300"
        />
      )}
    </div>
  );
}