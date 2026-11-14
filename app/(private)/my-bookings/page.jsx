
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Aperture,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import CancelBookingModal from "@/components/bookings/CancelBookingModal";

const statusStyles = {
  Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Confirmed: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Completed: "bg-green-500/10 text-green-600 dark:text-green-400",
  Cancelled: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
};

const filters = [
  "All",
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

function formatDate(dateString) {
  if (!dateString) return "Date unavailable";

  const parts = String(dateString).split("-");

  if (parts.length !== 3) return dateString;

  const [year, month, day] = parts.map(Number);

  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function BookingSkeleton() {
  return (
    <div className="surface-card space-y-5 p-7">
      <div className="flex items-center justify-between">
        <div className="h-7 w-2/3 animate-pulse rounded bg-[var(--accent)]" />
        <div className="h-7 w-20 animate-pulse rounded-full bg-[var(--accent)]" />
      </div>

      <div className="h-4 w-1/2 animate-pulse rounded bg-[var(--accent)]" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--accent)]" />
      <div className="h-11 w-full animate-pulse rounded bg-[var(--accent)]" />
    </div>
  );
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All");
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBookings() {
      setLoading(true);
      setError("");

      try {
        const [bookingData, studioData] = await Promise.all([
          apiRequest("/api/bookings", {
            signal: controller.signal,
          }),
          apiRequest("/api/studios", {
            signal: controller.signal,
          }),
        ]);

        const bookingResults = Array.isArray(bookingData)
          ? bookingData
          : bookingData.bookings;

        const studioResults = Array.isArray(studioData)
          ? studioData
          : studioData.studios;

        if (!Array.isArray(bookingResults)) {
          throw new Error("Invalid booking data received");
        }

        const studioMap = new Map(
          (Array.isArray(studioResults) ? studioResults : []).map(
            (studio) => [String(studio._id), studio]
          )
        );

        const enrichedBookings = bookingResults.map((booking) => {
          const studioId = String(booking.studioId || "");
          const studio = studioMap.get(studioId);

          return {
            ...booking,
            studioTitle:
              booking.studioTitle ||
              studio?.title ||
              "Studio Reservation",
            studioLocation:
              booking.studioLocation ||
              (typeof studio?.location === "string"
                ? studio.location
                : studio?.location?.city || studio?.address || ""),
          };
        });

        enrichedBookings.sort((a, b) => {
          const dateA = `${a.bookingDate || ""}T${a.startTime || "00:00"}`;
          const dateB = `${b.bookingDate || ""}T${b.startTime || "00:00"}`;
          return dateB.localeCompare(dateA);
        });

        if (!controller.signal.aborted) {
          setBookings(enrichedBookings);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Unable to load bookings");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadBookings();

    return () => controller.abort();
  }, [retryCount]);

  const statusCounts = useMemo(() => {
    return {
      All: bookings.length,
      Pending: bookings.filter((b) => b.status === "Pending").length,
      Confirmed: bookings.filter((b) => b.status === "Confirmed").length,
      Completed: bookings.filter((b) => b.status === "Completed").length,
      Cancelled: bookings.filter((b) => b.status === "Cancelled").length,
    };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    if (activeFilter === "All") return bookings;

    return bookings.filter(
      (booking) => booking.status === activeFilter
    );
  }, [bookings, activeFilter]);

  const closeCancelModal = useCallback(() => {
    if (!cancelling) {
      setBookingToCancel(null);
    }
  }, [cancelling]);

  async function handleCancelBooking() {
    if (!bookingToCancel || cancelling) return;

    const bookingId = bookingToCancel._id;
    setCancelling(true);

    try {
      await apiRequest(
        `/api/bookings/${encodeURIComponent(bookingId)}/cancel`,
        {
          method: "PATCH",
        }
      );

      setBookings((previous) =>
        previous.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "Cancelled" }
            : booking
        )
      );

      setBookingToCancel(null);
      toast.success("Booking cancelled successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to cancel booking");
      setRetryCount((count) => count + 1);
    } finally {
      setCancelling(false);
    }
  }

  return (
    <section className="container-shell section-space min-h-[65vh]">
      <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Aperture
              size={19}
              className="text-[var(--primary)]"
            />

            <span className="eyebrow">YOUR RESERVATIONS</span>
          </div>

          <h1 className="display-title">
            My{" "}
            <span className="text-[var(--primary)]">
              Bookings
            </span>
          </h1>

          <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
            Track your reservations and manage upcoming studio sessions.
          </p>
        </div>

        <Link href="/studios" className="button-primary self-start">
          Explore Studios
          <ArrowUpRight size={17} />
        </Link>
      </div>

      {!loading && !error && (
        <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              label: "Total Bookings",
              count: statusCounts.All,
              icon: CalendarDays,
            },
            {
              label: "Pending",
              count: statusCounts.Pending,
              icon: Clock3,
            },
            {
              label: "Confirmed",
              count: statusCounts.Confirmed,
              icon: CheckCircle2,
            },
            {
              label: "Completed",
              count: statusCounts.Completed,
              icon: Aperture,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="surface-card p-5 sm:p-6"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--primary)]">
                  <Icon size={21} />
                </div>

                <p className="text-3xl font-bold">
                  {item.count}
                </p>

                <p className="mt-2 text-xs text-[var(--muted)]">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
              className={`rounded-full border px-4 py-2.5 text-xs font-semibold transition-colors ${
                activeFilter === filter
                  ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--primary)]"
              }`}
            >
              {filter} ({statusCounts[filter]})
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <BookingSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="surface-card flex flex-col items-center p-12 text-center">
          <XCircle
            size={42}
            className="text-[var(--primary)]"
          />

          <h2 className="mt-5 text-xl font-bold">
            Unable to load bookings
          </h2>

          <p className="mt-3 text-sm text-[var(--muted)]">
            {error}
          </p>

          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="button-primary mt-6"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="surface-card flex flex-col items-center px-6 py-16 text-center">
          <CalendarDays
            size={48}
            className="text-[var(--primary)]"
          />

          <h2 className="mt-6 text-2xl font-bold">
            No bookings yet
          </h2>

          <p className="mt-4 max-w-md text-sm leading-7 text-[var(--muted)]">
            Discover creative studios and reserve your first
            workspace to get started.
          </p>

          <Link href="/studios" className="button-primary mt-7">
            Find Your Studio
            <ArrowUpRight size={17} />
          </Link>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="surface-card flex flex-col items-center px-6 py-14 text-center">
          <Search
            size={40}
            className="text-[var(--primary)]"
          />

          <h2 className="mt-5 text-xl font-bold">
            No {activeFilter.toLowerCase()} bookings
          </h2>

          <button
            type="button"
            onClick={() => setActiveFilter("All")}
            className="button-secondary mt-6"
          >
            View All Bookings
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredBookings.map((booking) => {
            const status = booking.status || "Pending";
            const totalPrice = Number(booking.totalPrice);

            return (
              <article
                key={booking._id}
                className="surface-card flex h-full flex-col p-6 sm:p-7"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-wide text-[var(--primary)]">
                      STUDIO RESERVATION
                    </p>

                    <h2 className="mt-2 text-xl font-bold leading-7">
                      {booking.studioTitle}
                    </h2>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
                      statusStyles[status] ||
                      "bg-[var(--accent)] text-[var(--primary)]"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <CalendarDays
                      size={18}
                      className="shrink-0 text-[var(--primary)]"
                    />

                    <span>
                      {formatDate(booking.bookingDate)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Clock3
                      size={18}
                      className="shrink-0 text-[var(--primary)]"
                    />

                    <span>
                      {booking.startTime} – {booking.endTime}
                    </span>
                  </div>

                  {booking.studioLocation && (
                    <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
                      <MapPin
                        size={18}
                        className="shrink-0 text-[var(--primary)]"
                      />

                      <span>{booking.studioLocation}</span>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-7">
                  <div className="flex items-center justify-between border-t border-[var(--border)] pt-5">
                    <div>
                      <p className="text-xs text-[var(--muted)]">
                        Rental Total
                      </p>

                      <p className="mt-1 text-2xl font-bold text-[var(--primary)]">
                        {Number.isFinite(totalPrice)
                          ? `$${totalPrice.toLocaleString()}`
                          : "Unavailable"}
                      </p>
                    </div>

                    {booking.studioId && (
                      <Link
                        href={`/studios/${booking.studioId}`}
                        className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)]"
                      >
                        View Studio
                        <ArrowUpRight size={16} />
                      </Link>
                    )}
                  </div>

                  {status === "Pending" && (
                    <button
                      type="button"
                      onClick={() => setBookingToCancel(booking)}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-red-500/30 px-5 py-3.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/10"
                    >
                      <Trash2 size={17} />
                      Cancel Booking
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {bookingToCancel && (
        <CancelBookingModal
          booking={bookingToCancel}
          cancelling={cancelling}
          onClose={closeCancelModal}
          onConfirm={handleCancelBooking}
        />
      )}
    </section>
  );
}
