"use client";

import Link from "next/link";
import { useState } from "react";
import { Aperture, ArrowRight } from "lucide-react";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { toast } from "sonner";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/#about" },
];

const categories = [
  { name: "Photo Studios", value: "Photo Studio" },
  { name: "Sound Stages", value: "Film Stage" },
  { name: "Podcast Rooms", value: "Podcast Lounge" },
  { name: "Music Suites", value: "Music Suite" },
  { name: "Art Workshops", value: "Workshop" },
];
export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    toast.info("Newsletter subscriptions are coming soon!");
    setEmail("");
  };

  return (
    <footer
      className="mt-auto border-t"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <div className="container-shell grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="mb-5 flex items-center gap-2.5">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <Aperture size={23} />
            </div>

            <span className="text-[22px] font-bold tracking-[-0.06em]">
              Studio<span style={{ color: "var(--primary)" }}>Space</span>
            </span>
          </Link>

          <p
            className="max-w-xs text-sm leading-7"
            style={{ color: "var(--muted)" }}
          >
            Creative spaces for extraordinary ideas. Discover inspiring
            studios, connect with hosts, and bring your vision to life.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border"
              style={{ borderColor: "var(--border)" }}
            >
              <FaInstagram size={17} />
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-full border"
              style={{ borderColor: "var(--border)" }}
            >
              <FaLinkedinIn size={17} />
            </a>

            <a
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold"
              style={{ borderColor: "var(--border)" }}
            >
              𝕏
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-6 text-sm font-bold">Quick Links</h3>

          <ul className="space-y-4">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-sm transition-opacity hover:opacity-60"
                  style={{ color: "var(--muted)" }}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-6 text-sm font-bold">Explore Spaces</h3>

          <ul className="space-y-4">
            {categories.map((category) => (
              <li key={category.name}>
                <Link
                  href={`/studios?category=${encodeURIComponent(category.value)}`}
                  className="text-sm transition-opacity hover:opacity-60"
                  style={{ color: "var(--muted)" }}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-6 text-sm font-bold">Stay Inspired</h3>

          <p
            className="mb-5 text-sm leading-7"
            style={{ color: "var(--muted)" }}
          >
            Get creative inspiration and updates about StudioSpace.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Email address"
              required
              className="input-field text-sm"
            />

            <button type="submit" className="button-primary w-full">
              Subscribe
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>

      <div
        className="border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="container-shell flex flex-col items-center justify-between gap-4 py-6 text-xs md:flex-row"
          style={{ color: "var(--muted)" }}
        >
          <p>© 2026 StudioSpace. All rights reserved.</p>

          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}