import { supabase } from "@/lib/supabase";

export interface CommentRow {
  id: string;
  article_id: string;
  author_name: string;
  author_email: string | null;
  content: string;
  created_at: string;
}

const COMMENT_CONTENT_MAX_LENGTH = 2000;
const AUTHOR_NAME_MAX_LENGTH = 100;

export function validateCommentInput(
  authorName: string,
  content: string
): { ok: true } | { ok: false; error: string } {
  const name = authorName.trim();
  const text = content.trim();
  if (!name) return { ok: false, error: "Le nom est requis." };
  if (name.length > AUTHOR_NAME_MAX_LENGTH)
    return { ok: false, error: `Le nom ne doit pas dépasser ${AUTHOR_NAME_MAX_LENGTH} caractères.` };
  if (!text) return { ok: false, error: "Le commentaire est requis." };
  if (text.length > COMMENT_CONTENT_MAX_LENGTH)
    return { ok: false, error: `Le commentaire ne doit pas dépasser ${COMMENT_CONTENT_MAX_LENGTH} caractères.` };
  return { ok: true };
}

/**
 * Fetch comments for an article (post), newest first.
 */
export async function getComments(articleId: string): Promise<CommentRow[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("article_id", articleId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as CommentRow[];
}

export interface CreateCommentInput {
  article_id: string;
  author_name: string;
  author_email?: string | null;
  content: string;
}

/**
 * Insert a comment. RLS allows public INSERT.
 */
export async function createComment(input: CreateCommentInput): Promise<CommentRow> {
  const { data, error } = await supabase
    .from("comments")
    .insert({
      article_id: input.article_id,
      author_name: input.author_name.trim(),
      author_email: input.author_email?.trim() || null,
      content: input.content.trim(),
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as CommentRow;
}
