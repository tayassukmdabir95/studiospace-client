
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import {
  ArrowLeft,
  ArrowRight,
  Aperture,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  UserRound,
  Wifi,
  LoaderCircle,
  ImageOff,
} from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function StudioGallery({ studio }) {
  const candidates = [
    ...(Array.isArray(studio.images) ? studio.images : []),
    studio.imageURL,
    studio.imageUrl,
    studio.image,
  ];

  const images = [
    ...new Set(
      candidates
        .map((item) =>
          typeof item === "string" ? item : item?.url
        )
        .filter(Boolean)
    ),
  ];

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-2xl bg-[var(--accent)] text-[var(--primary)]">
        <ImageOff size={64} strokeWidth={1.3} />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-[#24231f]">
      <Swiper
        key={studio._id}
        modules={[Navigation, Pagination]}
        slidesPerView={1}
        navigation={images.length > 1}
        pagination={
          images.length > 1 ? { clickable: true } : false
        }
        className="studio-details-gallery"
      >
        {images.map((image, index) => (
          <SwiperSlide key={image}>
            <div className="aspect-[4/3] bg-[#24231f] sm:aspect-[16/9]">
              <img
                src={image}
                alt={`${studio.title} - image ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="container-shell section-space space-y-8">
      <div className="h-10 w-2/3 animate-pulse rounded-xl bg-[var(--accent)]" />
      <div className="aspect-[16/9] animate-pulse rounded-2xl bg-[var(--accent)]" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-72 animate-pulse rounded-2xl bg-[var(--accent)] lg:col-span-2" />
        <div className="h-72 animate-pulse rounded-2xl bg-[var(--accent)]" />
      </div>
    </div>
  );
}

export default function StudioDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    async function fetchStudio() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/api/studios/${encodeURIComponent(id)}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (response.status === 404) {
          throw new Error("Studio not found");
        }

        if (!response.ok) {
          throw new Error("Unable to load studio details");
        }

        const data = await response.json();
        const result = data.studio || data;

        if (!result || !result._id) {
          throw new Error("Invalid studio information");
        }

        if (!controller.signal.aborted) {
          setStudio(result);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Something went wrong");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchStudio();

    return () => controller.abort();
  }, [id, retryCount]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !studio) {
    return (
      <section className="container-shell flex min-h-[65vh] flex-col items-center justify-center py-16 text-center">
        <Aperture size={56} className="text-[var(--primary)]" />

        <h1 className="mt-6 text-3xl font-bold">
          Unable to display this studio
        </h1>

        <p className="mt-4 text-[var(--muted)]">
          {error || "Studio information is unavailable"}
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="button-primary"
          >
            Try Again
          </button>

          <Link href="/studios" className="button-secondary">
            Explore Studios
          </Link>
        </div>
      </section>
    );
  }

  const location =
    typeof studio.location === "string"
      ? studio.location
      : studio.location?.city || studio.address || "Not specified";

  const hourlyRate = Number(studio.hourlyRate);
  const deposit = Number(studio.securityDeposit);
  const rating = Number(studio.rating);

  const hasRating = Number.isFinite(rating) && rating > 0;
  const amenities = Array.isArray(studio.amenities)
    ? studio.amenities
    : [];

  const capacity = studio.maxCapacity;

  return (
    <main className="container-shell py-10 sm:py-14">
      <button
        type="button"
        onClick={() => router.push("/studios")}
        className="mb-8 flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--primary)]"
      >
        <ArrowLeft size={17} />
        Back to Explore Studios
      </button>

      <div className="mb-9">
        <span className="eyebrow">
          {studio.category || "CREATIVE WORKSPACE"}
        </span>

        <h1 className="mt-3 text-3xl font-bold tracking-[-0.055em] sm:text-5xl">
          {studio.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-[var(--muted)]">
          <span className="flex items-center gap-2">
            <MapPin size={17} className="text-[var(--primary)]" />
            {location}
          </span>

          <span className="flex items-center gap-2">
            <Star
              size={17}
              className="text-[var(--primary)]"
            />
            {hasRating ? rating.toFixed(1) : "New listing"}
          </span>

          <span className="flex items-center gap-2">
            <Users size={17} className="text-[var(--primary)]" />
            Up to {capacity || "—"} guests
          </span>
        </div>
      </div>

      <StudioGallery studio={studio} />

      <div className="mt-10 grid items-start gap-9 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-9">
          <section className="surface-card p-7 sm:p-9">
            <h2 className="text-2xl font-bold tracking-tight">
              About this Studio
            </h2>

            <p className="mt-5 whitespace-pre-line text-sm leading-8 text-[var(--muted)] sm:text-base">
              {studio.description ||
                studio.overview ||
                "The host has not added an overview yet."}
            </p>

            <div className="mt-8 grid gap-4 border-t border-[var(--border)] pt-7 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Users size={22} className="text-[var(--primary)]" />
                <div>
                  <p className="text-xs text-[var(--muted)]">
                    Maximum Capacity
                  </p>
                  <p className="mt-1 font-semibold">
                    {capacity || "Not specified"} guests
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock3 size={22} className="text-[var(--primary)]" />
                <div>
                  <p className="text-xs text-[var(--muted)]">
                    Rental Pricing
                  </p>
                  <p className="mt-1 font-semibold">
                    Hourly booking
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="surface-card p-7 sm:p-9">
            <h2 className="text-2xl font-bold tracking-tight">
              Studio Amenities
            </h2>

            {amenities.length > 0 ? (
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                {amenities.map((amenity, index) => (
                  <div key={`${amenity}-${index}`} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--primary)]">
                      {amenity.toLowerCase().includes("wifi") ? (
                        <Wifi size={19} />
                      ) : (
                        <CheckCircle2 size={19} />
                      )}
                    </div>

                    <span className="text-sm font-medium">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-[var(--muted)]">
                No amenities have been listed yet.
              </p>
            )}
          </section>

          <section className="surface-card p-7 sm:p-9">
            <h2 className="text-2xl font-bold tracking-tight">
              Meet Your Host
            </h2>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-15 w-15 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--primary)]">
                <UserRound size={28} />
              </div>

              <div>
                <p className="text-lg font-bold">
                  {studio.ownerName || "Studio Host"}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  StudioSpace host
                </p>
              </div>
            </div>

            <p className="mt-6 text-sm leading-7 text-[var(--muted)]">
              Review the studio specifications and available
              amenities before submitting a reservation request.
            </p>
          </section>

          <section className="surface-card p-7 sm:p-9">
            <h2 className="text-2xl font-bold tracking-tight">
              Guest Reviews
            </h2>

            <div className="mt-6 rounded-xl bg-[var(--accent)] p-6 text-center">
              <Star
                size={30}
                className="mx-auto text-[var(--primary)]"
              />

              <h3 className="mt-3 font-bold">
                Reviews coming soon
              </h3>

              <p className="mt-2 text-sm text-[var(--muted)]">
                Guest reviews have not been added for this studio yet.
              </p>
            </div>
          </section>
        </div>

        <aside className="surface-card p-7 lg:sticky lg:top-28">
          <div className="mb-6 border-b border-[var(--border)] pb-6">
            <p className="text-xs text-[var(--muted)]">
              Studio rental price
            </p>

            <div className="mt-2 flex items-end gap-2">
              <span className="text-4xl font-bold tracking-tight text-[var(--primary)]">
                {Number.isFinite(hourlyRate)
                  ? `$${hourlyRate.toLocaleString()}`
                  : "Ask host"}
              </span>

              {Number.isFinite(hourlyRate) && (
                <span className="pb-1 text-sm text-[var(--muted)]">
                  / hour
                </span>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 text-[var(--muted)]">
                <ShieldCheck size={18} />
                Security Deposit
              </span>

              <span className="font-bold">
                {Number.isFinite(deposit)
                  ? `$${deposit.toLocaleString()}`
                  : "Not specified"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 text-[var(--muted)]">
                <Users size={18} />
                Maximum Capacity
              </span>

              <span className="font-bold">
                {capacity || "—"} people
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 text-[var(--muted)]">
                <MapPin size={18} />
                Location
              </span>

              <span className="max-w-40 text-right font-semibold">
                {location}
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled
            className="button-primary mt-8 w-full cursor-not-allowed opacity-60"
            title="Booking will be enabled in the next step"
          >
            <CalendarDays size={18} />
            Book Workspace Now
            <ArrowRight size={17} />
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-[var(--muted)]">
            Booking will be enabled when we connect the reservation form.
          </p>
        </aside>
      </div>
    </main>
  );
}
