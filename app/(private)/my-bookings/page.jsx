
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  MapPin,
  LoaderCircle,
  ArrowUpRight,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadBookings() {
      try {
        const data = await apiRequest("/api/bookings");
        const results = Array.isArray(data) ? data : data.bookings;

        if (!Array.isArray(results)) {
          throw new Error("Invalid booking data received");
        }

        if (active) {
          setBookings(results);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to load bookings");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadBookings();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="container-shell section-space min-h-[65vh]">
      <span className="eyebrow">YOUR RESERVATIONS</span>

      <h1 className="mt-4 text-4xl font-bold tracking-tight">
        My <span className="text-[var(--primary)]">Bookings</span>
      </h1>

      <p className="mt-4 text-sm text-[var(--muted)]">
        View your studio reservations and booking status.
      </p>

      {loading ? (
        <div className="mt-14 flex items-center justify-center gap-3">
          <LoaderCircle
            size={26}
            className="animate-spin text-[var(--primary)]"
          />
          <span className="text-sm text-[var(--muted)]">
            Loading your bookings...
          </span>
        </div>
      ) : error ? (
        <div className="surface-card mt-10 p-8 text-center">
          <p className="font-semibold">
            Unable to load bookings
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {error}
          </p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="surface-card mt-10 flex flex-col items-center p-12 text-center">
          <CalendarDays
            size={42}
            className="text-[var(--primary)]"
          />

          <h2 className="mt-5 text-xl font-bold">
            No bookings yet
          </h2>

          <p className="mt-3 text-sm text-[var(--muted)]">
            Explore creative studios and reserve your first workspace.
          </p>

          <Link href="/studios" className="button-primary mt-6">
            Explore Studios
            <ArrowUpRight size={17} />
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="surface-card p-6 sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-bold">
                  {booking.studioTitle || "Studio Booking"}
                </h2>

                <span className="rounded-full bg-[var(--accent)] px-3 py-1.5 text-xs font-bold text-[var(--primary)]">
                  {booking.status || "Pending"}
                </span>
              </div>

              <div className="mt-6 space-y-3 text-sm text-[var(--muted)]">
                <p className="flex items-center gap-2">
                  <CalendarDays size={17} />
                  {booking.bookingDate}
                </p>

                <p className="flex items-center gap-2">
                  <Clock3 size={17} />
                  {booking.startTime} – {booking.endTime}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-5">
                <div>
                  <p className="text-xs text-[var(--muted)]">
                    Rental total
                  </p>

                  <p className="mt-1 text-xl font-bold text-[var(--primary)]">
                    ${Number(booking.totalPrice || 0).toLocaleString()}
                  </p>
                </div>

                <Link
                  href={`/studios/${booking.studioId}`}
                  className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)]"
                >
                  View Studio
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
