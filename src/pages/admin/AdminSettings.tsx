import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [siteName, setSiteName] = useState("Coin des Apiculteurs");
  const [siteSlogan, setSiteSlogan] = useState("Ruches, miel et passion — faisons grandir nos colonies ensemble 🐝");
  const [instagram, setInstagram] = useState("https://instagram.com");
  const [facebook, setFacebook] = useState("https://facebook.com");

  const handleSave = async () => {
    setSaving(true);
    // Settings stored in localStorage for now - could be moved to DB
    localStorage.setItem(
      "site-settings",
      JSON.stringify({ siteName, siteSlogan, instagram, facebook })
    );
    setTimeout(() => {
      setSaving(false);
      toast({ title: "Paramètres sauvegardés ✓" });
    }, 400);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Paramètres</h1>

      <div className="max-w-2xl space-y-6">
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-heading font-bold text-foreground">Informations du site</h2>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Nom du site</label>
            <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Slogan</label>
            <Input value={siteSlogan} onChange={(e) => setSiteSlogan(e.target.value)} />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-heading font-bold text-foreground">Réseaux sociaux</h2>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Instagram</label>
            <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/..." />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Facebook</label>
            <Input value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="https://facebook.com/..." />
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="honey-gradient text-primary-foreground gap-1.5">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Sauvegarder
        </Button>
      </div>
    </motion.div>
  );
}
