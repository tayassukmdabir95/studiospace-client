
import { Suspense } from "react";
import EditStudioClient from "./EditStudioClient";

function EditStudioLoading() {
  return (
    <div className="container-shell flex min-h-[65vh] flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]" />

      <p className="text-sm font-medium text-[var(--muted)]">
        Preparing studio editor...
      </p>
    </div>
  );
}

export default function EditStudioPage() {
  return (
    <Suspense fallback={<EditStudioLoading />}>
      <EditStudioClient />
    </Suspense>
  );
}
