
import Link from "next/link";
import {
  Camera,
  Clapperboard,
  Mic2,
  Music2,
  Palette,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  {
    name: "Photo Studios",
    filter: "Photo Studio",
    description: "Capture every moment",
    image:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=900&q=85",
    icon: Camera,
  },
  {
    name: "Sound Stages",
    filter: "Film Stage",
    description: "Bring stories to life",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=85",
    icon: Clapperboard,
  },
  {
    name: "Podcast Rooms",
    filter: "Podcast Lounge",
    description: "Make your voice heard",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=85",
    icon: Mic2,
  },
  {
    name: "Music Suites",
    filter: "Music Suite",
    description: "Find your perfect sound",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=85",
    icon: Music2,
  },
  {
    name: "Art Workshops",
    filter: "Workshop",
    description: "Create without limits",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=85",
    icon: Palette,
  },
];

export default function StudioCategories() {
  return (
    <section className="section-space bg-[var(--surface)]">
      <div className="container-shell">
        <div className="mb-12 text-center">
          <span className="eyebrow">FIND YOUR CREATIVE SPACE</span>

          <h2 className="mt-4 text-4xl font-bold tracking-[-0.055em] sm:text-5xl">
            Explore by{" "}
            <span className="text-[var(--primary)]">
              Category
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            Every creative project deserves the right environment.
            Discover spaces thoughtfully designed for the way you create.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={`/studios?category=${encodeURIComponent(category.filter)}`}
                className={`group relative block min-h-[300px] overflow-hidden rounded-2xl bg-[#24231f] ${
                  index === 0 ? "lg:col-span-2" : ""
                }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url("${category.image}")`,
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />

                <div className="absolute inset-0 flex flex-col justify-end p-7 text-white sm:p-8">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-white/30 bg-white/15 backdrop-blur-md">
                    <Icon size={23} />
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight">
                        {category.name}
                      </h3>

                      <p className="mt-2 text-sm text-white/70">
                        {category.description}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#24231f] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
