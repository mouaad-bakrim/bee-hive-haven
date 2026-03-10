import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRealtimePublishedArticles } from "@/hooks/useRealtimePublishedArticles";
import ArticleCard from "@/components/home/ArticleCard";
import { useMemo } from "react";

export default function TagPage() {
  const { slug } = useParams<{ slug: string }>();
  const { articles, loading } = useRealtimePublishedArticles({ orderBy: "published_at" });

  const filtered = useMemo(
    () => articles.filter((a) => a.tags.some((t) => t.toLowerCase().replace(/\s+/g, "-") === slug)),
    [articles, slug]
  );

  const tagName = slug?.replace(/-/g, " ") ?? "";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-12">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4" /> Retour
      </Link>
      <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
        🏷️ #{tagName}
      </h1>
      <p className="text-muted-foreground mb-8">{filtered.length} article{filtered.length > 1 ? "s" : ""}</p>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground">
          <p className="text-4xl mb-3">🐝</p>
          <p>Aucun article avec ce tag.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((a, i) => (
            <ArticleCard key={a.id} article={a} index={i} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
