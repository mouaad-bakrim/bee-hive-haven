import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FileText, Eye, Star, Clock, TrendingUp, BarChart3, AlertTriangle, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { getArticlesAdmin } from "@/features/articles/articles.api";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

interface Post {
  id: string;
  title: string;
  category: string;
  status: string;
  views: number | null;
  featured: boolean | null;
  cover_url: string | null;
  created_at: string;
  published_at: string | null;
}

interface Stats {
  total: number;
  published: number;
  drafts: number;
  totalViews: number;
  featured: number;
  noViews: number;
  topArticle: Post | null;
}

const PIE_COLORS = [
  "hsl(37, 91%, 55%)",
  "hsl(122, 39%, 49%)",
  "hsl(210, 70%, 50%)",
  "hsl(25, 85%, 55%)",
  "hsl(340, 75%, 55%)",
];

function AnimatedCounter({ value, duration = 1 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (end === 0) { setCount(0); return; }
    const step = Math.ceil(end / (duration * 30));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 33);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <>{count.toLocaleString()}</>;
}

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getArticlesAdmin()
      .then((data) => {
        if (!cancelled) setPosts(data as Post[]);
      })
      .catch((err) => {
        if (!cancelled) {
          toast({ title: "Erreur", description: err?.message || "Impossible de charger les articles.", variant: "destructive" });
          setPosts([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [toast]);

  const stats = useMemo<Stats | null>(() => {
    if (loading) return null;
    const topArticle = posts.reduce<Post | null>((best, p) => (!best || (p.views || 0) > (best.views || 0) ? p : best), null);
    return {
      total: posts.length,
      published: posts.filter((p) => p.status === "published").length,
      drafts: posts.filter((p) => p.status === "draft").length,
      totalViews: posts.reduce((s, p) => s + (p.views || 0), 0),
      featured: posts.filter((p) => p.featured).length,
      noViews: posts.filter((p) => !p.views || p.views === 0).length,
      topArticle,
    };
  }, [posts, loading]);

  // Category breakdown for pie chart
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    posts.forEach((p) => { map[p.category] = (map[p.category] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [posts]);

  // Top 5 articles for bar chart
  const topArticles = useMemo(() => {
    return [...posts]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5)
      .map((p) => ({ name: p.title.length > 20 ? p.title.slice(0, 20) + "…" : p.title, views: p.views || 0 }));
  }, [posts]);

  // Simulated last 7 days views (from post_views_daily or mock)
  const lineData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        date: d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" }),
        views: Math.floor(Math.random() * 100 + 20),
      });
    }
    return days;
  }, []);

  // Insights
  const insights = useMemo(() => {
    if (!stats) return [];
    const list: string[] = [];
    if (stats.noViews > 0) list.push(`${stats.noViews} article(s) n'ont encore aucune vue. Pensez à les partager !`);
    if (stats.drafts > 2) list.push(`Vous avez ${stats.drafts} brouillons en attente de publication.`);
    if (stats.topArticle) list.push(`"${stats.topArticle.title}" est votre article le plus populaire avec ${stats.topArticle.views?.toLocaleString()} vues.`);
    if (list.length === 0) list.push("Tout est en ordre ! Continuez à publier du contenu de qualité 🐝");
    return list;
  }, [stats]);

  const cards = stats
    ? [
        { label: "Articles", value: stats.total, icon: FileText, color: "text-primary" },
        { label: "Publiés", value: stats.published, icon: TrendingUp, color: "text-accent" },
        { label: "Brouillons", value: stats.drafts, icon: Clock, color: "text-muted-foreground" },
        { label: "Vues totales", value: stats.totalViews, icon: Eye, color: "text-cat-buzz" },
        { label: "À la une", value: stats.featured, icon: Star, color: "text-cat-histoires" },
        { label: "Sans vues", value: stats.noViews, icon: AlertTriangle, color: "text-destructive" },
      ]
    : [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Tableau de bord</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
            ))
          : cards.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl p-4 hover:honey-shadow hover:-translate-y-0.5 transition-all duration-300 cursor-default"
              >
                <div className="flex items-center gap-2 mb-2">
                  <c.icon className={`w-4 h-4 ${c.color}`} />
                  <span className="text-xs text-muted-foreground font-medium">{c.label}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  <AnimatedCounter value={typeof c.value === "number" ? c.value : 0} />
                </p>
              </motion.div>
            ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-card border border-border rounded-xl p-5"
        >
          <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Vues (7 derniers jours)
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(37, 30%, 88%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(28, 25%, 45%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(28, 25%, 45%)" />
              <RechartsTooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(37, 30%, 88%)" }} />
              <Line type="monotone" dataKey="views" stroke="hsl(37, 91%, 55%)" strokeWidth={2.5} dot={{ fill: "hsl(37, 91%, 55%)", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h2 className="font-heading font-bold text-foreground mb-4">Articles par catégorie</h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-12">Aucune donnée</p>
          )}
        </motion.div>
      </div>

      {/* Bar Chart - Top articles */}
      {topArticles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-card border border-border rounded-xl p-5 mb-8"
        >
          <h2 className="font-heading font-bold text-foreground mb-4">🏆 Top articles</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topArticles} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(37, 30%, 88%)" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(28, 25%, 45%)" />
              <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} stroke="hsl(28, 25%, 45%)" />
              <RechartsTooltip />
              <Bar dataKey="views" fill="hsl(37, 91%, 55%)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-xl p-5 mb-8"
      >
        <h2 className="font-heading font-bold text-foreground mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-primary" /> Insights
        </h2>
        <ul className="space-y-2">
          {insights.map((ins, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary mt-0.5">•</span>
              {ins}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Recent Posts Table */}
      <div className="bg-card border border-border rounded-xl">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-heading font-bold text-foreground">Derniers articles</h2>
          <Link to="/admin/posts" className="text-sm text-primary hover:underline">Voir tout</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Article</th>
                <th className="px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Catégorie</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Statut</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-right">Vues</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}><td colSpan={4} className="p-4"><div className="h-8 animate-pulse bg-muted/30 rounded" /></td></tr>
                  ))
                : posts.slice(0, 8).map((post) => (
                    <tr key={post.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <Link to={`/admin/posts/${post.id}/edit`} className="flex items-center gap-3 group">
                          {post.cover_url && (
                            <img src={post.cover_url} alt="" className="w-10 h-7 rounded object-cover flex-shrink-0" />
                          )}
                          <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate max-w-[200px]">
                            {post.title}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">{post.category}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          post.status === "published"
                            ? "bg-accent/10 text-accent"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {post.status === "published" ? "Publié" : "Brouillon"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{(post.views || 0).toLocaleString()}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        {!loading && posts.length === 0 && (
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
  );
}
