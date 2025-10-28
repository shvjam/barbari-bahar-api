import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = !!localStorage.getItem("authToken");

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
