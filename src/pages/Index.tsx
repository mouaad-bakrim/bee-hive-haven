import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TrendingUp, Eye, Instagram, Facebook } from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import ArticleCard from "@/components/home/ArticleCard";
import { categoryLabels, categoryColors, type Category } from "@/data/articles";
import type { Article } from "@/data/articles";
import { useToast } from "@/hooks/use-toast";
import { useRealtimePublishedArticles } from "@/hooks/useRealtimePublishedArticles";

const ITEMS_PER_PAGE = 7;
const ALL_CATEGORIES: (Category | "all")[] = ["all", "actualite", "sante", "cours", "histoires", "buzz"];

function getCategoryCounts(articles: Article[]): Record<Category, number> {
  const counts: Record<Category, number> = { actualite: 0, sante: 0, cours: 0, histoires: 0, buzz: 0 };
  articles.forEach((a) => {
    if (counts[a.category] !== undefined) counts[a.category]++;
  });
  return counts;
}

export default function Index() {
  const [category, setCategory] = useState<Category | "all">("all");
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const { articles, loading, error } = useRealtimePublishedArticles({ orderBy: "published_at" });

  useEffect(() => {
    if (error) toast({ title: "Erreur", description: error, variant: "destructive" });
  }, [error, toast]);

  const filtered = useMemo(() => {
    if (category === "all") return articles;
    return articles.filter((a) => a.category === category);
  }, [category, articles]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const popular = useMemo(() => [...articles].sort((a, b) => b.views - a.views).slice(0, 5), [articles]);
  const counts = useMemo(() => getCategoryCounts(articles), [articles]);

  const handleCategoryChange = (cat: Category | "all") => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <>
      <HeroSection />

      <section id="articles" className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-2 mb-8">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                category === cat
                  ? "honey-gradient text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat === "all" ? "Tous" : categoryLabels[cat]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <span className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {paginated.map((article, i) => (
                    <ArticleCard key={article.id} article={article} index={i} />
                  ))}
                </div>
                {paginated.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <p className="text-4xl mb-4">🐝</p>
                    <p>Aucun article trouvé dans cette catégorie.</p>
                  </div>
                )}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setPage(i + 1);
                          document.getElementById("articles")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`w-10 h-10 rounded-full text-sm font-semibold transition-all ${
                          page === i + 1
                            ? "honey-gradient text-primary-foreground shadow-md"
                            : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="space-y-8">
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> Ça fait le buzz 🐝
                </h3>
                <div className="space-y-3">
                  {popular.slice(0, 4).map((a) => (
                    <Link key={a.id} to={`/article/${a.slug}`} className="flex gap-3 group">
                      <img src={a.coverImage || "https://placehold.co/64x48?text=🐝"} alt="" className="w-16 h-12 rounded-md object-cover flex-shrink-0" loading="lazy" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">{a.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-primary" /> Les plus lus
                </h3>
                <div className="space-y-3">
                  {popular.slice(0, 5).map((a, i) => (
                    <Link key={a.id} to={`/article/${a.slug}`} className="flex items-start gap-3 group">
                      <span className="text-2xl font-heading font-bold text-primary/30">{i + 1}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">{a.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{a.views.toLocaleString()} vues</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-heading font-bold text-foreground mb-4">📂 Catégories</h3>
                <div className="space-y-2">
                  {(Object.keys(counts) as Category[]).map((cat) => (
                    <Link key={cat} to={`/categorie/${cat}`} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary/50 transition-colors">
                      <span className="text-sm font-medium text-foreground">{categoryLabels[cat]}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-semibold">{counts[cat]}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-5 text-center">
                <h3 className="font-heading font-bold text-foreground mb-3">📱 Suivez-nous</h3>
                <div className="flex justify-center gap-3">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                    <Facebook className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
