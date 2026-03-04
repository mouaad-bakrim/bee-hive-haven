/**
 * Returns a human-readable "time ago" string in French.
 * Used for published_at and similar dates; updates every minute when used with useTimeAgo.
 */
export function formatTimeAgo(date: Date | string | null | undefined): string {
  if (date == null) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";

  const now = new Date();
  const sec = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (sec < 0) return "à l'instant";
  if (sec < 10) return "à l'instant";
  if (sec < 60) return `il y a ${sec} s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const j = Math.floor(h / 24);
  if (j < 7) return `il y a ${j} j`;
  const sem = Math.floor(j / 7);
  if (sem < 4) return `il y a ${sem} sem`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}
