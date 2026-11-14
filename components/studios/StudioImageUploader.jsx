
"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import {
  ImagePlus,
  LoaderCircle,
  CheckCircle2,
  X,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function StudioImageUploader({
  value = "",
  onChange,
}) {
  const inputId = useId();

  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  async function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file || uploading) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a JPG, PNG or WebP image");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB");
      event.target.value = "";
      return;
    }

    if (!API_URL) {
      toast.error("API URL is not configured");
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    setImageError(false);

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Image upload failed"
        );
      }

      if (!data.imageUrl) {
        throw new Error("No image URL was returned");
      }

      onChange(data.imageUrl);
      setPreviewUrl(data.imageUrl);
      setImageError(false);

      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error(
        error.message || "Unable to upload image"
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function handleUrlChange(event) {
    const newUrl = event.target.value;

    onChange(newUrl);
    setPreviewUrl(newUrl);
    setImageError(false);
  }

  function handleRemove() {
    onChange("");
    setPreviewUrl("");
    setImageError(false);
  }

  const imageUrl = value || "";

  return (
    <div className="space-y-4">
      <label
        htmlFor={inputId}
        className="block text-sm font-semibold"
      >
        Upload Studio Image
      </label>

      <label
        htmlFor={inputId}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--accent)] px-5 py-10 text-center transition-colors hover:border-[var(--primary)] ${
          uploading
            ? "pointer-events-none opacity-60"
            : ""
        }`}
      >
        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={uploading}
          className="sr-only"
        />

        {uploading ? (
          <>
            <LoaderCircle
              size={34}
              className="animate-spin text-[var(--primary)]"
            />

            <p className="mt-4 text-sm font-semibold">
              Uploading image...
            </p>
          </>
        ) : (
          <>
            <ImagePlus
              size={36}
              className="text-[var(--primary)]"
            />

            <p className="mt-4 text-sm font-bold">
              Click to select an image
            </p>

            <p className="mt-2 text-xs text-[var(--muted)]">
              JPG, PNG or WebP · Maximum 5 MB
            </p>
          </>
        )}
      </label>

      <div>
        <label
          htmlFor={`${inputId}-url`}
          className="mb-2 block text-sm font-semibold"
        >
          Image URL
        </label>

        <input
          id={`${inputId}-url`}
          type="url"
          value={imageUrl}
          onChange={handleUrlChange}
          placeholder="Or paste a hosted image URL"
          className="input-field"
          disabled={uploading}
        />

        <p className="mt-2 text-xs text-[var(--muted)]">
          Upload from your computer or paste a direct
          image URL.
        </p>
      </div>

      {imageUrl && (
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--accent)]">
          {!imageError ? (
            <img
              key={imageUrl}
              src={imageUrl}
              alt="Studio image preview"
              className="aspect-video w-full object-cover"
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
            />
          ) : (
            <div className="flex aspect-video items-center justify-center text-sm text-[var(--muted)]">
              Could not preview this image
            </div>
          )}

          <button
            type="button"
            onClick={handleRemove}
            disabled={uploading}
            aria-label="Remove image"
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white disabled:opacity-50"
          >
            <X size={18} />
          </button>

          {!imageError && (
            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-green-700">
              <CheckCircle2 size={15} />
              Image ready
            </div>
          )}
        </div>
      )}
    </div>
  );
}
