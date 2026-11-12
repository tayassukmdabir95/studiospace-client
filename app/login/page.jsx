"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Aperture,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      await login(formData.email.trim(), formData.password);

toast.success("Welcome back to StudioSpace!");

const params = new URLSearchParams(window.location.search);
const requestedPath = params.get("next");

const destination =
  requestedPath?.startsWith("/") &&
  !requestedPath.startsWith("//") &&
  !requestedPath.startsWith("/\\")
    ? requestedPath
    : "/";

router.replace(destination);
router.refresh();
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="container-shell flex min-h-[75vh] items-center justify-center py-14">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-xl shadow-black/5 lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#24231f] p-12 text-white lg:flex">
          <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-[#e77b42]/20 blur-3xl" />
          <div className="absolute top-24 -left-24 h-64 w-64 rounded-full bg-[#e77b42]/10 blur-3xl" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e77b42]">
              <Aperture size={28} />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              StudioSpace
            </span>
          </div>

          <div className="relative z-10 my-20">
            <span className="eyebrow">YOUR CREATIVE JOURNEY</span>

            <h2 className="mt-5 text-5xl leading-tight font-bold tracking-tight">
              Great ideas need
              <span className="text-[#f08a50]"> great spaces.</span>
            </h2>

            <p className="mt-6 max-w-sm text-base leading-8 text-white/60">
              Find the perfect environment for your next production,
              recording session, photoshoot, or creative project.
            </p>
          </div>

          <p className="relative z-10 text-sm text-white/40">
            Create something extraordinary.
          </p>
        </div>

        <div className="px-6 py-12 sm:px-12 lg:px-14 lg:py-16">
          <div className="mb-9">
            <span className="eyebrow">WELCOME BACK</span>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Log in to your account
            </h1>

            <p className="mt-3 text-sm text-[var(--muted)]">
              Enter your details to continue your creative journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="mb-2 block text-sm font-semibold"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--muted)]"
                />

                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="login-password"
                  className="text-sm font-semibold"
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={() =>
                    toast.info("Password recovery is not available yet.")
                  }
                  className="text-xs font-semibold text-[var(--primary)] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--muted)]"
                />

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="input-field pr-12 pl-11"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-[var(--muted)]"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="button-primary mt-3 w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Logging in..." : "Log In"}
              {!submitting && <ArrowRight size={17} />}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-xs text-[var(--muted)]">
              OR CONTINUE WITH
            </span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <GoogleLoginButton />

          <p className="mt-8 text-center text-sm text-[var(--muted)]">
            New to StudioSpace?{" "}
            <Link
              href="/register"
              className="font-bold text-[var(--primary)] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}