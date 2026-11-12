
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Aperture,
  ArrowRight,
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  LoaderCircle,
} from "lucide-react";
import StudioCard from "./StudioCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const categories = [
  { label: "All Categories", value: "" },
  { label: "Photo Studios", value: "Photo Studio" },
  { label: "Sound Stages", value: "Film Stage" },
  { label: "Podcast Rooms", value: "Podcast Lounge" },
  { label: "Music Suites", value: "Music Suite" },
  { label: "Art Workshops", value: "Workshop" },
];

function StudioSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="aspect-[4/3] animate-pulse bg-[var(--accent)]" />

      <div className="space-y-4 p-6">
        <div className="h-4 w-1/2 animate-pulse rounded bg-[var(--accent)]" />
        <div className="h-7 w-4/5 animate-pulse rounded bg-[var(--accent)]" />
        <div className="h-7 w-2/3 animate-pulse rounded bg-[var(--accent)]" />
        <div className="mt-6 h-10 animate-pulse rounded bg-[var(--accent)]" />
      </div>
    </div>
  );
}

export default function ExploreStudios() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category") || "";

  const [studios, setStudios] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStudios() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_URL}/api/studios`, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load studios from the server");
        }

        const data = await response.json();
        const results = Array.isArray(data) ? data : data.studios;

        if (!Array.isArray(results)) {
          throw new Error("Invalid studio data received");
        }

        if (!controller.signal.aborted) {
          setStudios(results);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Unable to load studios");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadStudios();

    return () => controller.abort();
  }, [retryCount]);

  const filteredStudios = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return studios.filter((studio) => {
      const categoryMatches =
        !selectedCategory ||
        String(studio.category || "").toLowerCase() ===
          selectedCategory.toLowerCase();

      const location =
        typeof studio.location === "string"
          ? studio.location
          : studio.location?.city || studio.address || "";

      const searchableText = [
        studio.title,
        studio.category,
        location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const searchMatches =
        !keyword || searchableText.includes(keyword);

      return categoryMatches && searchMatches;
    });
  }, [studios, selectedCategory, search]);

  function handleCategoryChange(event) {
    const category = event.target.value;

    if (category) {
      router.replace(`/studios?category=${encodeURIComponent(category)}`, {
        scroll: false,
      });
    } else {
      router.replace("/studios", { scroll: false });
    }
  }

  function clearFilters() {
    setSearch("");
    router.replace("/studios", { scroll: false });
  }

  return (
    <>
      <section className="relative overflow-hidden bg-[#24231f] py-20 text-white sm:py-24">
        <div className="pointer-events-none absolute -top-40 -right-20 h-80 w-80 rounded-full bg-[#e77b42]/15 blur-3xl" />

        <div className="container-shell relative z-10">
          <div className="mb-5 flex items-center gap-2 text-[#f08a50]">
            <Aperture size={18} />
            <span className="text-xs font-bold tracking-[0.18em]">
              THE CREATIVE MARKETPLACE
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-[-0.06em] sm:text-5xl lg:text-6xl">
            Find your perfect
            <span className="text-[#f08a50]"> creative space.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/65">
            From photography studios to music suites and podcast
            lounges, discover the right space for your next project.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-white/60">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ArrowRight size={14} />
            <span className="text-[#f08a50]">Explore Studios</span>
          </div>
        </div>
      </section>

      <section className="section-space min-h-[65vh]">
        <div className="container-shell">
          <div className="mb-9 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <SlidersHorizontal size={20} className="text-[var(--primary)]" />
              <h2 className="text-lg font-bold">Find a Workspace</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_260px_auto] md:items-end">
              <div>
                <label htmlFor="studio-search" className="mb-2 block text-sm font-semibold">
                  Search Studios
                </label>

                <div className="relative">
                  <Search
                    size={18}
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--muted)]"
                  />

                  <input
                    id="studio-search"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by name, category or location"
                    className="input-field pl-11"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="studio-category" className="mb-2 block text-sm font-semibold">
                  Category
                </label>

                <div className="relative">
                  <Filter
                    size={17}
                    className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--muted)]"
                  />

                  <select
                    id="studio-category"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="input-field pl-11"
                  >
                    {!categories.some((category) => category.value === selectedCategory) &&
                      selectedCategory && (
                        <option value={selectedCategory}>
                          {selectedCategory}
                        </option>
                      )}

                    {categories.map((category) => (
                      <option key={category.label} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="button-secondary h-[50px]"
              >
                <RotateCcw size={16} className="mr-2" />
                Reset
              </button>
            </div>
          </div>

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Available Studios
              </h2>

              <p className="mt-2 text-sm text-[var(--muted)]">
                {loading
                  ? "Finding creative spaces..."
                  : error
                    ? "Could not retrieve studio listings"
                    : `${filteredStudios.length} ${
                        filteredStudios.length === 1 ? "studio" : "studios"
                      } found`}
              </p>
            </div>

            {selectedCategory && (
              <span className="rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-bold text-[var(--primary)]">
                {selectedCategory}
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <StudioSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">
              <LoaderCircle size={40} className="text-[var(--primary)]" />

              <h3 className="mt-5 text-xl font-bold">
                Unable to load studios
              </h3>

              <p className="mt-3 max-w-md text-sm text-[var(--muted)]">
                {error}
              </p>

              <button
                type="button"
                onClick={() => setRetryCount((count) => count + 1)}
                className="button-primary mt-6"
              >
                Try Again
              </button>
            </div>
          ) : filteredStudios.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--primary)]">
                <Search size={36} />
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                No matching studios found
              </h3>

              <p className="mt-4 max-w-md text-sm leading-7 text-[var(--muted)]">
                We couldn't find studios matching your search or category.
                Try another keyword or explore all available spaces.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="button-primary mt-7"
              >
                Clear Filters
                <RotateCcw size={17} />
              </button>
            </div>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {filteredStudios.map((studio) => (
                <StudioCard key={studio._id} studio={studio} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
