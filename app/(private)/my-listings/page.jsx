
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Aperture,
  ArrowUpRight,
  LoaderCircle,
  PlusCircle,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import StudioCard from "@/components/studios/StudioCard";

export default function MyListingsPage() {
  const { user } = useAuth();

  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!user?.email) return;

    let active = true;

    async function loadMyStudios() {
      setLoading(true);
      setError("");

      try {
        const data = await apiRequest("/api/studios");

        const results = Array.isArray(data)
          ? data
          : data.studios;

        if (!Array.isArray(results)) {
          throw new Error("Invalid studio data received");
        }

        const myStudios = results.filter(
          (studio) =>
            String(studio.ownerEmail || "").toLowerCase() ===
            user.email.toLowerCase()
        );

        if (active) {
          setStudios(myStudios);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load your listings");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMyStudios();

    return () => {
      active = false;
    };
  }, [user?.email, retryCount]);

  return (
    <section className="container-shell section-space min-h-[65vh]">
      <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <div className="mb-4 flex items-center gap-2 text-[var(--primary)]">
            <Aperture size={19} />
            <span className="eyebrow">YOUR CREATIVE SPACES</span>
          </div>

          <h1 className="display-title">
            My Studio{" "}
            <span className="text-[var(--primary)]">
              Listings
            </span>
          </h1>

          <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
            View the creative workspaces you've published.
          </p>
        </div>

        <Link href="/add-studio" className="button-primary self-start">
          <PlusCircle size={18} />
          Add New Studio
        </Link>
      </div>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center gap-3">
          <LoaderCircle
            size={26}
            className="animate-spin text-[var(--primary)]"
          />

          <p className="text-sm text-[var(--muted)]">
            Loading your studios...
          </p>
        </div>
      ) : error ? (
        <div className="surface-card flex flex-col items-center p-12 text-center">
          <h2 className="text-xl font-bold">
            Unable to load your listings
          </h2>

          <p className="mt-3 text-sm text-[var(--muted)]">
            {error}
          </p>

          <button
            type="button"
            onClick={() => setRetryCount((value) => value + 1)}
            className="button-primary mt-6"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      ) : studios.length === 0 ? (
        <div className="surface-card flex flex-col items-center px-6 py-16 text-center">
          <Aperture
            size={48}
            className="text-[var(--primary)]"
          />

          <h2 className="mt-6 text-2xl font-bold">
            You haven't listed any studios yet
          </h2>

          <p className="mt-4 max-w-md text-sm leading-7 text-[var(--muted)]">
            Share your creative workspace and start connecting
            with photographers, musicians, filmmakers, and creators.
          </p>

          <Link href="/add-studio" className="button-primary mt-7">
            Publish Your First Studio
            <ArrowUpRight size={17} />
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-7 text-sm text-[var(--muted)]">
            {studios.length}{" "}
            {studios.length === 1 ? "studio" : "studios"} published
          </p>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <StudioCard
                key={studio._id}
                studio={studio}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
