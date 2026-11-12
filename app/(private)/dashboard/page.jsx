"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Aperture,
  PlusCircle,
  List,
  CalendarDays,
  ArrowUpRight,
  UserRound,
} from "lucide-react";

const dashboardLinks = [
  {
    title: "Add New Studio",
    description: "Share your creative workspace with other creators.",
    href: "/add-studio",
    icon: PlusCircle,
  },
  {
    title: "My Studio Listings",
    description: "Manage the studios you have published.",
    href: "/my-listings",
    icon: List,
  },
  {
    title: "My Bookings",
    description: "View and manage your studio reservations.",
    href: "/my-bookings",
    icon: CalendarDays,
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <section className="container-shell section-space min-h-[65vh]">
      <div className="mb-12">
        <div className="mb-5 flex items-center gap-2 text-[var(--primary)]">
          <Aperture size={20} />
          <span className="eyebrow">YOUR CREATIVE HUB</span>
        </div>

        <h1 className="display-title">
          Welcome back,{" "}
          <span className="text-[var(--primary)]">
            {user?.name || "Creator"}
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">
          Manage your creative spaces, discover new opportunities,
          and keep track of your upcoming bookings.
        </p>
      </div>

      <div className="mb-10 flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--primary)]">
          <UserRound size={26} />
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold">
            {user?.name || "StudioSpace User"}
          </h2>

          <p className="truncate text-sm text-[var(--muted)]">
            {user?.email}
          </p>
        </div>
      </div>

      <h2 className="mb-6 text-2xl font-bold tracking-tight">
        Quick Actions
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboardLinks.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-6 flex h-13 w-13 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--primary)]">
                <Icon size={25} />
              </div>

              <h3 className="text-lg font-bold">{item.title}</h3>

              <p className="mt-3 flex-1 text-sm leading-7 text-[var(--muted)]">
                {item.description}
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
                Open
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}