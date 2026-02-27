import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import ArticleCard from "@/components/home/ArticleCard";
import { articles } from "@/data/articles";

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";

  const results = query.trim()
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          a.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-10">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour
      </Link>

      <h1 className="font-heading text-3xl font-bold mb-2">
        Résultats pour « {query} »
      </h1>
      <p className="text-muted-foreground mb-8">{results.length} résultat{results.length > 1 ? "s" : ""}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((a, i) => (
          <ArticleCard key={a.id} article={a} index={i} />
        ))}
      </div>

      {results.length === 0 && query && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-4xl mb-4">🐝</p>
          <p>Aucun résultat trouvé. Essayez d'autres mots-clés !</p>
        </div>
      )}
    </motion.div>
  );
}
