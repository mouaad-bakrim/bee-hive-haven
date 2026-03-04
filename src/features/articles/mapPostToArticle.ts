import type { Article, Category } from "@/data/articles";
import type { PostRow } from "./articles.api";

const DEFAULT_AUTHOR = "Le Coin des Apiculteurs";
const VALID_CATEGORIES: Category[] = ["actualite", "sante", "cours", "histoires", "buzz"];

function estimateReadTime(html: string | null): number {
  if (!html) return 5;
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Map a Supabase post row to the public Article shape used by ArticleCard and Article page.
 */
export function mapPostToArticle(post: PostRow): Article {
  const category = VALID_CATEGORIES.includes(post.category as Category)
    ? (post.category as Category)
    : "actualite";
  const date = post.published_at || post.created_at;
  const contentHtml =
    ((post as unknown as { content_html?: string | null }).content_html ??
      post.content) ||
    "";
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || "",
    content: contentHtml,
    category,
    tags: post.tags || [],
    coverImage: post.cover_url || "",
    author: DEFAULT_AUTHOR,
    date: typeof date === "string" ? date : new Date(date).toISOString(),
    readTime: estimateReadTime(contentHtml),
    featured: post.featured ?? false,
    views: post.views ?? 0,
  };
}
