import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import ArticleCard from "@/components/home/ArticleCard";
import { categoryLabels, type Category as CategoryType } from "@/data/articles";
import { useEffect } from "react";
import type { Article } from "@/data/articles";
import { useToast } from "@/hooks/use-toast";
import { useRealtimePublishedArticles } from "@/hooks/useRealtimePublishedArticles";

const validCategories: CategoryType[] = ["actualite", "sante", "cours", "histoires", "buzz"];

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = slug as CategoryType;
  const { toast } = useToast();
  const { articles, loading, error } = useRealtimePublishedArticles({
    category: validCategories.includes(category) ? category : undefined,
    orderBy: "published_at",
  });

  useEffect(() => {
    if (error) toast({ title: "Erreur", description: error, variant: "destructive" });
  }, [error, toast]);

  if (!validCategories.includes(category)) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-6xl mb-4">🐝</p>
        <h1 className="font-heading text-2xl font-bold mb-4">Catégorie introuvable</h1>
        <Link to="/" className="text-primary font-medium hover:underline">← Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-10">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
      </Link>

      <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">
        {categoryLabels[category]}
      </h1>
      <p className="text-muted-foreground mb-8">
        {loading ? "…" : `${articles.length} article${articles.length !== 1 ? "s" : ""} dans cette catégorie`}
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>
          {articles.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-4xl mb-4">🐝</p>
              <p>Aucun article dans cette catégorie pour le moment.</p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
