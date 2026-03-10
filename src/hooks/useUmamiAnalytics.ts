import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UmamiStats {
  pageviews: { value: number; prev: number };
  visitors: { value: number; prev: number };
  visits: { value: number; prev: number };
  bounces: { value: number; prev: number };
  totaltime: { value: number; prev: number };
}

export interface UmamiMetric {
  x: string;
  y: number;
}

export interface UmamiData {
  stats: UmamiStats | null;
  activeVisitors: number | null;
  countries: UmamiMetric[];
  devices: UmamiMetric[];
  browsers: UmamiMetric[];
  referrers: UmamiMetric[];
  topPages: UmamiMetric[];
  available: boolean;
  loading: boolean;
  error: string | null;
}

type Period = "today" | "7d" | "30d" | "90d";

function getRange(period: Period) {
  const now = Date.now();
  const ms = period === "today" ? 86400000 : period === "7d" ? 7 * 86400000 : period === "30d" ? 30 * 86400000 : 90 * 86400000;
  return {
    startAt: String(now - ms),
    endAt: String(now),
  };
}

async function callUmami(endpoint: string, params?: Record<string, string>) {
  const { data, error } = await supabase.functions.invoke("umami-proxy", {
    body: { endpoint, params },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

export function useUmamiAnalytics(period: Period): UmamiData {
  const [state, setState] = useState<UmamiData>({
    stats: null,
    activeVisitors: null,
    countries: [],
    devices: [],
    browsers: [],
    referrers: [],
    topPages: [],
    available: true,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    const range = getRange(period);

    try {
      const [stats, active, countries, devices, browsers, referrers, topPages] = await Promise.all([
        callUmami("stats", range),
        callUmami("active"),
        callUmami("metrics", { ...range, type: "country" }),
        callUmami("metrics", { ...range, type: "device" }),
        callUmami("metrics", { ...range, type: "browser" }),
        callUmami("metrics", { ...range, type: "referrer" }),
        callUmami("metrics", { ...range, type: "url" }),
      ]);

      setState({
        stats,
        activeVisitors: active?.[0]?.x ?? active?.x ?? (typeof active === "number" ? active : null),
        countries: Array.isArray(countries) ? countries : [],
        devices: Array.isArray(devices) ? devices : [],
        browsers: Array.isArray(browsers) ? browsers : [],
        referrers: Array.isArray(referrers) ? referrers : [],
        topPages: Array.isArray(topPages) ? topPages.slice(0, 20) : [],
        available: true,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      const msg = err?.message || String(err);
      const notConfigured = msg.includes("UMAMI_API_TOKEN not configured") || msg.includes("401");
      setState((s) => ({
        ...s,
        available: !notConfigured,
        loading: false,
        error: msg,
      }));
    }
  }, [period]);

  // Initial + period change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh active visitors every 30s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const active = await callUmami("active");
        setState((s) => ({
          ...s,
          activeVisitors: active?.[0]?.x ?? active?.x ?? (typeof active === "number" ? active : null),
        }));
      } catch {}
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return state;
}
