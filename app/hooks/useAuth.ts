"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ADMIN_PASSWORD = "Jewel12345";
const AUTH_TOKEN_KEY = "art_gallery_admin_auth";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      setIsAuthenticated(token === "authenticated");
    }
  }, []);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_TOKEN_KEY, "authenticated");
        setIsAuthenticated(true);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setIsAuthenticated(false);
      router.push("/login");
    }
  };

  const checkAuth = (): boolean => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      return token === "authenticated";
    }
    return false;
  };

  return { isAuthenticated, login, logout, checkAuth };
}
