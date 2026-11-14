
"use client";

import { useEffect } from "react";
import {
  AlertTriangle,
  CalendarDays,
  LoaderCircle,
  X,
} from "lucide-react";

export default function CancelBookingModal({
  booking,
  cancelling,
  onClose,
  onConfirm,
}) {
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape" && !cancelling) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [cancelling, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        disabled={cancelling}
        onClick={onClose}
        aria-label="Close cancellation dialog"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="cancel-title"
        aria-describedby="cancel-description"
        className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-2xl sm:p-9"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={cancelling}
          aria-label="Close dialog"
          className="absolute top-5 right-5 text-[var(--muted)] disabled:opacity-50"
        >
          <X size={20} />
        </button>

        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
          <AlertTriangle size={27} />
        </div>

        <h2
          id="cancel-title"
          className="text-2xl font-bold tracking-tight"
        >
          Cancel this booking?
        </h2>

        <p
          id="cancel-description"
          className="mt-4 text-sm leading-7 text-[var(--muted)]"
        >
          You're about to cancel your studio reservation for{" "}
          <strong className="text-[var(--foreground)]">
            {booking.bookingDate}
          </strong>.
          This action cannot be undone.
        </p>

        <div className="mt-6 flex items-center gap-3 rounded-xl bg-[var(--accent)] p-4">
          <CalendarDays
            size={20}
            className="text-[var(--primary)]"
          />

          <div>
            <p className="text-sm font-semibold">
              {booking.studioTitle || "Studio Reservation"}
            </p>

            <p className="mt-1 text-xs text-[var(--muted)]">
              {booking.startTime} – {booking.endTime}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            disabled={cancelling}
            className="button-secondary flex-1 disabled:opacity-50"
          >
            Keep Booking
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={cancelling}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {cancelling ? (
              <>
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                />
                Cancelling...
              </>
            ) : (
              "Cancel Booking"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
