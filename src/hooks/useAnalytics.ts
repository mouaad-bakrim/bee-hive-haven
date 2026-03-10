import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Period = "today" | "7d" | "30d" | "90d";

export interface AnalyticsData {
  // Real data from DB
  totalArticles: number;
  publishedArticles: number;
  drafts: number;
  totalViews: number;
  featuredCount: number;
  noViewsCount: number;
  totalComments: number;
  pendingComments: number;
  topArticles: { name: string; views: number }[];
  categoryData: { name: string; value: number }[];
  dailyViews: { date: string; views: number }[];
  // Visitor stats not available
  visitorStatsAvailable: false;
}

function getDays(period: Period) {
  return period === "today" ? 1 : period === "7d" ? 7 : period === "30d" ? 30 : 90;
}

export function useAnalytics(period: Period): { data: AnalyticsData | null; loading: boolean } {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const fetch = async () => {
      try {
        const days = getDays(period);
        const since = new Date(Date.now() - days * 86400000).toISOString().split("T")[0];

        const [postsRes, commentsCountRes, pendingRes, viewsRes] = await Promise.all([
          supabase.from("posts").select("*"),
          (supabase as any).from("comments").select("id", { count: "exact", head: true }),
          (supabase as any).from("comments").select("id", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("post_views_daily").select("view_date, count").gte("view_date", since).order("view_date", { ascending: true }),
        ]);

        if (cancelled) return;

        const posts = postsRes.data ?? [];
        const totalComments = commentsCountRes.count ?? 0;
        const pendingComments = pendingRes.count ?? 0;

        // Aggregate daily views
        const byDate: Record<string, number> = {};
        (viewsRes.data ?? []).forEach((r: any) => {
          byDate[r.view_date] = (byDate[r.view_date] || 0) + (r.count || 0);
        });
        const dailyViews = [];
        for (let i = days - 1; i >= 0; i--) {
          const d = new Date(Date.now() - i * 86400000);
          const key = d.toISOString().split("T")[0];
          dailyViews.push({
            date: d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
            views: byDate[key] || 0,
          });
        }

        // Category counts
        const catCounts: Record<string, number> = {};
        posts.forEach((p) => { catCounts[p.category] = (catCounts[p.category] || 0) + 1; });

        // Top articles
        const topArticles = [...posts]
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 10)
          .map((p) => ({ name: p.title.length > 35 ? p.title.slice(0, 35) + "…" : p.title, views: p.views || 0 }));

        setData({
          totalArticles: posts.length,
          publishedArticles: posts.filter((p) => p.status === "published").length,
          drafts: posts.filter((p) => p.status === "draft").length,
          totalViews: posts.reduce((s, p) => s + (p.views || 0), 0),
          featuredCount: posts.filter((p) => p.featured).length,
          noViewsCount: posts.filter((p) => !p.views || p.views === 0).length,
          totalComments,
          pendingComments,
          topArticles,
          categoryData: Object.entries(catCounts).map(([name, value]) => ({ name, value })),
          dailyViews,
          visitorStatsAvailable: false,
        });
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [period]);

  return { data, loading };
}
