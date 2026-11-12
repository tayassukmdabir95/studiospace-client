"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function PrivateLayout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}