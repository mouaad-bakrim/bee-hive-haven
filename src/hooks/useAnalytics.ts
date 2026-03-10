import { useMemo, useState, useEffect } from "react";

export type Period = "today" | "7d" | "30d" | "90d";

function seedRandom(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function generateDailyData(days: number) {
  const data = [];
  const rand = seedRandom(42);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const base = isWeekend ? 60 : 120;
    const visitors = Math.floor(base + rand() * 80);
    data.push({
      date: d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
      visitors,
      pageViews: Math.floor(visitors * (2 + rand() * 0.6)),
    });
  }
  return data;
}

export interface AnalyticsData {
  uniqueVisitors: number;
  uniqueVisitorsYesterday: number;
  pageViews: number;
  pageViewsYesterday: number;
  articlesViewed: number;
  bounceRate: number;
  avgSessionDuration: string;
  realtimeVisitors: number;
  dailyData: { date: string; visitors: number; pageViews: number }[];
  topArticles: { name: string; views: number }[];
  trafficSources: { name: string; value: number }[];
  devices: { name: string; value: number; icon: string }[];
  browsers: { name: string; value: number }[];
  countries: { name: string; value: number; flag: string }[];
  topPages: { url: string; views: number; avgTime: string }[];
}

export function useAnalytics(period: Period): { data: AnalyticsData; loading: boolean } {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [period]);

  const data = useMemo<AnalyticsData>(() => {
    const days = period === "today" ? 1 : period === "7d" ? 7 : period === "30d" ? 30 : 90;
    const multiplier = days === 1 ? 1 : days <= 7 ? 1 : days <= 30 ? 1 : 1;
    const dailyData = generateDailyData(days);

    const totalVisitors = dailyData.reduce((s, d) => s + d.visitors, 0);
    const totalPageViews = dailyData.reduce((s, d) => s + d.pageViews, 0);
    const yesterdayData = generateDailyData(2);

    const rand = seedRandom(123);
    const realtimeVisitors = Math.floor(2 + rand() * 10);

    return {
      uniqueVisitors: totalVisitors,
      uniqueVisitorsYesterday: yesterdayData[0]?.visitors || 0,
      pageViews: totalPageViews,
      pageViewsYesterday: yesterdayData[0]?.pageViews || 0,
      articlesViewed: Math.floor(totalPageViews * 0.65),
      bounceRate: Math.floor(35 + rand() * 15),
      avgSessionDuration: `${Math.floor(2 + rand() * 4)}:${String(Math.floor(rand() * 59)).padStart(2, "0")}`,
      realtimeVisitors,
      dailyData,
      topArticles: [
        { name: "Comment débuter en apiculture", views: 1240 },
        { name: "Les bienfaits du miel", views: 980 },
        { name: "Protéger ses abeilles du varroa", views: 756 },
        { name: "Installer une ruche au jardin", views: 632 },
        { name: "Récolter son premier miel", views: 445 },
      ],
      trafficSources: [
        { name: "Direct", value: 40 },
        { name: "Google", value: 35 },
        { name: "Facebook", value: 15 },
        { name: "Autres", value: 10 },
      ],
      devices: [
        { name: "Mobile", value: 58, icon: "📱" },
        { name: "Desktop", value: 35, icon: "💻" },
        { name: "Tablet", value: 7, icon: "📟" },
      ],
      browsers: [
        { name: "Chrome", value: 64 },
        { name: "Safari", value: 18 },
        { name: "Firefox", value: 12 },
        { name: "Edge", value: 6 },
      ],
      countries: [
        { name: "France", value: 65, flag: "🇫🇷" },
        { name: "Belgique", value: 12, flag: "🇧🇪" },
        { name: "Maroc", value: 8, flag: "🇲🇦" },
        { name: "Suisse", value: 7, flag: "🇨🇭" },
        { name: "Canada", value: 5, flag: "🇨🇦" },
        { name: "Autres", value: 3, flag: "🌍" },
      ],
      topPages: [
        { url: "/article/debuter-apiculture", views: 1240, avgTime: "4:32" },
        { url: "/article/bienfaits-miel", views: 980, avgTime: "3:15" },
        { url: "/", views: 870, avgTime: "1:45" },
        { url: "/article/varroa-protection", views: 756, avgTime: "5:10" },
        { url: "/categorie/sante", views: 445, avgTime: "2:30" },
      ],
    };
  }, [period]);

  return { data, loading };
}
