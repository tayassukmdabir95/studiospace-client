"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  UserRound,
  ImagePlus,
  CheckCircle2,
  Aperture,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordError("");
    }
  }

  function validatePassword(password) {
    if (password.length < 6) {
      return "Password must contain at least 6 characters";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }

    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const error = validatePassword(formData.password);

    if (error) {
      setPasswordError(error);
      toast.error(error);
      return;
    }

    setSubmitting(true);

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        photoURL: formData.photoURL.trim(),
        password: formData.password,
      });

      toast.success("Account created successfully! Please log in.");
      router.push("/login");
    } catch (error) {
      toast.error(error.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="container-shell flex min-h-[75vh] items-center justify-center py-14">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-xl shadow-black/5 lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#24231f] p-12 text-white lg:flex">
          <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-[#e77b42]/20 blur-3xl" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e77b42]">
              <Aperture size={28} />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              StudioSpace
            </span>
          </div>

          <div className="relative z-10 my-20">
            <span className="eyebrow">JOIN THE CREATIVE COMMUNITY</span>

            <h2 className="mt-5 text-5xl leading-tight font-bold tracking-tight">
              Your next big idea
              <span className="text-[#f08a50]"> starts here.</span>
            </h2>

            <p className="mt-6 max-w-sm text-base leading-8 text-white/60">
              Join a growing community of creators and studio hosts.
              Find inspiring spaces, collaborate, and make your
              creative vision a reality.
            </p>
          </div>

          <p className="relative z-10 text-sm text-white/40">
            Every great creation starts somewhere.
          </p>
        </div>

        <div className="px-6 py-10 sm:px-12 lg:px-14">
          <div className="mb-7">
            <span className="eyebrow">GET STARTED</span>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Create your account
            </h1>

            <p className="mt-3 text-sm text-[var(--muted)]">
              Join StudioSpace and unlock creative possibilities.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="register-name"
                className="mb-2 block text-sm font-semibold"
              >
                Full Name
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--muted)]"
                />

                <input
                  id="register-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  autoComplete="name"
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="register-email"
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
                  id="register-email"
                  name="email"
                  type="email"
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
              <label
                htmlFor="register-photo"
                className="mb-2 block text-sm font-semibold"
              >
                Profile Photo URL
              </label>

              <div className="relative">
                <ImagePlus
                  size={18}
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--muted)]"
                />

                <input
                  id="register-photo"
                  name="photoURL"
                  type="url"
                  value={formData.photoURL}
                  onChange={handleChange}
                  placeholder="https://example.com/photo.jpg"
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="register-password"
                className="mb-2 block text-sm font-semibold"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--muted)]"
                />

                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  className="input-field pr-12 pl-11"
                  aria-invalid={Boolean(passwordError)}
                  aria-describedby={
                    passwordError ? "password-error" : undefined
                  }
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

              {passwordError && (
                <p
                  id="password-error"
                  className="mt-2 text-xs text-red-500"
                >
                  {passwordError}
                </p>
              )}

              <div className="mt-3 space-y-1.5">
                {[
                  {
                    label: "At least 6 characters",
                    valid: formData.password.length >= 6,
                  },
                  {
                    label: "One uppercase letter",
                    valid: /[A-Z]/.test(formData.password),
                  },
                  {
                    label: "One lowercase letter",
                    valid: /[a-z]/.test(formData.password),
                  },
                ].map((rule) => (
                  <div
                    key={rule.label}
                    className={`flex items-center gap-2 text-xs ${
                      rule.valid
                        ? "text-green-600"
                        : "text-[var(--muted)]"
                    }`}
                  >
                    <CheckCircle2 size={14} />
                    {rule.label}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="button-primary mt-3 w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creating account..." : "Create Account"}
              {!submitting && <ArrowRight size={17} />}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-xs text-[var(--muted)]">
              OR CONTINUE WITH
            </span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <GoogleLoginButton />

          <p className="mt-7 text-center text-sm text-[var(--muted)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[var(--primary)] hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}