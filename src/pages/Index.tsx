import { useState, useMemo, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TrendingUp, Eye, Instagram, Facebook } from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import ArticleCard from "@/components/home/ArticleCard";
import {
  articles,
  categoryLabels,
  categoryColors,
  getPopularArticles,
  getCategoryCounts,
  type Category,
} from "@/data/articles";

const ITEMS_PER_PAGE = 7;
const ALL_CATEGORIES: (Category | "all")[] = ["all", "actualite", "sante", "cours", "histoires", "buzz"];

function SidebarSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton h-16 w-full" />
      ))}
    </div>
  );
}

function SidebarContent() {
  const popular = getPopularArticles(5);
  const counts = getCategoryCounts();

  return (
    <div className="space-y-8">
      {/* Buzz Widget */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Ça fait le buzz 🐝
        </h3>
        <div className="space-y-3">
          {popular.slice(0, 4).map((a) => (
            <Link key={a.id} to={`/article/${a.slug}`} className="flex gap-3 group">
              <img src={a.coverImage} alt="" className="w-16 h-12 rounded-md object-cover flex-shrink-0" loading="lazy" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {a.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Most Read */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" /> Les plus lus
        </h3>
        <div className="space-y-3">
          {popular.slice(0, 5).map((a, i) => (
            <Link key={a.id} to={`/article/${a.slug}`} className="flex items-start gap-3 group">
              <span className="text-2xl font-heading font-bold text-primary/30">{i + 1}</span>
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {a.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{a.views.toLocaleString()} vues</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-heading font-bold text-foreground mb-4">📂 Catégories</h3>
        <div className="space-y-2">
          {(Object.keys(counts) as Category[]).map((cat) => (
            <Link
              key={cat}
              to={`/categorie/${cat}`}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <span className="text-sm font-medium text-foreground">{categoryLabels[cat]}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-semibold">
                {counts[cat]}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Social */}
      <div className="bg-card rounded-xl border border-border p-5 text-center">
        <h3 className="font-heading font-bold text-foreground mb-3">📱 Suivez-nous</h3>
        <div className="flex justify-center gap-3">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
            <Facebook className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const [category, setCategory] = useState<Category | "all">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (category === "all") return articles;
    return articles.filter((a) => a.category === category);
  }, [category]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleCategoryChange = (cat: Category | "all") => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <>
      <HeroSection />

      <section id="articles" className="container mx-auto px-4 py-12">
        {/* Category Filter */}
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
          {/* Article Grid */}
          <div className="lg:col-span-2">
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

            {/* Pagination */}
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
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Suspense fallback={<SidebarSkeleton />}>
              <SidebarContent />
            </Suspense>
          </aside>
        </div>
      </section>
    </>
  );
}
