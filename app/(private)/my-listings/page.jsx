
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Aperture,
  ArrowUpRight,
  LoaderCircle,
  PlusCircle,
  RefreshCw,
  Pencil,
  Trash2,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import DeleteStudioModal from "@/components/studios/DeleteStudioModal";

export default function MyListingsPage() {
  const { user } = useAuth();

  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [studioToDelete, setStudioToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    const controller = new AbortController();

    async function loadStudios() {
      setLoading(true);
      setError("");

      try {
        const data = await apiRequest("/api/studios", {
          signal: controller.signal,
        });

        const results = Array.isArray(data) ? data : data.studios;

        if (!Array.isArray(results)) {
          throw new Error("Invalid studio response");
        }

        if (!controller.signal.aborted) {
          setStudios(
            results.filter(
              (studio) =>
                String(studio.ownerEmail || "").toLowerCase() ===
                user.email.toLowerCase()
            )
          );
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Unable to load your studios");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadStudios();

    return () => controller.abort();
  }, [user?.email, retryCount]);

  const closeDeleteModal = useCallback(() => {
    if (!deleting) {
      setStudioToDelete(null);
    }
  }, [deleting]);

  async function handleDelete() {
    if (!studioToDelete || deleting) return;

    const studioId = studioToDelete._id;
    setDeleting(true);

    try {
      await apiRequest(`/api/studios/${studioId}`, {
        method: "DELETE",
      });

      setStudios((previous) =>
        previous.filter((studio) => studio._id !== studioId)
      );

      setStudioToDelete(null);
      toast.success("Studio deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete studio");
    } finally {
      setDeleting(false);
    }
  }

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

          <p className="mt-5 text-sm text-[var(--muted)]">
            Update, manage or remove your published studios.
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
            size={27}
            className="animate-spin text-[var(--primary)]"
          />
          <p className="text-sm text-[var(--muted)]">
            Loading your listings...
          </p>
        </div>
      ) : error ? (
        <div className="surface-card p-12 text-center">
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
          <Aperture size={48} className="text-[var(--primary)]" />

          <h2 className="mt-6 text-2xl font-bold">
            You have not listed any studios yet
          </h2>

          <p className="mt-4 max-w-md text-sm leading-7 text-[var(--muted)]">
            Publish your first creative workspace and start
            connecting with creators.
          </p>

          <Link href="/add-studio" className="button-primary mt-7">
            Publish a Studio
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
            {studios.map((studio) => {
              const image =
                studio.image ||
                studio.imageURL ||
                studio.imageUrl ||
                "";

              const location =
                typeof studio.location === "string"
                  ? studio.location
                  : studio.location?.city || studio.address || "";

              return (
                <article
                  key={studio._id}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
                >
                  <Link
                    href={`/studios/${studio._id}`}
                    className="block aspect-[4/3] overflow-hidden bg-[var(--accent)]"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={studio.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Aperture
                          size={48}
                          className="text-[var(--primary)]"
                        />
                      </div>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col p-6">
                    <span className="mb-3 self-start rounded-full bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-[var(--primary)]">
                      {studio.category || "Creative Space"}
                    </span>

                    <h2 className="line-clamp-2 text-xl font-bold">
                      {studio.title}
                    </h2>

                    <p className="mt-3 flex items-center gap-2 text-sm text-[var(--muted)]">
                      <MapPin size={16} />
                      {location}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-5">
                      <span className="text-lg font-bold text-[var(--primary)]">
                        ${Number(studio.hourlyRate || 0).toLocaleString()}
                        <span className="text-xs font-normal text-[var(--muted)]">
                          {" "}/ hr
                        </span>
                      </span>

                      <Link
                        href={`/studios/${studio._id}`}
                        className="flex items-center gap-1 text-xs font-semibold text-[var(--primary)]"
                      >
                        View Details
                        <ArrowUpRight size={15} />
                      </Link>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
                      <Link
                        href={`/studios/edit/${studio._id}`}
                        className="button-secondary gap-2"
                      >
                        <Pencil size={16} />
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => setStudioToDelete(studio)}
                        className="flex items-center justify-center gap-2 rounded-full border border-red-500/30 px-4 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/10"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      {studioToDelete && (
        <DeleteStudioModal
          studio={studioToDelete}
          deleting={deleting}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        />
      )}
    </section>
  );
}
