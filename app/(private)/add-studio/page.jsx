
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Aperture,
  ArrowLeft,
  ArrowRight,
  Building2,
  Camera,
  CheckCircle2,
  DollarSign,
  ImagePlus,
  LoaderCircle,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";

const categories = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

const amenitiesOptions = [
  "WiFi",
  "Lighting",
  "Air Conditioning",
  "Parking",
  "Soundproofing",
  "Microphones",
  "Cameras",
  "Changing Room",
  "Green Screen",
  "Restroom",
  "Projector",
  "Recording Equipment",
];

const initialForm = {
  title: "",
  category: "",
  hourlyRate: "",
  securityDeposit: "",
  maxCapacity: "",
  location: "",
  address: "",
  image: "",
  description: "",
};

export default function AddStudioPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState(initialForm);
  const [amenities, setAmenities] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function toggleAmenity(amenity) {
    setAmenities((previous) =>
      previous.includes(amenity)
        ? previous.filter((item) => item !== amenity)
        : [...previous, amenity]
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!user) {
      toast.error("Please log in to add a studio");
      return;
    }

    const title = formData.title.trim();
    const location = formData.location.trim();
    const address = formData.address.trim();
    const description = formData.description.trim();
    const image = formData.image.trim();

    const hourlyRate = Number(formData.hourlyRate);
    const securityDeposit = Number(formData.securityDeposit);
    const maxCapacity = Number(formData.maxCapacity);

    if (
      !title ||
      !formData.category ||
      !location ||
      !address ||
      !image ||
      !description
    ) {
      toast.error("Please complete all required fields");
      return;
    }

    if (!/^https?:\/\/.+/i.test(image)) {
      toast.error("Please provide a valid image URL");
      return;
    }

    if (!Number.isFinite(hourlyRate) || hourlyRate <= 0) {
      toast.error("Hourly rate must be greater than zero");
      return;
    }

    if (!Number.isFinite(securityDeposit) || securityDeposit < 0) {
      toast.error("Security deposit cannot be negative");
      return;
    }

    if (!Number.isInteger(maxCapacity) || maxCapacity < 1) {
      toast.error("Capacity must be a positive whole number");
      return;
    }

    setSubmitting(true);

    try {
      const studioData = {
        title,
        category: formData.category,
        hourlyRate,
        securityDeposit,
        maxCapacity,
        location,
        address,
        image,
        amenities,
        description,
      };

      await apiRequest("/api/studios", {
        method: "POST",
        body: JSON.stringify(studioData),
      });

      toast.success("Your studio has been published successfully!");
      router.push("/my-listings");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to add studio");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="container-shell py-12 sm:py-16">
      <Link
        href="/dashboard"
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--primary)]"
      >
        <ArrowLeft size={17} />
        Back to Dashboard
      </Link>

      <div className="mb-10 max-w-2xl">
        <div className="mb-4 flex items-center gap-2 text-[var(--primary)]">
          <Aperture size={19} />
          <span className="eyebrow">BECOME A HOST</span>
        </div>

        <h1 className="display-title">
          List your{" "}
          <span className="text-[var(--primary)]">
            creative space.
          </span>
        </h1>

        <p className="mt-5 text-base leading-8 text-[var(--muted)]">
          Share your studio with creators looking for the perfect
          place to bring their ideas to life.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_310px]"
      >
        <div className="space-y-7">
          <div className="surface-card p-6 sm:p-9">
            <div className="mb-7 flex items-center gap-3">
              <Building2
                size={24}
                className="text-[var(--primary)]"
              />

              <h2 className="text-xl font-bold">
                Basic Information
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="studio-title"
                  className="mb-2 block text-sm font-semibold"
                >
                  Studio Title *
                </label>

                <input
                  id="studio-title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Skyline Film Production Studio"
                  className="input-field"
                  maxLength={120}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="studio-category"
                  className="mb-2 block text-sm font-semibold"
                >
                  Studio Category *
                </label>

                <select
                  id="studio-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select a category</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="studio-description"
                  className="mb-2 block text-sm font-semibold"
                >
                  Detailed Overview *
                </label>

                <textarea
                  id="studio-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Describe your studio, creative atmosphere, equipment and ideal use cases."
                  className="input-field resize-y"
                  minLength={20}
                  required
                />
              </div>
            </div>
          </div>

          <div className="surface-card p-6 sm:p-9">
            <div className="mb-7 flex items-center gap-3">
              <DollarSign
                size={24}
                className="text-[var(--primary)]"
              />

              <h2 className="text-xl font-bold">
                Pricing & Capacity
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="hourly-rate"
                  className="mb-2 block text-sm font-semibold"
                >
                  Hourly Rate ($) *
                </label>

                <input
                  id="hourly-rate"
                  name="hourlyRate"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  placeholder="50"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="security-deposit"
                  className="mb-2 block text-sm font-semibold"
                >
                  Security Deposit ($) *
                </label>

                <input
                  id="security-deposit"
                  name="securityDeposit"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  placeholder="100"
                  className="input-field"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="max-capacity"
                  className="mb-2 block text-sm font-semibold"
                >
                  Maximum Capacity *
                </label>

                <input
                  id="max-capacity"
                  name="maxCapacity"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.maxCapacity}
                  onChange={handleChange}
                  placeholder="8"
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          <div className="surface-card p-6 sm:p-9">
            <div className="mb-7 flex items-center gap-3">
              <MapPin
                size={24}
                className="text-[var(--primary)]"
              />

              <h2 className="text-xl font-bold">
                Location
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="studio-location"
                  className="mb-2 block text-sm font-semibold"
                >
                  Area / City *
                </label>

                <input
                  id="studio-location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Banani, Dhaka"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="studio-address"
                  className="mb-2 block text-sm font-semibold"
                >
                  Full Address *
                </label>

                <input
                  id="studio-address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House, road, area and city"
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          <div className="surface-card p-6 sm:p-9">
            <div className="mb-7 flex items-center gap-3">
              <ImagePlus
                size={24}
                className="text-[var(--primary)]"
              />

              <h2 className="text-xl font-bold">
                Studio Image
              </h2>
            </div>

            <label
              htmlFor="studio-image"
              className="mb-2 block text-sm font-semibold"
            >
              Hosted Image URL *
            </label>

            <input
              id="studio-image"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/studio.jpg"
              className="input-field"
              required
            />

            <p className="mt-3 text-xs leading-6 text-[var(--muted)]">
              Upload an image to{" "}
              <a
                href="https://postimages.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Postimages
              </a>{" "}
              or{" "}
              <a
                href="https://imgbb.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                ImgBB
              </a>
              , then paste its direct image URL here.
            </p>

            {formData.image.trim() && (
              <div className="mt-5 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--accent)]">
                <img
                  src={formData.image.trim()}
                  alt="Studio image preview"
                  className="aspect-video w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                  onLoad={(event) => {
                    event.currentTarget.style.display = "block";
                  }}
                />
              </div>
            )}
          </div>

          <div className="surface-card p-6 sm:p-9">
            <div className="mb-7 flex items-center gap-3">
              <CheckCircle2
                size={24}
                className="text-[var(--primary)]"
              />

              <h2 className="text-xl font-bold">
                Available Amenities
              </h2>
            </div>

            <p className="mb-6 text-sm text-[var(--muted)]">
              Select everything available in your studio.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {amenitiesOptions.map((amenity) => (
                <label
                  key={amenity}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-medium transition-colors ${
                    amenities.includes(amenity)
                      ? "border-[var(--primary)] bg-[var(--accent)]"
                      : "border-[var(--border)]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="h-4 w-4 accent-[var(--primary)]"
                  />

                  {amenity}
                </label>
              ))}
            </div>
          </div>
        </div>

        <aside className="surface-card p-6 lg:sticky lg:top-28">
          <div className="mb-6 flex items-center gap-2">
            <ShieldCheck
              size={22}
              className="text-[var(--primary)]"
            />
            <h2 className="text-lg font-bold">
              Host Information
            </h2>
          </div>

          <p className="mb-5 text-sm leading-7 text-[var(--muted)]">
            Your account information will be attached to this
            listing automatically.
          </p>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="owner-name"
                className="mb-2 block text-xs font-semibold"
              >
                Host Name
              </label>

              <input
                id="owner-name"
                value={user?.name || ""}
                readOnly
                className="input-field cursor-not-allowed opacity-70"
              />
            </div>

            <div>
              <label
                htmlFor="owner-email"
                className="mb-2 block text-xs font-semibold"
              >
                Host Email
              </label>

              <input
                id="owner-email"
                value={user?.email || ""}
                readOnly
                className="input-field cursor-not-allowed opacity-70"
              />
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-xl bg-[var(--accent)] p-4">
            <Camera
              size={19}
              className="shrink-0 text-[var(--primary)]"
            />

            <p className="text-xs leading-6 text-[var(--muted)]">
              Provide accurate studio details and clear images
              so creators know what to expect.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="button-primary mt-7 w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                Publish Studio
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </aside>
      </form>
    </section>
  );
}
