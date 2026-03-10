import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Eye, FileText, TrendingDown, Clock, Activity,
  Monitor, Globe, ArrowUpRight, ArrowDownRight,
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
];

function DeltaBadge({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) return null;
  const pct = Math.round(((current - previous) / previous) * 100);
  const up = pct >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${up ? "text-accent" : "text-destructive"}`}>
      {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
      {Math.abs(pct)}%
    </span>
  );
}

function StatCard({
  icon: Icon, label, value, delta, badge, index,
}: {
  icon: any; label: string; value: string | number; delta?: React.ReactNode; badge?: React.ReactNode; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card border border-border rounded-xl p-4 hover:honey-shadow hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
        {badge}
      </div>
      <p className="text-2xl font-bold text-foreground">{typeof value === "number" ? value.toLocaleString() : value}</p>
      {delta && <div className="mt-1">{delta}</div>}
    </motion.div>
  );
}

export default function AdvancedAnalytics() {
  const [period, setPeriod] = useState<Period>("30d");
  const { data, loading } = useAnalytics(period);

  if (loading) {
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

  const realtimeBadge = (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent">
      <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
      Live
    </span>
  );

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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={Users} label="Visiteurs uniques" value={data.uniqueVisitors}
          delta={<DeltaBadge current={data.uniqueVisitors} previous={data.uniqueVisitorsYesterday} />} index={0} />
        <StatCard icon={Eye} label="Pages vues" value={data.pageViews}
          delta={<DeltaBadge current={data.pageViews} previous={data.pageViewsYesterday} />} index={1} />
        <StatCard icon={FileText} label="Articles consultés" value={data.articlesViewed} index={2} />
        <StatCard icon={TrendingDown} label="Taux de rebond" value={`${data.bounceRate}%`} index={3} />
        <StatCard icon={Clock} label="Durée moyenne" value={data.avgSessionDuration} index={4} />
        <StatCard icon={Activity} label="Temps réel" value={data.realtimeVisitors} badge={realtimeBadge} index={5} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-bold text-foreground mb-4">📈 Visiteurs ({PERIODS.find(p => p.value === period)?.label})</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(37, 30%, 88%)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(28, 25%, 45%)" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(28, 25%, 45%)" />
              <RechartsTooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(37, 30%, 88%)" }} />
              <Line type="monotone" dataKey="visitors" stroke="hsl(37, 91%, 55%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="pageViews" stroke="hsl(122, 39%, 49%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Traffic Sources Pie */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-bold text-foreground mb-4">🔗 Sources de trafic</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data.trafficSources} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                paddingAngle={3} dataKey="value"
                label={({ name, value }) => `${name} ${value}%`}>
                {data.trafficSources.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bar Chart - Top articles */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-heading font-bold text-foreground mb-4">🏆 Top articles</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.topArticles} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(37, 30%, 88%)" />
            <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(28, 25%, 45%)" />
            <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 11 }} stroke="hsl(28, 25%, 45%)" />
            <RechartsTooltip />
            <Bar dataKey="views" fill="hsl(37, 91%, 55%)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Detail Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Devices */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <Monitor className="w-4 h-4 text-primary" /> Appareils
          </h3>
          <div className="space-y-3">
            {data.devices.map((d) => (
              <div key={d.name} className="flex items-center gap-3">
                <span className="text-lg">{d.icon}</span>
                <span className="text-sm font-medium text-foreground flex-1">{d.name}</span>
                <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${d.value}%` }} />
                </div>
                <span className="text-sm font-semibold text-muted-foreground w-10 text-right">{d.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Browsers */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-bold text-foreground mb-4">🌐 Navigateurs</h3>
          <div className="space-y-3">
            {data.browsers.map((b) => (
              <div key={b.name} className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground flex-1">{b.name}</span>
                <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${b.value}%` }} />
                </div>
                <span className="text-sm font-semibold text-muted-foreground w-10 text-right">{b.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Countries */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" /> Pays visiteurs
          </h3>
          <div className="space-y-3">
            {data.countries.map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="text-lg">{c.flag}</span>
                <span className="text-sm font-medium text-foreground flex-1">{c.name}</span>
                <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${c.value}%` }} />
                </div>
                <span className="text-sm font-semibold text-muted-foreground w-10 text-right">{c.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Pages Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
        className="bg-card border border-border rounded-xl">
        <div className="p-4 border-b border-border">
          <h3 className="font-heading font-bold text-foreground">📄 Pages populaires</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Page</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-right">Vues</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-right">Temps moyen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.topPages.map((p) => (
                <tr key={p.url} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{p.url}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{p.views.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{p.avgTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Realtime */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 rounded-full bg-accent animate-pulse" />
          <h3 className="font-heading font-bold text-foreground">
            {data.realtimeVisitors} visiteur{data.realtimeVisitors > 1 ? "s" : ""} connecté{data.realtimeVisitors > 1 ? "s" : ""} maintenant
          </h3>
        </div>
        <div className="space-y-2">
          {data.topPages.slice(0, 3).map((p, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-muted-foreground flex-1">{p.url}</span>
              <span className="text-xs text-muted-foreground">il y a {i + 1} min</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
