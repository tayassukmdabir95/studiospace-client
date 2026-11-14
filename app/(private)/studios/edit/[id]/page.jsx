
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  Pencil,
  ImagePlus,
  ShieldCheck,
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

const amenityOptions = [
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

export default function EditStudioPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState(initialForm);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || !user?.email) return;

    const controller = new AbortController();

    async function loadStudio() {
      setLoading(true);
      setError("");

      try {
        const data = await apiRequest(
          `/api/studios/${encodeURIComponent(id)}`,
          { signal: controller.signal }
        );

        const studio = data.studio || data;

        if (!studio?._id) {
          throw new Error("Studio information is unavailable");
        }

        if (
          String(studio.ownerEmail || "").toLowerCase() !==
          user.email.toLowerCase()
        ) {
          throw new Error("You are not the owner of this studio");
        }

        if (controller.signal.aborted) return;

        setFormData({
          title: studio.title || "",
          category: studio.category || "",
          hourlyRate: String(studio.hourlyRate ?? ""),
          securityDeposit: String(studio.securityDeposit ?? ""),
          maxCapacity: String(studio.maxCapacity ?? ""),
          location:
            typeof studio.location === "string"
              ? studio.location
              : studio.location?.city || "",
          address: studio.address || "",
          image:
            studio.image ||
            studio.imageURL ||
            studio.imageUrl ||
            "",
          description:
            studio.description || studio.overview || "",
        });

        setAmenities(
          Array.isArray(studio.amenities) ? studio.amenities : []
        );
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Failed to load studio");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadStudio();

    return () => controller.abort();
  }, [id, user?.email]);

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

    const title = formData.title.trim();
    const location = formData.location.trim();
    const address = formData.address.trim();
    const image = formData.image.trim();
    const description = formData.description.trim();

    const hourlyRate = Number(formData.hourlyRate);
    const securityDeposit = Number(formData.securityDeposit);
    const maxCapacity = Number(formData.maxCapacity);

    if (
      !title ||
      !formData.category ||
      !location ||
      !address ||
      !image ||
      !description ||
      formData.hourlyRate === "" ||
      formData.securityDeposit === "" ||
      formData.maxCapacity === ""
    ) {
      toast.error("Please complete all required fields");
      return;
    }

    try {
      const imageURL = new URL(image);

      if (!["http:", "https:"].includes(imageURL.protocol)) {
        throw new Error("Invalid URL");
      }
    } catch {
      toast.error("Please enter a valid image URL");
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
      await apiRequest(`/api/studios/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify({
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
        }),
      });

      toast.success("Studio updated successfully!");
      router.replace("/my-listings");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Failed to update studio");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center gap-3">
        <LoaderCircle
          size={30}
          className="animate-spin text-[var(--primary)]"
        />
        <p className="text-sm text-[var(--muted)]">
          Loading studio information...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <section className="container-shell flex min-h-[65vh] flex-col items-center justify-center text-center">
        <ShieldCheck size={48} className="text-[var(--primary)]" />

        <h1 className="mt-6 text-2xl font-bold">
          Cannot edit this studio
        </h1>

        <p className="mt-4 text-sm text-[var(--muted)]">
          {error}
        </p>

        <Link href="/my-listings" className="button-primary mt-7">
          Back to My Listings
        </Link>
      </section>
    );
  }

  return (
    <section className="container-shell py-12 sm:py-16">
      <Link
        href="/my-listings"
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)]"
      >
        <ArrowLeft size={17} />
        Back to My Listings
      </Link>

      <div className="mb-10">
        <span className="eyebrow">MANAGE YOUR CREATIVE SPACE</span>

        <h1 className="display-title mt-4">
          Edit <span className="text-[var(--primary)]">Studio</span>
        </h1>

        <p className="mt-4 text-sm text-[var(--muted)]">
          Update the details of your existing studio listing.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_310px]"
      >
        <div className="space-y-7">
          <div className="surface-card space-y-6 p-6 sm:p-9">
            <h2 className="flex items-center gap-3 text-xl font-bold">
              <Pencil size={22} className="text-[var(--primary)]" />
              Basic Information
            </h2>

            <div>
              <label htmlFor="edit-title" className="mb-2 block text-sm font-semibold">
                Studio Title *
              </label>
              <input
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                maxLength={120}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="edit-category" className="mb-2 block text-sm font-semibold">
                Category *
              </label>
              <select
                id="edit-category"
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
              <label htmlFor="edit-description" className="mb-2 block text-sm font-semibold">
                Detailed Overview *
              </label>
              <textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                minLength={20}
                className="input-field resize-y"
                required
              />
            </div>
          </div>

          <div className="surface-card p-6 sm:p-9">
            <h2 className="mb-6 text-xl font-bold">
              Pricing & Capacity
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              {[
                {
                  name: "hourlyRate",
                  label: "Hourly Rate ($)",
                  min: "0.01",
                  step: "0.01",
                },
                {
                  name: "securityDeposit",
                  label: "Security Deposit ($)",
                  min: "0",
                  step: "0.01",
                },
                {
                  name: "maxCapacity",
                  label: "Maximum Capacity",
                  min: "1",
                  step: "1",
                },
              ].map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={`edit-${field.name}`}
                    className="mb-2 block text-sm font-semibold"
                  >
                    {field.label} *
                  </label>

                  <input
                    id={`edit-${field.name}`}
                    name={field.name}
                    type="number"
                    min={field.min}
                    step={field.step}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card space-y-5 p-6 sm:p-9">
            <h2 className="text-xl font-bold">Location</h2>

            <div>
              <label htmlFor="edit-location" className="mb-2 block text-sm font-semibold">
                Area / City *
              </label>
              <input
                id="edit-location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="edit-address" className="mb-2 block text-sm font-semibold">
                Full Address *
              </label>
              <input
                id="edit-address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="surface-card p-6 sm:p-9">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold">
              <ImagePlus size={23} className="text-[var(--primary)]" />
              Studio Image
            </h2>

            <label htmlFor="edit-image" className="mb-2 block text-sm font-semibold">
              Image URL *
            </label>
            <input
              id="edit-image"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              className="input-field"
              required
            />

            {formData.image && (
              <div className="mt-5 overflow-hidden rounded-xl bg-[var(--accent)]">
                <img
                  src={formData.image}
                  alt="Studio preview"
                  className="aspect-video w-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="surface-card p-6 sm:p-9">
            <h2 className="mb-6 text-xl font-bold">
              Available Amenities
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              {amenityOptions.map((amenity) => (
                <label
                  key={amenity}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm ${
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
          <h2 className="mb-6 flex items-center gap-2 text-lg font-bold">
            <ShieldCheck size={21} className="text-[var(--primary)]" />
            Host Information
          </h2>

          <div className="space-y-5">
            <div>
              <label htmlFor="edit-owner-name" className="mb-2 block text-sm font-semibold">
                Host Name
              </label>
              <input
                id="edit-owner-name"
                value={user?.name || ""}
                readOnly
                className="input-field cursor-not-allowed opacity-70"
              />
            </div>

            <div>
              <label htmlFor="edit-owner-email" className="mb-2 block text-sm font-semibold">
                Host Email
              </label>
              <input
                id="edit-owner-email"
                value={user?.email || ""}
                readOnly
                className="input-field cursor-not-allowed opacity-70"
              />
            </div>
          </div>

          <p className="mt-6 text-xs leading-6 text-[var(--muted)]">
            Your host identity cannot be changed from this form.
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="button-primary mt-7 w-full disabled:opacity-50"
          >
            {submitting ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                Save Changes
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </aside>
      </form>
    </section>
  );
}
