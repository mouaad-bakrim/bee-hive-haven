import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Eye, Star, Clock, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Stats {
  total: number;
  published: number;
  drafts: number;
  totalViews: number;
  featured: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: posts } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
      if (posts) {
        setStats({
          total: posts.length,
          published: posts.filter((p) => p.status === "published").length,
          drafts: posts.filter((p) => p.status === "draft").length,
          totalViews: posts.reduce((s, p) => s + (p.views || 0), 0),
          featured: posts.filter((p) => p.featured).length,
        });
        setRecentPosts(posts.slice(0, 5));
      }
      setLoading(false);
    }
    load();
  }, []);

  const cards = stats
    ? [
        { label: "Articles", value: stats.total, icon: FileText, color: "text-primary" },
        { label: "Publiés", value: stats.published, icon: TrendingUp, color: "text-accent" },
        { label: "Brouillons", value: stats.drafts, icon: Clock, color: "text-muted-foreground" },
        { label: "Vues totales", value: stats.totalViews.toLocaleString(), icon: Eye, color: "text-cat-buzz" },
        { label: "À la une", value: stats.featured, icon: Star, color: "text-cat-histoires" },
      ]
    : [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Tableau de bord</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
            ))
          : cards.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <c.icon className={`w-4 h-4 ${c.color}`} />
                  <span className="text-xs text-muted-foreground font-medium">{c.label}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{c.value}</p>
              </motion.div>
            ))}
      </div>

      {/* Recent Posts */}
      <div className="bg-card border border-border rounded-xl">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-heading font-bold text-foreground">Derniers articles</h2>
          <Link to="/admin/posts" className="text-sm text-primary hover:underline">Voir tout</Link>
        </div>
        <div className="divide-y divide-border">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 h-16 animate-pulse bg-muted/30" />
              ))
            : recentPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/admin/posts/${post.id}/edit`}
                  className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors"
                >
                  {post.cover_url && (
                    <img src={post.cover_url} alt="" className="w-12 h-8 rounded object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground">{post.category} • {post.views || 0} vues</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    post.status === "published"
                      ? "bg-accent/10 text-accent"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {post.status === "published" ? "Publié" : "Brouillon"}
                  </span>
                </Link>
              ))}
          {!loading && recentPosts.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <p className="text-3xl mb-2">🐝</p>
              <p>Aucun article pour le moment.</p>
              <Link to="/admin/posts/new" className="text-primary text-sm hover:underline mt-1 inline-block">
                Créer votre premier article
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
