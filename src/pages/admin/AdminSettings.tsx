import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { saveSettings, type SiteSettings } from "@/features/settings/settings.api";
import { useQueryClient } from "@tanstack/react-query";

type Fields = Partial<Omit<SiteSettings, "id" | "created_at" | "updated_at">>;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <h2 className="font-heading font-bold text-foreground">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-1 block">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  const [f, setF] = useState<Fields>({});

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) =>
    setF((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!data) return;
    setF({
      site_name: data.site_name ?? "",
      slogan: data.slogan ?? "",
      instagram_url: data.instagram_url ?? "",
      facebook_url: data.facebook_url ?? "",
      youtube_url: data.youtube_url ?? "",
      tiktok_url: data.tiktok_url ?? "",
      twitter_url: data.twitter_url ?? "",
      meta_description: data.meta_description ?? "",
      meta_keywords: data.meta_keywords ?? "",
      google_analytics_id: data.google_analytics_id ?? "",
      umami_website_id: data.umami_website_id ?? "",
      logo_url: data.logo_url ?? "",
      favicon_url: data.favicon_url ?? "",
      primary_color: data.primary_color ?? "#f59e0b",
      hero_image_url: data.hero_image_url ?? "",
      newsletter_title: data.newsletter_title ?? "",
      newsletter_subtitle: data.newsletter_subtitle ?? "",
      newsletter_enabled: data.newsletter_enabled ?? true,
      contact_email: data.contact_email ?? "",
      whatsapp_number: data.whatsapp_number ?? "",
      address: data.address ?? "",
    });
  }, [data]);

  useEffect(() => {
    if (error) {
      toast({ title: "Erreur", description: (error as any)?.message || "Impossible de charger les paramètres.", variant: "destructive" });
    }
  }, [error, toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSettings(f);
      await queryClient.invalidateQueries({ queryKey: ["site_settings"] });
      toast({ title: "Paramètres sauvegardés ✅" });
    } catch (e: any) {
      toast({ title: "Erreur", description: e?.message || "Sauvegarde impossible", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">⚙️ Paramètres</h1>

      <div className="max-w-2xl space-y-6">
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Chargement des paramètres…
          </div>
        )}

        {/* Informations du site */}
        <Section title="🏠 Informations du site">
          <Field label="Nom du site">
            <Input value={f.site_name ?? ""} onChange={(e) => set("site_name", e.target.value)} />
          </Field>
          <Field label="Slogan">
            <Input value={f.slogan ?? ""} onChange={(e) => set("slogan", e.target.value)} />
          </Field>
        </Section>

        {/* SEO */}
        <Section title="🔍 SEO">
          <Field label="Meta description" hint="Max 160 caractères">
            <Textarea
              value={f.meta_description ?? ""}
              onChange={(e) => set("meta_description", e.target.value.slice(0, 160))}
              maxLength={160}
              rows={3}
            />
            <span className="text-xs text-muted-foreground">{(f.meta_description ?? "").length}/160</span>
          </Field>
          <Field label="Meta keywords" hint="Séparés par des virgules">
            <Input value={f.meta_keywords ?? ""} onChange={(e) => set("meta_keywords", e.target.value)} placeholder="apiculture, miel, ruches, abeilles" />
          </Field>
          <Field label="Google Analytics ID" hint="Ex: G-XXXXXXXXXX">
            <Input value={f.google_analytics_id ?? ""} onChange={(e) => set("google_analytics_id", e.target.value)} placeholder="G-XXXXXXXXXX" />
          </Field>
          <Field label="Umami Website ID">
            <Input value={f.umami_website_id ?? ""} onChange={(e) => set("umami_website_id", e.target.value)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
          </Field>
        </Section>

        {/* Apparence */}
        <Section title="🎨 Apparence">
          <Field label="URL du logo" hint="Laissez vide pour utiliser l'emoji 🐝">
            <Input value={f.logo_url ?? ""} onChange={(e) => set("logo_url", e.target.value)} placeholder="https://..." />
          </Field>
          <Field label="URL du favicon">
            <Input value={f.favicon_url ?? ""} onChange={(e) => set("favicon_url", e.target.value)} placeholder="https://..." />
          </Field>
          <Field label="Couleur principale">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={f.primary_color ?? "#f59e0b"}
                onChange={(e) => set("primary_color", e.target.value)}
                className="w-10 h-10 rounded-lg border border-input cursor-pointer"
              />
              <Input value={f.primary_color ?? "#f59e0b"} onChange={(e) => set("primary_color", e.target.value)} className="w-32" />
            </div>
          </Field>
          <Field label="Image Hero (URL)" hint="Image de fond de la section héro">
            <Input value={f.hero_image_url ?? ""} onChange={(e) => set("hero_image_url", e.target.value)} placeholder="https://..." />
          </Field>
        </Section>

        {/* Newsletter */}
        <Section title="📧 Newsletter">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Activer la section newsletter</span>
            <Switch checked={f.newsletter_enabled ?? true} onCheckedChange={(v) => set("newsletter_enabled", v)} />
          </div>
          <Field label="Titre de la newsletter">
            <Input value={f.newsletter_title ?? ""} onChange={(e) => set("newsletter_title", e.target.value)} placeholder="Inscrivez-vous à la newsletter" />
          </Field>
          <Field label="Sous-titre">
            <Input value={f.newsletter_subtitle ?? ""} onChange={(e) => set("newsletter_subtitle", e.target.value)} />
          </Field>
        </Section>

        {/* Contact */}
        <Section title="📞 Contact">
          <Field label="Email de contact">
            <Input type="email" value={f.contact_email ?? ""} onChange={(e) => set("contact_email", e.target.value)} placeholder="contact@example.com" />
          </Field>
          <Field label="Numéro WhatsApp" hint="Optionnel, format international">
            <Input value={f.whatsapp_number ?? ""} onChange={(e) => set("whatsapp_number", e.target.value)} placeholder="+33 6 12 34 56 78" />
          </Field>
          <Field label="Adresse" hint="Optionnel">
            <Textarea value={f.address ?? ""} onChange={(e) => set("address", e.target.value)} rows={2} />
          </Field>
        </Section>

        {/* Réseaux sociaux */}
        <Section title="🔗 Réseaux sociaux">
          <Field label="Instagram">
            <Input value={f.instagram_url ?? ""} onChange={(e) => set("instagram_url", e.target.value)} placeholder="https://instagram.com/..." />
          </Field>
          <Field label="Facebook">
            <Input value={f.facebook_url ?? ""} onChange={(e) => set("facebook_url", e.target.value)} placeholder="https://facebook.com/..." />
          </Field>
          <Field label="YouTube">
            <Input value={f.youtube_url ?? ""} onChange={(e) => set("youtube_url", e.target.value)} placeholder="https://youtube.com/@..." />
          </Field>
          <Field label="TikTok">
            <Input value={f.tiktok_url ?? ""} onChange={(e) => set("tiktok_url", e.target.value)} placeholder="https://tiktok.com/@..." />
          </Field>
          <Field label="Twitter / X">
            <Input value={f.twitter_url ?? ""} onChange={(e) => set("twitter_url", e.target.value)} placeholder="https://x.com/..." />
          </Field>
        </Section>

        <Button onClick={handleSave} disabled={saving || isLoading} className="bg-primary text-primary-foreground gap-1.5">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Sauvegarder
        </Button>

        <div className="h-8" />
      </div>
    </motion.div>
  );
}
