"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

/**
 * Decode a JWT payload without a library.
 * Returns null if the token is malformed.
 */
function decodeTokenPayload(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

/**
 * Returns true if the token is missing, malformed, or expired.
 */
function isTokenExpired(token) {
  if (!token) return true;
  const payload = decodeTokenPayload(token);
  if (!payload || !payload.exp) return true;
  // exp is in seconds, Date.now() is in ms
  return Date.now() >= payload.exp * 1000;
}

/**
 * Returns ms remaining until the token expires, or 0 if already expired.
 */
function msUntilExpiry(token) {
  if (!token) return 0;
  const payload = decodeTokenPayload(token);
  if (!payload || !payload.exp) return 0;
  return Math.max(0, payload.exp * 1000 - Date.now());
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const expiryTimerRef = useRef(null);

  const clearExpiryTimer = useCallback(() => {
    if (expiryTimerRef.current) {
      clearTimeout(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }
  }, []);

  const logout = useCallback(() => {
    clearExpiryTimer();
    setUser(null);
    setToken(null);
    localStorage.removeItem("swd_user");
    router.push("/login");
  }, [router, clearExpiryTimer]);

  /**
   * Schedule an automatic logout when the token expires.
   */
  const scheduleAutoLogout = useCallback(
    (tokenValue) => {
      clearExpiryTimer();
      const remaining = msUntilExpiry(tokenValue);
      if (remaining <= 0) {
        logout();
        return;
      }
      // setTimeout max is ~24.8 days (2^31 ms). Clamp to be safe.
      const delay = Math.min(remaining, 2_147_483_647);
      expiryTimerRef.current = setTimeout(() => {
        logout();
      }, delay);
    },
    [logout, clearExpiryTimer]
  );

  // On mount: restore session and immediately validate token expiry
  useEffect(() => {
    try {
      const stored = localStorage.getItem("swd_user");
      if (stored) {
        const data = JSON.parse(stored);
        if (isTokenExpired(data.token)) {
          // Token already expired — clear everything and don't restore session
          localStorage.removeItem("swd_user");
        } else {
          setUser(data.user);
          setToken(data.token);
          scheduleAutoLogout(data.token);
        }
      }
    } catch {
      localStorage.removeItem("swd_user");
    } finally {
      setLoading(false);
    }
    return () => clearExpiryTimer();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(
    (userData, tokenValue) => {
      setUser(userData);
      setToken(tokenValue);
      localStorage.setItem(
        "swd_user",
        JSON.stringify({ user: userData, token: tokenValue })
      );
      scheduleAutoLogout(tokenValue);

      // Redirect based on role
      if (userData.role === "csa") {
        router.push("/csa-portal");
      } else if (userData.role === "club") {
        router.push("/club-portal");
      }
    },
    [router, scheduleAutoLogout]
  );

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
