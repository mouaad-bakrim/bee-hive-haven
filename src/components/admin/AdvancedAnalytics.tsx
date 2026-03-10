import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, Eye, Star, Clock, AlertTriangle, MessageSquare,
  TrendingUp, Info, Users, Globe, Monitor, Smartphone, Tablet,
  Chrome, Activity,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import { useAnalytics, type Period } from "@/hooks/useAnalytics";
import { useUmamiAnalytics } from "@/hooks/useUmamiAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

const COUNTRY_FLAGS: Record<string, string> = {
  FR: "🇫🇷", BE: "🇧🇪", CH: "🇨🇭", MA: "🇲🇦", CA: "🇨🇦", US: "🇺🇸", DE: "🇩🇪",
  GB: "🇬🇧", ES: "🇪🇸", IT: "🇮🇹", NL: "🇳🇱", PT: "🇵🇹", TN: "🇹🇳", DZ: "🇩🇿",
  SN: "🇸🇳", CI: "🇨🇮", CM: "🇨🇲", MG: "🇲🇬", ML: "🇲🇱", JP: "🇯🇵", CN: "🇨🇳",
};

function getDeviceIcon(device: string) {
  const d = device.toLowerCase();
  if (d.includes("mobile")) return <Smartphone className="w-4 h-4" />;
  if (d.includes("tablet")) return <Tablet className="w-4 h-4" />;
  return <Monitor className="w-4 h-4" />;
}

function StatCard({ icon: Icon, label, value, color, index, sub }: {
  icon: any; label: string; value: string | number; color: string; index: number; sub?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card border border-border rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </motion.div>
  );
}

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${m}m${s.toString().padStart(2, "0")}s`;
}

function bounceRate(bounces: number, visits: number): string {
  if (!visits) return "0%";
  return `${Math.round((bounces / visits) * 100)}%`;
}

export default function AdvancedAnalytics() {
  const [period, setPeriod] = useState<Period>("30d");
  const { data, loading } = useAnalytics(period);
  const umami = useUmamiAnalytics(period);

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

  const dbCards = [
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
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* DB KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {dbCards.map((c, i) => (
          <StatCard key={c.label} icon={c.icon} label={c.label} value={c.value} color={c.color} index={i} />
        ))}
      </div>

      {/* Umami Visitor Stats */}
      {umami.available && !umami.error ? (
        <>
          {/* Visitor KPIs */}
          {umami.loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : umami.stats ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard icon={Users} label="Visiteurs uniques" value={umami.stats.visitors.value}
                color="text-primary" index={0}
                sub={`Précéd: ${umami.stats.visitors.prev}`} />
              <StatCard icon={Eye} label="Pages vues" value={umami.stats.pageviews.value}
                color="text-primary" index={1}
                sub={`Précéd: ${umami.stats.pageviews.prev}`} />
              <StatCard icon={TrendingUp} label="Visites" value={umami.stats.visits.value}
                color="text-accent" index={2}
                sub={`Précéd: ${umami.stats.visits.prev}`} />
              <StatCard icon={AlertTriangle} label="Taux de rebond"
                value={bounceRate(umami.stats.bounces.value, umami.stats.visits.value)}
                color="text-destructive" index={3} />
              <StatCard icon={Clock} label="Durée moy. session"
                value={umami.stats.totaltime.value ? formatDuration(umami.stats.totaltime.value / (umami.stats.visits.value || 1)) : "—"}
                color="text-muted-foreground" index={4} />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-accent" />
                  <span className="text-xs text-muted-foreground font-medium">Temps réel</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <p className="text-2xl font-bold text-foreground">
                    {umami.activeVisitors ?? "—"}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">visiteurs connectés</p>
              </motion.div>
            </div>
          ) : null}

          {/* Umami tables row */}
          {!umami.loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Countries */}
              {umami.countries.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-heading font-bold text-foreground mb-4">🌍 Pays</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {umami.countries.slice(0, 15).map((c) => {
                      const max = umami.countries[0]?.y || 1;
                      return (
                        <div key={c.x} className="flex items-center gap-2">
                          <span className="text-lg w-7">{COUNTRY_FLAGS[c.x] || "🏳️"}</span>
                          <span className="text-sm text-foreground w-8">{c.x}</span>
                          <div className="flex-1 bg-secondary rounded-full h-2">
                            <div className="bg-primary rounded-full h-2" style={{ width: `${(c.y / max) * 100}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground w-10 text-right">{c.y}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Devices */}
              {umami.devices.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-heading font-bold text-foreground mb-4">📱 Appareils</h3>
                  <div className="space-y-3">
                    {umami.devices.map((d) => {
                      const total = umami.devices.reduce((s, v) => s + v.y, 0) || 1;
                      const pct = Math.round((d.y / total) * 100);
                      return (
                        <div key={d.x} className="flex items-center gap-3">
                          {getDeviceIcon(d.x)}
                          <span className="text-sm text-foreground flex-1 capitalize">{d.x}</span>
                          <div className="w-24 bg-secondary rounded-full h-2">
                            <div className="bg-primary rounded-full h-2" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground w-10 text-right">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Browsers */}
              {umami.browsers.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-heading font-bold text-foreground mb-4">🌐 Navigateurs</h3>
                  <div className="space-y-3">
                    {umami.browsers.slice(0, 8).map((b) => {
                      const total = umami.browsers.reduce((s, v) => s + v.y, 0) || 1;
                      const pct = Math.round((b.y / total) * 100);
                      return (
                        <div key={b.x} className="flex items-center gap-3">
                          <Chrome className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-foreground flex-1">{b.x || "Inconnu"}</span>
                          <div className="w-24 bg-secondary rounded-full h-2">
                            <div className="bg-primary rounded-full h-2" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground w-10 text-right">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Referrers pie chart */}
          {!umami.loading && umami.referrers.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-heading font-bold text-foreground mb-4">🔗 Sources de trafic</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={umami.referrers.slice(0, 6).map(r => ({ name: r.x || "Direct", value: r.y }))}
                      cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value"
                      label={({ name, value }) => `${name} (${value})`}>
                      {umami.referrers.slice(0, 6).map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {umami.referrers.slice(0, 10).map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-foreground flex-1 truncate">{r.x || "Direct"}</span>
                      <span className="text-muted-foreground">{r.y}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Top pages */}
          {!umami.loading && umami.topPages.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-heading font-bold text-foreground mb-4">📄 Pages les plus visitées</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead className="text-right">Vues</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {umami.topPages.slice(0, 15).map((p, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-sm truncate max-w-xs">{p.x}</TableCell>
                      <TableCell className="text-right">{p.y}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          )}
        </>
      ) : (
        /* Umami not available - empty state */
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-heading font-bold text-foreground mb-1">Statistiques visiteurs</h3>
              <p className="text-sm text-muted-foreground">
                {umami.error
                  ? `Erreur de connexion à Umami : ${umami.error}. Vérifiez votre token API dans les paramètres.`
                  : "Configurez Umami Analytics dans les Paramètres pour afficher les statistiques des visiteurs : visiteurs uniques, taux de rebond, appareils, navigateurs, pays et sources de trafic."}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* DB Charts Row */}
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
    </div>
  );
}
