import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Share2, User, Loader2 } from "lucide-react";
import { categoryLabels, categoryColors } from "@/data/articles";
import { getArticleBySlug, incrementViews } from "@/features/articles/articles.api";
import { mapPostToArticle } from "@/features/articles/mapPostToArticle";
import { useEffect, useState, useRef } from "react";
import type { Article } from "@/data/articles";
import { useToast } from "@/hooks/use-toast";
import { useTimeAgo } from "@/hooks/useTimeAgo";
import {
  getComments,
  createComment,
  validateCommentInput,
  type CommentRow,
} from "@/features/comments/comments.api";
import { formatTimeAgo } from "@/lib/formatTimeAgo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const incrementedSlugRef = useRef<string | null>(null);
  const { toast } = useToast();
  const timeAgo = useTimeAgo(article?.date ?? null);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentName, setCommentName] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    getArticleBySlug(slug)
      .then((row) => {
        if (cancelled) return;
        setArticle(row ? mapPostToArticle(row) : null);
        if (row && incrementedSlugRef.current !== slug) {
          incrementedSlugRef.current = slug;
          incrementViews(row.id).catch(() => {});
        }
      })
      .catch((err) => {
        if (!cancelled) {
          toast({ title: "Erreur", description: err?.message || "Impossible de charger l'article.", variant: "destructive" });
          setArticle(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug, toast]);

  const fetchComments = (articleId: string) => {
    setCommentsLoading(true);
    getComments(articleId)
      .then(setComments)
      .catch(() => setComments([]))
      .finally(() => setCommentsLoading(false));
  };

  useEffect(() => {
    if (article?.id) fetchComments(article.id);
  }, [article?.id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article) return;
    const validation = validateCommentInput(commentName, commentContent);
    if (!validation.ok) {
      toast({ title: "Erreur", description: (validation as { ok: false; error: string }).error, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await createComment({
        post_id: article.id,
        author_name: commentName.trim(),
        content: commentContent.trim(),
      });
      setCommentName("");
      setCommentContent("");
      toast({ title: "Commentaire publié" });
      fetchComments(article.id);
    } catch (err: any) {
      toast({ title: "Erreur", description: err?.message ?? "Impossible de publier le commentaire.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <span className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-6xl mb-4">🐝</p>
        <h1 className="font-heading text-2xl font-bold mb-4">Article introuvable</h1>
        <Link to="/" className="text-primary font-medium hover:underline">← Retour à l'accueil</Link>
      </div>
    );
  }

  const handleShare = () => {
    const url = window.location.href;
    const title = article.title;
    const text = article.excerpt ? article.excerpt : title;

    (async () => {
      try {
        if (navigator.share) {
          await navigator.share({ title, text, url });
          return;
        }
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url);
          toast({ title: "Lien copié !" });
          return;
        }
        const el = document.createElement("textarea");
        el.value = url;
        el.setAttribute("readonly", "true");
        el.style.position = "fixed";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        toast({ title: "Lien copié !" });
      } catch {
        toast({ title: "Erreur", description: "Impossible de partager pour le moment.", variant: "destructive" });
      }
    })();
  };

  const dateStr = article.date ? new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="relative h-[45vh] min-h-[320px]">
        <img
          src={article.coverImage || "https://placehold.co/1200x600?text=🐝"}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 h-full flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-background/70 hover:text-background mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Retour
            </Link>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3 ${categoryColors[article.category]}`}>
              {categoryLabels[article.category]}
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-background leading-tight max-w-3xl">
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center gap-4 py-5 border-b border-border text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" /> {article.author}
          </span>
          {(timeAgo || dateStr) && (
            <span className="flex items-center gap-1.5" title={dateStr}>
              <Calendar className="w-4 h-4" /> {timeAgo || dateStr}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> {article.readTime} min de lecture
          </span>
          <button onClick={handleShare} className="ml-auto flex items-center gap-1.5 text-primary hover:underline font-medium">
            <Share2 className="w-4 h-4" /> Partager
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          {article.content ? (
            <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />
          ) : (
            <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
              <p className="text-4xl mb-3">🐝</p>
              <p>Contenu indisponible pour cet article.</p>
            </div>
          )}

          {article.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link key={tag} to={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`} className="tag-badge hover:bg-primary hover:text-primary-foreground transition-colors">
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 p-6 bg-secondary rounded-xl text-center">
            <p className="font-heading font-bold mb-3">🐝 Cet article vous a plu ?</p>
            <p className="text-sm text-muted-foreground mb-4">Partagez-le avec d'autres passionnés d'apiculture !</p>
            <div className="flex justify-center gap-3">
              <button onClick={handleShare} className="px-5 py-2.5 rounded-full honey-gradient text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Partager
              </button>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="font-heading text-2xl font-bold mb-4">💬 Commentaires</h2>

            <form onSubmit={handleSubmitComment} className="bg-card rounded-xl border border-border p-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Nom</label>
                  <Input
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    placeholder="Votre nom"
                    maxLength={100}
                    className="bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Commentaire</label>
                  <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Votre message…"
                    maxLength={2000}
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{commentContent.length}/2000</p>
                </div>
                <Button type="submit" disabled={submitting} className="honey-gradient text-primary-foreground gap-1.5">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Publier le commentaire
                </Button>
              </div>
            </form>

            {commentsLoading ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : comments.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
                <p className="text-4xl mb-3">🐝</p>
                <p>Soyez le premier à commenter cet article.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {comments.map((c) => (
                  <li key={c.id} className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span className="font-medium text-foreground">{c.author_name}</span>
                      <span>·</span>
                      <span>{formatTimeAgo(c.created_at) || "—"}</span>
                    </div>
                    <p className="text-foreground whitespace-pre-wrap">{c.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
