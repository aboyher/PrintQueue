"use client";

import { useState, useEffect, useCallback } from "react";
import { PrintJobWithUser, UserType } from "./types";

export function useUser() {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("printqueue_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("printqueue_user");
      }
    }
  }, []);

  const login = useCallback(async (name: string, avatar?: string) => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, avatar }),
    });
    const u = await res.json();
    setUser(u);
    localStorage.setItem("printqueue_user", JSON.stringify(u));
    return u;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("printqueue_user");
  }, []);

  return { user, login, logout };
}

export function usePrints() {
  const [prints, setPrints] = useState<PrintJobWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrints = useCallback(async () => {
    const res = await fetch("/api/prints");
    const data = await res.json();
    setPrints(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPrints();
    const interval = setInterval(fetchPrints, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [fetchPrints]);

  return { prints, loading, refetch: fetchPrints };
}
