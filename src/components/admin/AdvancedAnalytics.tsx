import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, Eye, Star, Clock, AlertTriangle, MessageSquare,
  TrendingUp, Info,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import { useAnalytics, type Period } from "@/hooks/useAnalytics";
import { Skeleton } from "@/components/ui/skeleton";

const PERIODS: { value: Period; label: string }[] = [
  { value: "today", label: "Aujourd'hui" },
  { value: "7d", label: "7 jours" },
  { value: "30d", label: "30 jours" },
  { value: "90d", label: "90 jours" },
];

const PIE_COLORS = [
  "hsl(37, 91%, 55%)",
  "hsl(122, 39%, 49%)",
  "hsl(210, 70%, 50%)",
  "hsl(25, 85%, 55%)",
  "hsl(340, 60%, 50%)",
  "hsl(180, 50%, 45%)",
];

function StatCard({
  icon: Icon, label, value, color, index,
}: {
  icon: any; label: string; value: string | number; color: string; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card border border-border rounded-xl p-4 hover:honey-shadow hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </motion.div>
  );
}

export default function AdvancedAnalytics() {
  const [period, setPeriod] = useState<Period>("30d");
  const { data, loading } = useAnalytics(period);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const cards = [
    { label: "Articles", value: data.totalArticles, icon: FileText, color: "text-primary" },
    { label: "Publiés", value: data.publishedArticles, icon: TrendingUp, color: "text-accent" },
    { label: "Brouillons", value: data.drafts, icon: Clock, color: "text-muted-foreground" },
    { label: "Vues totales", value: data.totalViews, icon: Eye, color: "text-primary" },
    { label: "Commentaires", value: data.totalComments, icon: MessageSquare, color: "text-primary" },
    { label: "Sans vues", value: data.noViewsCount, icon: AlertTriangle, color: "text-destructive" },
  ];

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              period === p.value
                ? "honey-gradient text-primary-foreground shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* KPI Cards - Real data */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((c, i) => (
          <StatCard key={c.label} icon={c.icon} label={c.label} value={c.value} color={c.color} index={i} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart - Real daily views */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-bold text-foreground mb-4">
            📈 Vues ({PERIODS.find(p => p.value === period)?.label})
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.dailyViews}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(37, 30%, 88%)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(28, 25%, 45%)" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(28, 25%, 45%)" />
              <RechartsTooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(37, 30%, 88%)" }} />
              <Line type="monotone" dataKey="views" stroke="hsl(37, 91%, 55%)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie - Categories (real) */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-bold text-foreground mb-4">📊 Articles par catégorie</h3>
          {data.categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={data.categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                  paddingAngle={3} dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}>
                  {data.categoryData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">Aucune donnée</p>
          )}
        </motion.div>
      </div>

      {/* Bar Chart - Top articles (real) */}
      {data.topArticles.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-bold text-foreground mb-4">🏆 Top articles</h3>
          <ResponsiveContainer width="100%" height={Math.max(200, data.topArticles.length * 40)}>
            <BarChart data={data.topArticles} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(37, 30%, 88%)" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(28, 25%, 45%)" />
              <YAxis type="category" dataKey="name" width={200} tick={{ fontSize: 11 }} stroke="hsl(28, 25%, 45%)" />
              <RechartsTooltip />
              <Bar dataKey="views" fill="hsl(37, 91%, 55%)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Visitor stats empty state */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-heading font-bold text-foreground mb-1">Statistiques visiteurs</h3>
            <p className="text-sm text-muted-foreground">
              Configurez une intégration analytics (comme Umami ou Plausible) dans les Paramètres pour afficher les statistiques des visiteurs : visiteurs uniques, taux de rebond, appareils, navigateurs, pays et sources de trafic.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
