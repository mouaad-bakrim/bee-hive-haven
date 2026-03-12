import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: string;
}

export default function Users() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const [{ data: profileData, error: pErr }, { data: roleData, error: rErr }] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (pErr) toast({ title: "Erreur", description: pErr.message, variant: "destructive" });
      if (rErr) toast({ title: "Erreur", description: rErr.message, variant: "destructive" });
      setProfiles(profileData ?? []);
      const roleMap: Record<string, string> = {};
      (roleData ?? []).forEach((r: UserRole) => { roleMap[r.user_id] = r.role; });
      setRoles(roleMap);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div>
      <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-6">👥 Utilisateurs</h1>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-3 sm:px-4 py-3 font-medium text-muted-foreground">Utilisateur</th>
                <th className="px-3 sm:px-4 py-3 font-medium text-muted-foreground">Rôle</th>
                <th className="px-3 sm:px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Inscription</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}><td colSpan={3} className="p-4"><Skeleton className="h-8 w-full" /></td></tr>
                  ))
                : profiles.map((p) => (
                    <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-3 sm:px-4 py-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                            {(p.display_name || "?")[0]?.toUpperCase()}
                          </div>
                          <span className="font-medium text-foreground truncate max-w-[120px] sm:max-w-none">{p.display_name || "Sans nom"}</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          roles[p.user_id] === "admin" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"
                        }`}>
                          {roles[p.user_id] || "user"}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 hidden md:table-cell text-muted-foreground">
                        {new Date(p.created_at).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        {!loading && profiles.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <p className="text-3xl mb-2">👥</p>
            <p>Aucun utilisateur trouvé.</p>
          </div>
        )}
      </div>
    </div>
  );
}
