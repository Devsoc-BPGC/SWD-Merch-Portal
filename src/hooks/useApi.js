"use client";

import { useCallback } from "react";
import api from "@/lib/api";
import useAuth from "@/hooks/useAuth";

export default function useApi() {
  const { logout } = useAuth();

  const handleError = useCallback(
    (error) => {
      if (error.response?.status === 401) {
        logout();
      }
      throw error;
    },
    [logout]
  );

  const get = useCallback(
    (url, config) => api.get(url, config).catch(handleError),
    [handleError]
  );

  const post = useCallback(
    (url, data, config) => api.post(url, data, config).catch(handleError),
    [handleError]
  );

  const put = useCallback(
    (url, data, config) => api.put(url, data, config).catch(handleError),
    [handleError]
  );

  const del = useCallback(
    (url, config) => api.delete(url, config).catch(handleError),
    [handleError]
  );

  return { get, post, put, del };
}
