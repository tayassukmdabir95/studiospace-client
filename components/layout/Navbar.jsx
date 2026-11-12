"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Aperture,
  Menu,
  X,
  Sun,
  Moon,
  ArrowUpRight,
  ChevronDown,
  LayoutDashboard,
  PlusCircle,
  List,
  CalendarDays,
  LogOut,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/#about" },
];

const userLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Add New Studio",
    href: "/add-studio",
    icon: PlusCircle,
  },
  {
    name: "My Studio Listings",
    href: "/my-listings",
    icon: List,
  },
  {
    name: "My Bookings",
    href: "/my-bookings",
    icon: CalendarDays,
  },
];

function UserAvatar({ user, size = "md" }) {
  const [imageFailed, setImageFailed] = useState(false);

  const dimension = size === "lg" ? "h-12 w-12" : "h-10 w-10";
  const photoURL = user?.photoURL || user?.photoUrl || user?.photo;

  if (photoURL && !imageFailed) {
    return (
      <img
        src={photoURL}
        alt={user.name || "Profile"}
        onError={() => setImageFailed(true)}
        className={`${dimension} rounded-full border border-[var(--border)] object-cover`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      className={`${dimension} flex items-center justify-center rounded-full bg-[var(--accent)] text-[var(--primary)]`}
    >
      <UserRound size={20} />
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { user, loading, logout } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const profileRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const isDark = resolvedTheme === "dark";

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await logout();
      toast.success("Logged out successfully");
      setProfileOpen(false);
      setMenuOpen(false);
      router.replace("/");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Logout failed");
    } finally {
      setLoggingOut(false);
    }
  }

  function isActive(href) {
    if (href === "/") {
      return pathname === "/";
    }

    if (href === "/studios") {
      return pathname === "/studios" ||
        (pathname.startsWith("/studios/") &&
          !pathname.startsWith("/studios/edit"));
    }

    if (href.includes("#")) {
      return false;
    }

    return pathname === href;
  }

  const themeButton = (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] transition-colors hover:bg-[var(--accent)]"
    >
      {mounted ? (
        isDark ? <Sun size={18} /> : <Moon size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-xl">
      <div className="container-shell flex h-20 items-center justify-between gap-6">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="flex shrink-0 items-center gap-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-white">
            <Aperture size={23} strokeWidth={2.2} />
          </div>

          <span className="text-[22px] font-bold tracking-[-0.06em]">
            Studio
            <span className="text-[var(--primary)]">Space</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`relative py-2 text-[13px] font-semibold transition-colors hover:text-[var(--primary)] ${
                isActive(link.href)
                  ? "text-[var(--primary)]"
                  : "text-[var(--foreground)]"
              }`}
            >
              {link.name}

              {isActive(link.href) && (
                <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-[var(--primary)]" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {themeButton}

          {loading ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-[var(--accent)]" />
          ) : user ? (
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full border border-[var(--border)] py-1 pr-3 pl-1 transition-colors hover:bg-[var(--accent)]"
              >
                <UserAvatar key={user.email} user={user} />
                <span className="max-w-28 truncate text-sm font-semibold">
                  {user.name || "My Account"}
                </span>
                <ChevronDown size={16} />
              </button>

              {profileOpen && (
                <div
                  role="menu"
                  className="absolute top-full right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-xl"
                >
                  <div className="border-b border-[var(--border)] px-3 py-4">
                    <p className="truncate text-sm font-bold">
                      {user.name || "StudioSpace User"}
                    </p>
                    <p className="mt-1 truncate text-xs text-[var(--muted)]">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-2">
                    {userLinks.map((link) => {
                      const Icon = link.icon;

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          role="menuitem"
                          onClick={() => setProfileOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-[var(--accent)] ${
                            pathname === link.href
                              ? "text-[var(--primary)]"
                              : ""
                          }`}
                        >
                          <Icon size={18} />
                          {link.name}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="border-t border-[var(--border)] pt-2">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                    >
                      <LogOut size={18} />
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold hover:text-[var(--primary)]"
              >
                Log in
              </Link>

              <Link href="/register" className="button-primary">
                Get Started
                <ArrowUpRight size={16} />
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {themeButton}

          {user && !loading && (
            <UserAvatar key={user.email} user={user} />
          )}

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
        <div className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-[var(--border)] bg-[var(--background)] px-6 py-5 lg:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-3 text-sm font-semibold ${
                  isActive(link.href)
                    ? "bg-[var(--accent)] text-[var(--primary)]"
                    : ""
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="my-3 border-t border-[var(--border)]" />

            {loading ? (
              <p className="px-3 py-3 text-sm text-[var(--muted)]">
                Loading account...
              </p>
            ) : user ? (
              <>
                <div className="mb-2 flex items-center gap-3 px-3 py-2">
                  <UserAvatar key={user.email} user={user} size="lg" />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">
                      {user.name || "StudioSpace User"}
                    </p>
                    <p className="truncate text-xs text-[var(--muted)]">
                      {user.email}
                    </p>
                  </div>
                </div>

                {userLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold ${
                        pathname === link.href
                          ? "bg-[var(--accent)] text-[var(--primary)]"
                          : ""
                      }`}
                    >
                      <Icon size={18} />
                      {link.name}
                    </Link>
                  );
                })}

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-red-500 disabled:opacity-50"
                >
                  <LogOut size={18} />
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}