"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Aperture,
  Menu,
  X,
  Sun,
  Moon,
  ArrowUpRight,
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/#about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-xl"
      style={{
        backgroundColor: "var(--background)",
        borderColor: "var(--border)",
      }}
    >
      <div className="container-shell flex h-20 items-center justify-between gap-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
            style={{ backgroundColor: "var(--primary)" }}
          >
            <Aperture size={23} strokeWidth={2.2} />
          </div>

          <span className="text-[22px] font-bold tracking-[-0.06em]">
            Studio<span style={{ color: "var(--primary)" }}>Space</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : link.href === "/studios"
                  ? pathname.startsWith("/studios")
                  : false;

            return (
              <Link
                key={link.name}
                href={link.href}
                className="relative py-2 text-[13px] font-semibold transition-colors hover:opacity-70"
                style={{
                  color: active
                    ? "var(--primary)"
                    : "var(--foreground)",
                }}
              >
                {link.name}

                {active && (
                  <span
                    className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full"
                    style={{ backgroundColor: "var(--primary)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
            style={{ borderColor: "var(--border)" }}
          >
            {mounted ? (
              isDark ? <Sun size={18} /> : <Moon size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold hover:opacity-70"
          >
            Log in
          </Link>

          <Link href="/register" className="button-primary">
            Get Started
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full"
          >
            {mounted ? (
              isDark ? <Sun size={20} /> : <Moon size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="border-t px-6 py-5 lg:hidden"
          style={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
          }}
        >
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-semibold hover:opacity-70"
              >
                {link.name}
              </Link>
            ))}

            <div
              className="my-3 border-t"
              style={{ borderColor: "var(--border)" }}
            />

            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-semibold"
            >
              Log in
            </Link>

            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="button-primary mt-2"
            >
              Get Started
              <ArrowUpRight size={16} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}