import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Share2, Facebook, Instagram, User } from "lucide-react";
import { getArticleBySlug, categoryLabels, categoryColors } from "@/data/articles";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = getArticleBySlug(slug || "");

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
    if (navigator.share) {
      navigator.share({ title: article.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero Banner */}
      <div className="relative h-[45vh] min-h-[320px]">
        <img src={article.coverImage} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
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

      {/* Meta bar */}
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center gap-4 py-5 border-b border-border text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" /> {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> {article.readTime} min de lecture
          </span>
          <button onClick={handleShare} className="ml-auto flex items-center gap-1.5 text-primary hover:underline font-medium">
            <Share2 className="w-4 h-4" /> Partager
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          <div className="mt-10 pt-6 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={tag} className="tag-badge">#{tag}</span>
              ))}
            </div>
          </div>

          {/* Share */}
          <div className="mt-8 p-6 bg-secondary rounded-xl text-center">
            <p className="font-heading font-bold mb-3">🐝 Cet article vous a plu ?</p>
            <p className="text-sm text-muted-foreground mb-4">Partagez-le avec d'autres passionnés d'apiculture !</p>
            <div className="flex justify-center gap-3">
              <button onClick={handleShare} className="px-5 py-2.5 rounded-full honey-gradient text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Partager
              </button>
            </div>
          </div>

          {/* Comments placeholder */}
          <div className="mt-10">
            <h2 className="font-heading text-2xl font-bold mb-4">💬 Commentaires</h2>
            <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
              <p className="text-4xl mb-3">🐝</p>
              <p>La section commentaires sera bientôt disponible.</p>
              <p className="text-sm mt-1">En attendant, partagez vos réactions sur nos réseaux sociaux !</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
