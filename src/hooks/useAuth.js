"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("swd_user");
      if (stored) {
        const data = JSON.parse(stored);
        setUser(data.user);
        setToken(data.token);
      }
    } catch {
      localStorage.removeItem("swd_user");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    (userData, tokenValue) => {
      setUser(userData);
      setToken(tokenValue);
      localStorage.setItem(
        "swd_user",
        JSON.stringify({ user: userData, token: tokenValue })
      );

      // Redirect based on role
      if (userData.role === "csa") {
        router.push("/csa-portal");
      } else if (userData.role === "club") {
        router.push("/club-portal");
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("swd_user");
    router.push("/login");
  }, [router]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
