
import Link from "next/link";
import {
  ShieldCheck,
  BadgeCheck,
  Headphones,
  Wrench,
  ArrowUpRight,
  Sparkles,
  Aperture,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Protection-Conscious Booking",
    description:
      "Clear booking details and studio policies help creators understand expectations before reserving a space.",
  },
  {
    icon: BadgeCheck,
    title: "Host Transparency",
    description:
      "Explore studio details, amenities, and host information before making your booking decision.",
  },
  {
    icon: Wrench,
    title: "Equipment Awareness",
    description:
      "Review available studio equipment and amenities to find a workspace that matches your production needs.",
  },
  {
    icon: Headphones,
    title: "Creator Support",
    description:
      "Keep your bookings organized and stay informed about their progress through your personal dashboard.",
  },
];

export default function CreatorSupport() {
  return (
    <section
      id="about"
      className="relative scroll-mt-20 overflow-hidden bg-[#24231f] py-24 text-white sm:py-28"
    >
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#e77b42]/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-44 -left-44 h-[450px] w-[450px] rounded-full bg-[#e77b42]/10 blur-3xl" />

      <div className="container-shell relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <Aperture size={20} className="text-[#f08a50]" />

              <span className="text-xs font-bold tracking-[0.18em] text-[#f08a50]">
                THE STUDIOSPACE EXPERIENCE
              </span>
            </div>

            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.1] font-bold tracking-[-0.06em]">
              Your creativity.
              <br />
              <span className="text-[#f08a50]">
                Our priority.
              </span>
            </h2>

            <p className="mt-7 max-w-lg text-base leading-8 text-white/65">
              StudioSpace brings creators and studio hosts
              together in one easy-to-use platform. Discover
              creative workspaces, review their facilities,
              and manage your reservations with confidence.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/studios"
                className="button-primary"
              >
                Explore Studios
                <ArrowUpRight size={18} />
              </Link>

              <Link
                href="/add-studio"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Become a Host
                <Sparkles size={17} />
              </Link>
            </div>

            <div className="mt-12 border-t border-white/15 pt-7">
              <p className="max-w-sm text-sm leading-7 text-white/50">
                From photography and filmmaking to music
                production and podcasting — a creative
                space for every vision.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-colors hover:border-[#e77b42]/40 hover:bg-white/10"
                >
                  <div className="mb-6 flex h-13 w-13 items-center justify-center rounded-xl bg-[#e77b42]/15 text-[#f08a50]">
                    <Icon size={24} strokeWidth={1.8} />
                  </div>

                  <h3 className="text-lg font-bold leading-7">
                    {feature.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-white/55">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
