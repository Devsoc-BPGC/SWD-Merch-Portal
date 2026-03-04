"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

/**
 * Decode JWT payload client-side (no library needed).
 */
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    if (!payload.exp) return true;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export default function AuthGuard({ children, allowedRoles = [] }) {
  const { user, token, loading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // Check token expiry whenever the tab becomes visible again
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === "visible" && token && isTokenExpired(token)) {
      logout();
    }
  }, [token, logout]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [handleVisibilityChange]);

  useEffect(() => {
    if (loading) return;

    // If token exists but is expired, force logout immediately
    if (token && isTokenExpired(token)) {
      logout();
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
      router.replace("/unauthorized");
    }
  }, [loading, isAuthenticated, user, token, allowedRoles, router, logout]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (token && isTokenExpired(token)) return null;
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) return null;

  return <>{children}</>;
}
