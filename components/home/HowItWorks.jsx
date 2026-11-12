
import Link from "next/link";
import {
  Search,
  CalendarClock,
  CheckCircle2,
  Clapperboard,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover Spaces",
    description:
      "Explore inspiring studios and find the perfect creative environment for your next project.",
    icon: Search,
  },
  {
    number: "02",
    title: "Select Shoot Hours",
    description:
      "Choose your preferred date and time based on your production schedule and studio availability.",
    icon: CalendarClock,
  },
  {
    number: "03",
    title: "Book Instantly",
    description:
      "Submit your booking request with transparent pricing and track its confirmation status.",
    icon: CheckCircle2,
  },
  {
    number: "04",
    title: "Create & Produce",
    description:
      "Get ready to bring your ideas to life in a space designed for creativity and collaboration.",
    icon: Clapperboard,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="section-space scroll-mt-20"
    >
      <div className="container-shell">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <span className="eyebrow">SIMPLE & SEAMLESS</span>

            <h2 className="mt-4 text-4xl font-bold tracking-[-0.055em] sm:text-5xl">
              How Booking{" "}
              <span className="text-[var(--primary)]">
                Works
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-[var(--muted)]">
              From discovering your dream studio to creating
              something extraordinary, your next production
              is just a few simple steps away.
            </p>
          </div>

          <Link
            href="/studios"
            className="button-secondary shrink-0"
          >
            Find Your Space
            <ArrowUpRight size={18} className="ml-2" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-8 flex items-start justify-between">
                  <div className="flex h-15 w-15 items-center justify-center rounded-2xl bg-[var(--accent)] text-[var(--primary)] transition-colors group-hover:bg-[var(--primary)] group-hover:text-white">
                    <Icon size={27} strokeWidth={1.8} />
                  </div>

                  <span className="text-4xl font-bold tracking-tight text-[var(--border)]">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold tracking-tight">
                  {step.title}
                </h3>

                <p className="mt-4 flex-1 text-sm leading-7 text-[var(--muted)]">
                  {step.description}
                </p>

                <div className="mt-7 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--primary)]">
                  STEP {step.number}
                  <ArrowRight size={15} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
