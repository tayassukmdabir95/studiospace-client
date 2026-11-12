"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Star,
  Aperture,
  LoaderCircle,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function StudioCard({ studio }) {
  const image =
    studio.imageURL ||
    studio.imageUrl ||
    studio.image ||
    studio.images?.[0] ||
    "";

  const imageUrl =
    typeof image === "string"
      ? image
      : image?.url || "";

  const rate =
    studio.hourlyRate ??
    studio.hourly_rate ??
    studio.pricePerHour;

  const rating = studio.rating;

  const location =
    typeof studio.location === "string"
      ? studio.location
      : studio.location?.city ||
        studio.address ||
        "Location not specified";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link
        href={`/studios/${studio._id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-[var(--accent)]"
        aria-label={`View ${studio.title}`}
      >
        {imageUrl ? (
          <div
            role="img"
            aria-label={studio.title || "Creative studio"}
            className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage: `url("${imageUrl}")`,
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--primary)]">
            <Aperture size={58} strokeWidth={1.2} />
          </div>
        )}

        <span className="absolute top-4 left-4 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#24231f] shadow-sm">
          {studio.category || "Creative Space"}
        </span>

        {rating !== undefined &&
          rating !== null &&
          Number.isFinite(Number(rating)) && (
            <span className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-bold text-[#24231f] shadow-sm">
              <Star
                size={13}
                fill="#e77b42"
                color="#e77b42"
              />
              {Number(rating).toFixed(1)}
            </span>
          )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-2 text-sm text-[var(--muted)]">
          <MapPin size={15} />
          <span className="truncate">{location}</span>
        </div>

        <Link href={`/studios/${studio._id}`}>
          <h3 className="line-clamp-2 min-h-14 text-xl font-bold leading-7 tracking-tight transition-colors group-hover:text-[var(--primary)]">
            {studio.title || "Untitled Studio"}
          </h3>
        </Link>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-[var(--border)] pt-5">
          <div>
            <p className="mb-1 text-xs text-[var(--muted)]">
              Starting from
            </p>

            <p className="text-xl font-bold text-[var(--primary)]">
              {rate !== undefined && rate !== null
                ? `$${Number(rate).toLocaleString()}`
                : "Ask host"}

              {rate !== undefined && rate !== null && (
                <span className="ml-1 text-xs font-medium text-[var(--muted)]">
                  / hr
                </span>
              )}
            </p>
          </div>

          <Link
            href={`/studios/${studio._id}`}
            aria-label={`View details for ${studio.title}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--primary)] transition-colors hover:bg-[var(--primary)] hover:text-white"
          >
            <ArrowUpRight size={20} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function StudioSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="aspect-[4/3] animate-pulse bg-[var(--accent)]" />

      <div className="space-y-4 p-6">
        <div className="h-4 w-1/2 animate-pulse rounded bg-[var(--accent)]" />
        <div className="h-7 w-4/5 animate-pulse rounded bg-[var(--accent)]" />
        <div className="h-7 w-2/3 animate-pulse rounded bg-[var(--accent)]" />
        <div className="mt-6 h-11 animate-pulse rounded bg-[var(--accent)]" />
      </div>
    </div>
  );
}

export default function FeaturedStudios() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchFeaturedStudios() {
      try {
        const response = await fetch(
          `${API_URL}/api/studios/featured`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Unable to load featured studios");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid studio response");
        }

        setStudios(data);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchFeaturedStudios();

    return () => controller.abort();
  }, []);

  return (
    <section className="section-space">
      <div className="container-shell">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow">DISCOVER YOUR NEXT SPACE</span>

            <h2 className="mt-4 text-4xl font-bold tracking-[-0.055em] sm:text-5xl">
              Featured{" "}
              <span className="text-[var(--primary)]">
                Studios
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
              Explore our latest creative spaces, designed to
              help bring your next big idea to life.
            </p>
          </div>

          <Link
            href="/studios"
            className="button-secondary self-start md:self-auto"
          >
            Explore All Studios
            <ArrowRight size={17} className="ml-2" />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <StudioSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">
            <LoaderCircle
              size={36}
              className="mb-5 text-[var(--primary)]"
            />

            <h3 className="text-xl font-bold">
              Unable to load studios
            </h3>

            <p className="mt-3 text-sm text-[var(--muted)]">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="button-primary mt-6"
            >
              Try Again
            </button>
          </div>
        ) : studios.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--primary)]">
              <Aperture size={37} />
            </div>

            <h3 className="text-2xl font-bold">
              No studios listed yet
            </h3>

            <p className="mt-4 max-w-md text-sm leading-7 text-[var(--muted)]">
              Be among the first creators to share an inspiring
              workspace with the StudioSpace community.
            </p>

            <Link href="/add-studio" className="button-primary mt-7">
              List Your Studio
              <ArrowUpRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <StudioCard
                key={studio._id}
                studio={studio}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}