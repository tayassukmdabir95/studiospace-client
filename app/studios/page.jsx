
import { Suspense } from "react";
import ExploreStudios from "@/components/studios/ExploreStudios";

export const metadata = {
  title: "Explore Studios | StudioSpace",
  description:
    "Discover creative studios for photography, film, podcasts, music, and art projects.",
};

export default function StudiosPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[65vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]" />
        </div>
      }
    >
      <ExploreStudios />
    </Suspense>
  );
}
