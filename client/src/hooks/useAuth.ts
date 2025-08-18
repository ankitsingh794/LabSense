// src/hooks/useAuth.ts
import { useEffect, useState, useCallback } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  // Refresh token logic
  const refreshAccessToken = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include", 
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("accessToken", data.accessToken);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem("accessToken");
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      refreshAccessToken();
    }
  }, [refreshAccessToken]);

  return { isAuthenticated, loading, refreshAccessToken };
};
