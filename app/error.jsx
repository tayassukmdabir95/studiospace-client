
"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Aperture,
} from "lucide-react";

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error("StudioSpace route error:", error);
  }, [error]);

  return (
    <main className="container-shell flex min-h-[65vh] items-center justify-center px-5 py-20">
      <div className="w-full max-w-xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10 text-red-500">
          <AlertTriangle size={38} />
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-[var(--primary)]">
          <Aperture size={18} />

          <span className="text-xs font-bold tracking-[0.18em]">
            STUDIOSPACE
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-tight">
          Something went wrong.
        </h1>

        <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
          We couldn't complete your request.
          Please try again, or return to the homepage.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="button-primary"
          >
            <RefreshCw size={17} />
            Try Again
          </button>

          <Link
            href="/"
            className="button-secondary"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
