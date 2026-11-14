
"use client";

import { AlertTriangle, LoaderCircle, Trash2, X } from "lucide-react";
import { useEffect } from "react";

export default function DeleteStudioModal({
  studio,
  deleting,
  onClose,
  onConfirm,
}) {
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape" && !deleting) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [deleting, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
        className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-2xl sm:p-9"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={deleting}
          aria-label="Close dialog"
          className="absolute top-5 right-5 text-[var(--muted)] disabled:opacity-40"
        >
          <X size={20} />
        </button>

        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
          <AlertTriangle size={28} />
        </div>

        <h2
          id="delete-modal-title"
          className="text-2xl font-bold tracking-tight"
        >
          Delete this studio?
        </h2>

        <p
          id="delete-modal-description"
          className="mt-4 text-sm leading-7 text-[var(--muted)]"
        >
          You are about to permanently delete{" "}
          <strong className="text-[var(--foreground)]">
            {studio.title}
          </strong>
          . This action cannot be undone.
        </p>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="button-secondary flex-1 disabled:opacity-50"
          >
            Keep Studio
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? (
              <>
                <LoaderCircle size={17} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={17} />
                Delete Studio
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
