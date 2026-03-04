import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { getPublishedArticles, type GetPublishedOptions } from "@/features/articles/articles.api";
import { mapPostToArticle } from "@/features/articles/mapPostToArticle";
import type { Article } from "@/data/articles";

const CHANNEL_NAME = "posts-realtime";

/**
 * Fetches published articles and subscribes to Supabase Realtime for the posts table.
 * On INSERT/UPDATE/DELETE, refetches so the list updates without manual refresh.
 * Enable Realtime for the table: Database → Replication → add "posts" to supabase_realtime publication.
 */
export function useRealtimePublishedArticles(
  options: GetPublishedOptions = {}
): { articles: Article[]; loading: boolean; error: string | null; refetch: () => Promise<void> } {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const category = options.category;
  const orderBy = options.orderBy ?? "published_at";
  const limit = options.limit;

  const refetch = useCallback(async () => {
    try {
      const rows = await getPublishedArticles({ category, orderBy, limit });
      setArticles(rows.map(mapPostToArticle));
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "Erreur chargement");
      setArticles([]);
    }
  }, [category, orderBy, limit]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    refetch().finally(() => {
      if (!cancelled) setLoading(false);
    });

    const channel = supabase
      .channel(`${CHANNEL_NAME}-${category ?? "all"}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        () => {
          if (!cancelled) refetch();
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [refetch, category]);

  return { articles, loading, error, refetch };
}
