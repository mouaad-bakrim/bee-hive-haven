import { supabase } from "@/lib/supabase";
import type { Tables } from "@/integrations/supabase/types";

export type PostRow = Tables<"posts">;

export interface GetPublishedOptions {
  category?: string;
  orderBy?: "published_at" | "views";
  limit?: number;
}

/**
 * Public: fetch only published articles, ordered by published_at desc (or views for "most read").
 */
export async function getPublishedArticles(options: GetPublishedOptions = {}) {
  const { category, orderBy = "published_at", limit } = options;
  let q = supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order(orderBy === "views" ? "views" : "published_at", {
      ascending: false,
      nullsFirst: false,
    });
  if (category) q = q.eq("category", category);
  if (limit != null) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []) as PostRow[];
}

/**
 * Public: fetch a single published article by slug.
 */
export async function getArticleBySlug(slug: string): Promise<PostRow | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return data as PostRow | null;
}

/**
 * Admin: fetch all articles (draft + published).
 */
export async function getArticlesAdmin(): Promise<PostRow[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as PostRow[];
}

export interface CreateArticlePayload {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  category?: string;
  tags?: string[];
  cover_url?: string;
  featured?: boolean;
  status?: "draft" | "published";
  meta_title?: string;
  meta_description?: string;
  author_id?: string;
  published_at?: string | null;
}

/**
 * Admin: create article. Returns inserted row (with id).
 */
export async function createArticle(payload: CreateArticlePayload) {
  const { data, error } = await supabase
    .from("posts")
    .insert({
      title: payload.title,
      slug: payload.slug,
      excerpt: payload.excerpt ?? "",
      content: payload.content ?? "",
      category: payload.category ?? "actualite",
      tags: payload.tags ?? [],
      cover_url: payload.cover_url ?? null,
      featured: payload.featured ?? false,
      status: payload.status ?? "draft",
      meta_title: payload.meta_title ?? null,
      meta_description: payload.meta_description ?? null,
      author_id: payload.author_id ?? null,
      published_at: payload.published_at ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as PostRow;
}

export interface UpdateArticlePayload {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  tags?: string[];
  cover_url?: string;
  featured?: boolean;
  status?: "draft" | "published";
  meta_title?: string;
  meta_description?: string;
  published_at?: string | null;
}

/**
 * Admin: update article by id.
 */
export async function updateArticle(id: string, payload: UpdateArticlePayload) {
  const { data, error } = await supabase
    .from("posts")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as PostRow;
}

/**
 * Admin: delete article.
 */
export async function deleteArticle(id: string) {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Admin: set status to published and set published_at to now.
 */
export async function publishArticle(id: string) {
  return updateArticle(id, {
    status: "published",
    published_at: new Date().toISOString(),
  });
}

/**
 * Admin: set status to draft and clear published_at.
 */
export async function saveDraft(id: string) {
  return updateArticle(id, { status: "draft", published_at: null });
}

/**
 * Public: increment view count (uses SECURITY DEFINER RPC; no service role needed).
 */
export async function incrementViews(postId: string) {
  const { error } = await supabase.rpc("increment_post_view", {
    p_post_id: postId,
  });
  if (error) throw error;
}
