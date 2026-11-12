
import Link from "next/link";
import { Aperture, ArrowUpRight, MapPin, Star } from "lucide-react";

export default function StudioCard({ studio }) {
  const image = studio.imageURL || studio.imageUrl || studio.image || studio.images?.[0] || "";
  const imageUrl = typeof image === "string" ? image : image?.url || "";

  const hourlyRate = studio.hourlyRate ?? studio.pricePerHour;
  const rate = Number(hourlyRate);
  const hasRate = hourlyRate !== null &&
    hourlyRate !== undefined &&
    hourlyRate !== "" &&
    Number.isFinite(rate);

  const location =
    typeof studio.location === "string"
      ? studio.location
      : studio.location?.city || studio.address || "Location not specified";

  const rating = Number(studio.rating);
  const hasRating =
    studio.rating !== null &&
    studio.rating !== undefined &&
    Number.isFinite(rating) &&
    rating > 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link
        href={`/studios/${studio._id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-[var(--accent)]"
      >
        {imageUrl ? (
          <div
            role="img"
            aria-label={studio.title || "Creative studio"}
            className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url("${imageUrl}")` }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--primary)]">
            <Aperture size={52} />
          </div>
        )}

        <span className="absolute top-4 left-4 max-w-[65%] truncate rounded-full bg-white px-4 py-2 text-xs font-bold text-[#24231f]">
          {studio.category || "Creative Space"}
        </span>

        <span className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-bold text-[#24231f]">
          {hasRating ? (
            <>
              <Star size={13} fill="#e77b42" color="#e77b42" />
              {rating.toFixed(1)}
            </>
          ) : (
            "New"
          )}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-2 text-sm text-[var(--muted)]">
          <MapPin size={15} className="shrink-0" />
          <span className="truncate">{location}</span>
        </div>

        <Link href={`/studios/${studio._id}`}>
          <h3 className="line-clamp-2 min-h-14 text-xl leading-7 font-bold tracking-tight transition-colors group-hover:text-[var(--primary)]">
            {studio.title || "Untitled Studio"}
          </h3>
        </Link>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--border)] pt-5">
          <div>
            <p className="mb-1 text-xs text-[var(--muted)]">Hourly rate</p>

            <p className="text-xl font-bold text-[var(--primary)]">
              {hasRate ? `$${rate.toLocaleString()}` : "Ask host"}
              {hasRate && (
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
