import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TrendingUp, Eye, Instagram, Facebook, Youtube, Twitter, Tag } from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import ArticleCard from "@/components/home/ArticleCard";
import NewsletterForm from "@/components/NewsletterForm";
import type { Article } from "@/data/articles";
import { useToast } from "@/hooks/use-toast";
import { useRealtimePublishedArticles } from "@/hooks/useRealtimePublishedArticles";
import { useCategories } from "@/hooks/useCategories";
import { useSiteSettings } from "@/hooks/useSiteSettings";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.16a8.16 8.16 0 004.76 1.53v-3.5a4.82 4.82 0 01-1-.5z" />
    </svg>
  );
}

export default function Index() {
  const [category, setCategory] = useState<string>("all");
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const { articles, loading, error } = useRealtimePublishedArticles({ orderBy: "published_at" });
  const { data: categories } = useCategories();
  const { data: settings } = useSiteSettings();

  const showHero = settings?.show_hero !== false;
  const showBuzz = settings?.show_buzz_section !== false;
  const showCategoriesFilter = settings?.show_categories_filter !== false;
  const showNewsletter = settings?.show_newsletter !== false;
  const itemsPerPage = settings?.articles_per_page ?? 10;

  useEffect(() => {
    if (error) toast({ title: "Erreur", description: error, variant: "destructive" });
  }, [error, toast]);

  const filtered = useMemo(() => {
    if (category === "all") return articles;
    return articles.filter((a) => a.category === category);
  }, [category, articles]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const popular = useMemo(() => [...articles].sort((a, b) => b.views - a.views).slice(0, 5), [articles]);
  
  const allTags = useMemo(() => {
    const counts: Record<string, number> = {};
    articles.forEach((a) => a.tags.forEach((t) => { counts[t] = (counts[t] || 0) + 1; }));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 15);
  }, [articles]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    articles.forEach((a) => { counts[a.category] = (counts[a.category] || 0) + 1; });
    return counts;
  }, [articles]);

  const handleCategoryChange = (cat: string) => { setCategory(cat); setPage(1); };

  const socialLinks = [
    { url: settings?.instagram_url, enabled: settings?.instagram_enabled, icon: <Instagram className="w-4 h-4" />, label: "Instagram" },
    { url: settings?.facebook_url, enabled: settings?.facebook_enabled, icon: <Facebook className="w-4 h-4" />, label: "Facebook" },
    { url: settings?.youtube_url, enabled: settings?.youtube_enabled, icon: <Youtube className="w-4 h-4" />, label: "YouTube" },
    { url: settings?.tiktok_url, enabled: settings?.tiktok_enabled, icon: <TikTokIcon className="w-4 h-4" />, label: "TikTok" },
    { url: settings?.twitter_url, enabled: settings?.twitter_enabled, icon: <Twitter className="w-4 h-4" />, label: "Twitter" },
  ].filter((s) => s.enabled !== false && s.url);

  return (
    <>
      {showHero && <HeroSection />}

      <section id="articles" className="container mx-auto px-4 py-12">
        {showCategoriesFilter && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => handleCategoryChange("all")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                category === "all" ? "honey-gradient text-primary-foreground shadow-md" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Tous
            </button>
            {(categories ?? []).map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  category === cat.slug ? "honey-gradient text-primary-foreground shadow-md" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

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
                          page === i + 1 ? "honey-gradient text-primary-foreground shadow-md" : "bg-secondary text-secondary-foreground hover:bg-primary/10"
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
              {showBuzz && (
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
              )}
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
                  {(categories ?? []).map((cat) => (
                    <Link key={cat.slug} to={`/categorie/${cat.slug}`} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary/50 transition-colors">
                      <span className="text-sm font-medium text-foreground">{cat.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-semibold">{categoryCounts[cat.slug] || 0}</span>
                    </Link>
                  ))}
                </div>
              </div>
              {socialLinks.length > 0 && (
                <div className="bg-card rounded-xl border border-border p-5 text-center">
                  <h3 className="font-heading font-bold text-foreground mb-3">📱 Suivez-nous</h3>
                  <div className="flex justify-center gap-3">
                    {socialLinks.map((s) => (
                      <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                        className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                        {s.icon}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
