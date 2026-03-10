import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Bell, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
  link: string | null;
}

export default function Notifications() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchNotifs = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("admin_notifications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    setNotifs(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchNotifs(); }, []);

  const markRead = async (id: string) => {
    await (supabase as any).from("admin_notifications").update({ read: true }).eq("id", id);
    fetchNotifs();
  };

  const markAllRead = async () => {
    await (supabase as any).from("admin_notifications").update({ read: true }).eq("read", false);
    fetchNotifs();
    toast({ title: "Toutes les notifications marquées comme lues" });
  };

  const deleteNotif = async (id: string) => {
    await (supabase as any).from("admin_notifications").delete().eq("id", id);
    fetchNotifs();
  };

  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
          <Bell className="w-6 h-6 text-primary" /> Notifications
          {unreadCount > 0 && (
            <span className="text-sm bg-primary text-primary-foreground px-2 py-0.5 rounded-full">{unreadCount}</span>
          )}
        </h1>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5">
            <Check className="w-4 h-4" /> Tout marquer comme lu
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)
          : notifs.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
                <p className="text-3xl mb-2">🔔</p>
                <p>Aucune notification</p>
              </div>
            )
          : notifs.map((n) => (
              <div
                key={n.id}
                className={`bg-card border rounded-xl p-4 flex items-center gap-4 transition-all ${
                  n.read ? "border-border opacity-70" : "border-primary/30 honey-shadow"
                }`}
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${n.read ? "bg-muted" : "bg-primary animate-pulse"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(n.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {!n.read && (
                    <Button size="icon" variant="ghost" onClick={() => markRead(n.id)} aria-label="Marquer comme lu">
                      <Check className="w-4 h-4 text-accent" />
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" onClick={() => deleteNotif(n.id)} aria-label="Supprimer">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
