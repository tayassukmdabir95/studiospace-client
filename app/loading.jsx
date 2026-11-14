
import { Aperture } from "lucide-react";

export default function Loading() {
  return (
    <main
      role="status"
      aria-label="Loading StudioSpace"
      className="container-shell flex min-h-[65vh] flex-col items-center justify-center px-5 py-20 text-center"
    >
      <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-[var(--accent)]">
        <div className="absolute inset-0 animate-ping rounded-3xl bg-[var(--primary)]/10" />

        <Aperture
          size={47}
          strokeWidth={1.5}
          className="relative animate-spin text-[var(--primary)]"
        />
      </div>

      <h2 className="mt-8 text-2xl font-bold tracking-tight">
        Preparing your creative space
      </h2>

      <p className="mt-3 text-sm text-[var(--muted)]">
        StudioSpace is getting everything ready for you.
      </p>

      <div className="mt-7 flex gap-2">
        {[0, 1, 2].map((item) => (
          <span
            key={item}
            className="h-2 w-2 animate-pulse rounded-full bg-[var(--primary)]"
            style={{
              animationDelay: `${item * 200}ms`,
            }}
          />
        ))}
      </div>
    </main>
  );
}
