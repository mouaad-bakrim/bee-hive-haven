import { useState, useEffect } from "react";
import { formatTimeAgo } from "@/lib/formatTimeAgo";

const UPDATE_INTERVAL_MS = 60_000; // 1 minute

/**
 * Returns a time-ago string that auto-updates every minute.
 * Use for published_at so "il y a 5 min" stays correct without refresh.
 */
export function useTimeAgo(date: Date | string | null | undefined): string {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), UPDATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return formatTimeAgo(date) || "—";
}
