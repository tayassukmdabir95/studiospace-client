
import Link from "next/link";
import {
  Aperture,
  ArrowLeft,
  ArrowUpRight,
  Clapperboard,
  Search,
} from "lucide-react";

export const metadata = {
  title: "Page Not Found | StudioSpace",
  description: "The requested StudioSpace page could not be found.",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-[#24231f] px-5 py-20 text-white">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#e77b42]/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#e77b42]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <div className="relative mx-auto mb-10 flex h-28 w-28 items-center justify-center rounded-3xl border border-white/15 bg-white/5">
          <Aperture
            size={60}
            strokeWidth={1.3}
            className="text-[#f08a50]"
          />

          <div className="absolute -bottom-3 -right-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e77b42]">
            <Clapperboard size={25} />
          </div>
        </div>

        <p className="text-7xl font-black tracking-[-0.08em] text-[#f08a50] sm:text-9xl">
          404
        </p>

        <span className="mt-7 block text-xs font-bold tracking-[0.22em] text-[#f08a50]">
          LOST IN THE CREATIVE PROCESS?
        </span>

        <h1 className="mt-5 text-3xl font-bold tracking-[-0.05em] sm:text-5xl">
          This space doesn't exist.
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-sm leading-8 text-white/65 sm:text-base">
          Looks like you've wandered off the production set.
          The page you're looking for may have moved,
          been removed, or never existed.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e77b42] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#d9682e]"
          >
            <ArrowLeft size={18} />
            Return to Home
          </Link>

          <Link
            href="/studios"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <Search size={17} />
            Explore Studios
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <p className="mt-12 text-xs tracking-wide text-white/40">
          STUDIO SPACE · CREATE WITHOUT LIMITS
        </p>
      </div>
    </main>
  );
}
