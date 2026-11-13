
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  X,
  CalendarDays,
  Clock3,
  ShieldCheck,
  LoaderCircle,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";

function getLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function timeToMinutes(time) {
  if (!time) return 0;

  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export default function BookingModal({ studio, onClose }) {
  const router = useRouter();
  const { user } = useAuth();

  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [today, setToday] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const hourlyRate = Number(studio.hourlyRate) || 0;
  const securityDeposit = Number(studio.securityDeposit) || 0;

  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  const duration = (endMinutes - startMinutes) / 60;
  const validDuration = startTime && endTime && duration > 0;
  const rentalCost = validDuration ? duration * hourlyRate : 0;

  useEffect(() => {
    setToday(getLocalDate());

    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  async function handleBooking(event) {
    event.preventDefault();

    if (!user) {
      toast.error("Please log in to book a studio");
      onClose();

      router.push(
        `/login?next=${encodeURIComponent(`/studios/${studio._id}`)}`
      );

      return;
    }

    if (!bookingDate || !startTime || !endTime) {
      toast.error("Please complete all booking fields");
      return;
    }

    const currentDate = getLocalDate();

    if (bookingDate < currentDate) {
      toast.error("Please select today or a future date");
      return;
    }

    if (!validDuration) {
      toast.error("End time must be later than start time");
      return;
    }

    if (bookingDate === currentDate) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      if (startMinutes <= currentMinutes) {
        toast.error("Please select a future starting time");
        return;
      }
    }

    if (!Number.isFinite(hourlyRate) || hourlyRate <= 0) {
      toast.error("This studio does not have a valid hourly rate");
      return;
    }

    setSubmitting(true);

    try {
      await apiRequest("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          studioId: studio._id,
          bookingDate,
          startTime,
          endTime,
        }),
      });

      toast.success("Booking requested successfully!");
      onClose();
      router.push("/my-bookings");
    } catch (error) {
      toast.error(error.message || "Unable to create booking");
    } finally {
      setSubmitting(false);
    }
  }

  const location =
    typeof studio.location === "string"
      ? studio.location
      : studio.location?.city || studio.address || "Location not specified";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close booking dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl sm:p-9"
      >
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <span className="eyebrow">RESERVE YOUR SPACE</span>

            <h2
              id="booking-modal-title"
              className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Book This Studio
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--foreground)]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-7 rounded-xl bg-[var(--accent)] p-5">
          <h3 className="text-base font-bold">
            {studio.title}
          </h3>

          <p className="mt-2 flex items-center gap-2 text-xs text-[var(--muted)]">
            <MapPin size={15} />
            {location}
          </p>

          <p className="mt-4 text-xl font-bold text-[var(--primary)]">
            ${hourlyRate.toLocaleString()}
            <span className="ml-1 text-xs font-medium text-[var(--muted)]">
              / hour
            </span>
          </p>
        </div>

        <form onSubmit={handleBooking} className="space-y-5">
          <div>
            <label
              htmlFor="booking-date"
              className="mb-2 flex items-center gap-2 text-sm font-semibold"
            >
              <CalendarDays size={17} className="text-[var(--primary)]" />
              Booking Date
            </label>

            <input
              id="booking-date"
              type="date"
              min={today || undefined}
              value={bookingDate}
              onChange={(event) => setBookingDate(event.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="start-time"
                className="mb-2 flex items-center gap-2 text-sm font-semibold"
              >
                <Clock3 size={17} className="text-[var(--primary)]" />
                Start Time
              </label>

              <input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label
                htmlFor="end-time"
                className="mb-2 flex items-center gap-2 text-sm font-semibold"
              >
                <Clock3 size={17} className="text-[var(--primary)]" />
                End Time
              </label>

              <input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          {startTime && endTime && !validDuration && (
            <p className="text-sm text-red-500">
              End time must be later than start time.
            </p>
          )}

          <div className="space-y-4 rounded-xl border border-[var(--border)] p-5">
            <h3 className="font-bold">Price Summary</h3>

            <div className="flex justify-between gap-3 text-sm">
              <span className="text-[var(--muted)]">
                Rental duration
              </span>

              <span className="font-semibold">
                {validDuration ? `${duration} hours` : "—"}
              </span>
            </div>

            <div className="flex justify-between gap-3 text-sm">
              <span className="text-[var(--muted)]">
                Hourly rate
              </span>

              <span className="font-semibold">
                ${hourlyRate.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between gap-3 text-sm">
              <span className="text-[var(--muted)]">
                Security deposit
              </span>

              <span className="font-semibold">
                ${securityDeposit.toLocaleString()}
              </span>
            </div>

            <div className="border-t border-[var(--border)] pt-4">
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold">
                  Estimated Rental Total
                </span>

                <span className="text-2xl font-bold text-[var(--primary)]">
                  ${rentalCost.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                Security deposit is displayed separately and is not
                included in the estimated rental total.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-[var(--accent)] p-4">
            <ShieldCheck
              size={20}
              className="shrink-0 text-[var(--primary)]"
            />

            <p className="text-xs leading-6 text-[var(--muted)]">
              Your reservation will initially have Pending status.
              Confirmed bookings may make a selected time slot unavailable.
              No payment is collected by this form.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting || !validDuration || !bookingDate}
            className="button-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Submitting Booking...
              </>
            ) : (
              <>
                Request Booking
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
