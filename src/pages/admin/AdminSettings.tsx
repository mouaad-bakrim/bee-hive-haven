import { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Save, Loader2, Globe, Palette, Share2, Home, FileText, Search as SearchIcon,
  BarChart3, Shield, Instagram, Facebook, Youtube, Twitter, MessageCircle, Brush,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { saveSettings, type SiteSettings } from "@/features/settings/settings.api";
import { useQueryClient } from "@tanstack/react-query";

type Fields = Partial<Omit<SiteSettings, "id" | "created_at" | "updated_at">>;

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.16a8.16 8.16 0 004.76 1.53v-3.5a4.82 4.82 0 01-1-.5z" />
    </svg>
  );
}

/* ───── tiny helpers ───── */
function SectionCard({
  id, icon, title, description, saving, onSave, dirty, children,
}: {
  id: string; icon: React.ReactNode; title: string; description: string;
  saving: boolean; onSave: () => void; dirty: boolean; children: React.ReactNode;
}) {
  return (
    <section id={id} className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-start justify-between p-5 pb-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div>
            <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
              {title}
              {dirty && <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" title="Modifications non sauvegardées" />}
            </h2>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-5 space-y-4">{children}</div>
      <div className="px-5 pb-5">
        <Button onClick={onSave} disabled={saving} size="sm" className="gap-1.5">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Sauvegarder
        </Button>
      </div>
    </section>
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

function ToggleRow({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div>
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

/* ───── sections config ───── */
const SECTIONS = [
  { id: "general", label: "Général", icon: <Globe className="w-4 h-4" /> },
  { id: "appearance", label: "Apparence", icon: <Palette className="w-4 h-4" /> },
  { id: "theme", label: "Thème visuel", icon: <Brush className="w-4 h-4" /> },
  { id: "social", label: "Réseaux sociaux", icon: <Share2 className="w-4 h-4" /> },
  { id: "homepage", label: "Page d'accueil", icon: <Home className="w-4 h-4" /> },
  { id: "articles", label: "Articles", icon: <FileText className="w-4 h-4" /> },
  { id: "seo", label: "SEO & Analytics", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "security", label: "Sécurité", icon: <Shield className="w-4 h-4" /> },
] as const;

/* ───── main component ───── */
export default function AdminSettings() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data, isLoading } = useSiteSettings();
  const [f, setF] = useState<Fields>({});
  const [original, setOriginal] = useState<Fields>({});
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) =>
    setF((prev) => ({ ...prev, [key]: value }));

  // hydrate
  useEffect(() => {
    if (!data) return;
    const vals: Fields = {
      site_name: data.site_name ?? "",
      slogan: data.slogan ?? "",
      contact_email: data.contact_email ?? "",
      meta_description: data.meta_description ?? "",
      meta_keywords: data.meta_keywords ?? "",
      google_analytics_id: data.google_analytics_id ?? "",
      umami_website_id: data.umami_website_id ?? "",
      logo_url: data.logo_url ?? "",
      favicon_url: data.favicon_url ?? "",
      primary_color: data.primary_color ?? "#f59e0b",
      hero_image_url: data.hero_image_url ?? "",
      hero_title: data.hero_title ?? "Bienvenue au Coin des Apiculteurs 🐝",
      hero_subtitle: data.hero_subtitle ?? "Ici, on parle ruches, miel et passion",
      hero_cta_text: data.hero_cta_text ?? "Découvrir les articles",
      instagram_url: data.instagram_url ?? "",
      facebook_url: data.facebook_url ?? "",
      youtube_url: data.youtube_url ?? "",
      tiktok_url: data.tiktok_url ?? "",
      twitter_url: data.twitter_url ?? "",
      whatsapp_number: data.whatsapp_number ?? "",
      address: data.address ?? "",
      instagram_enabled: data.instagram_enabled ?? true,
      facebook_enabled: data.facebook_enabled ?? true,
      youtube_enabled: data.youtube_enabled ?? false,
      twitter_enabled: data.twitter_enabled ?? false,
      tiktok_enabled: data.tiktok_enabled ?? false,
      whatsapp_enabled: data.whatsapp_enabled ?? false,
      show_hero: data.show_hero ?? true,
      show_buzz_section: data.show_buzz_section ?? true,
      show_newsletter: data.show_newsletter ?? true,
      show_categories_filter: data.show_categories_filter ?? true,
      show_chatbot: data.show_chatbot ?? true,
      show_bee_animations: data.show_bee_animations ?? true,
      newsletter_title: data.newsletter_title ?? "",
      newsletter_subtitle: data.newsletter_subtitle ?? "",
      newsletter_enabled: data.newsletter_enabled ?? true,
      comments_enabled: data.comments_enabled ?? true,
      comments_moderation: data.comments_moderation ?? true,
      show_author: data.show_author ?? true,
      show_date: data.show_date ?? true,
      show_related_articles: data.show_related_articles ?? true,
      show_share_buttons: data.show_share_buttons ?? true,
      articles_per_page: data.articles_per_page ?? 10,
      maintenance_mode: data.maintenance_mode ?? false,
      public_registration: data.public_registration ?? false,
      theme_preset: data.theme_preset ?? "amber",
      font_family: data.font_family ?? "sans",
      border_radius_preset: data.border_radius_preset ?? "rounded",
      card_style: data.card_style ?? "shadow",
      animation_speed: data.animation_speed ?? "normal",
    };
    setF(vals);
    setOriginal(vals);
  }, [data]);

  const isDirty = useCallback(
    (keys: (keyof Fields)[]) => keys.some((k) => JSON.stringify(f[k]) !== JSON.stringify(original[k])),
    [f, original],
  );

  const handleSave = async (sectionId: string, keys: (keyof Fields)[]) => {
    setSavingSection(sectionId);
    try {
      const payload: any = {};
      keys.forEach((k) => { payload[k] = f[k]; });
      await saveSettings(payload);
      await qc.invalidateQueries({ queryKey: ["site_settings"] });
      toast({ title: "Paramètres sauvegardés ✅" });
    } catch (e: any) {
      toast({ title: "Erreur", description: e?.message || "Sauvegarde impossible", variant: "destructive" });
    } finally {
      setSavingSection(null);
    }
  };

  // search filter
  const lowerSearch = search.toLowerCase();
  const matchSection = (keywords: string) => !search || keywords.toLowerCase().includes(lowerSearch);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" /> Chargement…
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6">
      {/* Sidebar nav */}
      <aside className="hidden lg:block w-52 shrink-0 sticky top-24 self-start">
        <nav className="space-y-1">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-foreground/70 hover:text-primary hover:bg-primary/5 transition-colors"
            >
              {s.icon}
              {s.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold text-foreground">⚙️ Paramètres</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un paramètre…"
            className="pl-9"
          />
        </div>

        {/* ── General ── */}
        {matchSection("général nom site slogan email contact description") && (
          <SectionCard
            id="general"
            icon={<Globe className="w-5 h-5" />}
            title="Informations générales"
            description="Nom, slogan et coordonnées du site"
            saving={savingSection === "general"}
            dirty={isDirty(["site_name", "slogan", "contact_email", "address"])}
            onSave={() => handleSave("general", ["site_name", "slogan", "contact_email", "address"])}
          >
            <Field label="Nom du site">
              <Input value={f.site_name ?? ""} onChange={(e) => set("site_name", e.target.value)} />
            </Field>
            <Field label="Slogan">
              <Input value={f.slogan ?? ""} onChange={(e) => set("slogan", e.target.value)} />
            </Field>
            <Field label="Email de contact">
              <Input type="email" value={f.contact_email ?? ""} onChange={(e) => set("contact_email", e.target.value)} placeholder="contact@example.com" />
            </Field>
            <Field label="Adresse" hint="Optionnel">
              <Textarea value={f.address ?? ""} onChange={(e) => set("address", e.target.value)} rows={2} />
            </Field>
          </SectionCard>
        )}

        {/* ── Appearance ── */}
        {matchSection("apparence logo favicon couleur hero image") && (
          <SectionCard
            id="appearance"
            icon={<Palette className="w-5 h-5" />}
            title="Apparence"
            description="Logo, favicon, couleurs et image hero"
            saving={savingSection === "appearance"}
            dirty={isDirty(["logo_url", "favicon_url", "primary_color", "hero_image_url"])}
            onSave={() => handleSave("appearance", ["logo_url", "favicon_url", "primary_color", "hero_image_url"])}
          >
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
            <Field label="Image Hero (URL)" hint="Image de fond de la section hero">
              <Input value={f.hero_image_url ?? ""} onChange={(e) => set("hero_image_url", e.target.value)} placeholder="https://..." />
            </Field>
          </SectionCard>
        )}

        {/* ── Theme ── */}
        {matchSection("thème visuel couleur palette police font radius arrondi carte ombre animation") && (
          <SectionCard
            id="theme"
            icon={<Brush className="w-5 h-5" />}
            title="Thème visuel"
            description="Personnalisez l'apparence globale du site"
            saving={savingSection === "theme"}
            dirty={isDirty(["theme_preset", "font_family", "border_radius_preset", "card_style", "animation_speed"])}
            onSave={() => handleSave("theme", ["theme_preset", "font_family", "border_radius_preset", "card_style", "animation_speed"])}
          >
            <Field label="Palette de couleurs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "amber", label: "Amber / Miel", colors: "from-amber-400 to-amber-600" },
                  { id: "green", label: "Vert nature", colors: "from-green-400 to-green-600" },
                  { id: "blue", label: "Bleu ruche", colors: "from-blue-400 to-blue-600" },
                  { id: "dark", label: "Sombre", colors: "from-gray-600 to-gray-800" },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => set("theme_preset", p.id)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      f.theme_preset === p.id ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className={`w-full h-6 rounded bg-gradient-to-r ${p.colors} mb-2`} />
                    <span className="text-xs font-medium text-foreground">{p.label}</span>
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Police de caractères">
              <Select value={f.font_family ?? "sans"} onValueChange={(v) => set("font_family", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sans">Sans-serif moderne</SelectItem>
                  <SelectItem value="serif">Serif élégant</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Bords arrondis">
              <Select value={f.border_radius_preset ?? "rounded"} onValueChange={(v) => set("border_radius_preset", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Carré</SelectItem>
                  <SelectItem value="rounded">Arrondi</SelectItem>
                  <SelectItem value="full">Très arrondi</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Style des cartes">
              <Select value={f.card_style ?? "shadow"} onValueChange={(v) => set("card_style", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="shadow">Avec ombre</SelectItem>
                  <SelectItem value="border">Bordure</SelectItem>
                  <SelectItem value="flat">Flat</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Vitesse des animations">
              <Select value={f.animation_speed ?? "normal"} onValueChange={(v) => set("animation_speed", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast">Rapide</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="slow">Lent</SelectItem>
                  <SelectItem value="none">Aucune</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </SectionCard>
        )}

        {/* ── Social ── */}
        {matchSection("réseaux sociaux instagram facebook youtube twitter tiktok whatsapp") && (
          <SectionCard
            id="social"
            icon={<Share2 className="w-5 h-5" />}
            title="Réseaux sociaux"
            description="Activez et configurez vos liens sociaux"
            saving={savingSection === "social"}
            dirty={isDirty([
              "instagram_url", "instagram_enabled", "facebook_url", "facebook_enabled",
              "youtube_url", "youtube_enabled", "twitter_url", "twitter_enabled",
              "tiktok_url", "tiktok_enabled", "whatsapp_number", "whatsapp_enabled",
            ])}
            onSave={() => handleSave("social", [
              "instagram_url", "instagram_enabled", "facebook_url", "facebook_enabled",
              "youtube_url", "youtube_enabled", "twitter_url", "twitter_enabled",
              "tiktok_url", "tiktok_enabled", "whatsapp_number", "whatsapp_enabled",
            ])}
          >
            {/* Instagram */}
            <div className="space-y-2 p-3 rounded-lg bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium"><Instagram className="w-4 h-4" /> Instagram</span>
                <Switch checked={f.instagram_enabled ?? true} onCheckedChange={(v) => set("instagram_enabled", v)} />
              </div>
              {f.instagram_enabled && (
                <Input value={f.instagram_url ?? ""} onChange={(e) => set("instagram_url", e.target.value)} placeholder="https://instagram.com/..." />
              )}
            </div>
            {/* Facebook */}
            <div className="space-y-2 p-3 rounded-lg bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium"><Facebook className="w-4 h-4" /> Facebook</span>
                <Switch checked={f.facebook_enabled ?? true} onCheckedChange={(v) => set("facebook_enabled", v)} />
              </div>
              {f.facebook_enabled && (
                <Input value={f.facebook_url ?? ""} onChange={(e) => set("facebook_url", e.target.value)} placeholder="https://facebook.com/..." />
              )}
            </div>
            {/* YouTube */}
            <div className="space-y-2 p-3 rounded-lg bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium"><Youtube className="w-4 h-4" /> YouTube</span>
                <Switch checked={f.youtube_enabled ?? false} onCheckedChange={(v) => set("youtube_enabled", v)} />
              </div>
              {f.youtube_enabled && (
                <Input value={f.youtube_url ?? ""} onChange={(e) => set("youtube_url", e.target.value)} placeholder="https://youtube.com/@..." />
              )}
            </div>
            {/* Twitter */}
            <div className="space-y-2 p-3 rounded-lg bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium"><Twitter className="w-4 h-4" /> Twitter / X</span>
                <Switch checked={f.twitter_enabled ?? false} onCheckedChange={(v) => set("twitter_enabled", v)} />
              </div>
              {f.twitter_enabled && (
                <Input value={f.twitter_url ?? ""} onChange={(e) => set("twitter_url", e.target.value)} placeholder="https://x.com/..." />
              )}
            </div>
            {/* TikTok */}
            <div className="space-y-2 p-3 rounded-lg bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium"><TikTokIcon className="w-4 h-4" /> TikTok</span>
                <Switch checked={f.tiktok_enabled ?? false} onCheckedChange={(v) => set("tiktok_enabled", v)} />
              </div>
              {f.tiktok_enabled && (
                <Input value={f.tiktok_url ?? ""} onChange={(e) => set("tiktok_url", e.target.value)} placeholder="https://tiktok.com/@..." />
              )}
            </div>
            {/* WhatsApp */}
            <div className="space-y-2 p-3 rounded-lg bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium"><MessageCircle className="w-4 h-4" /> WhatsApp</span>
                <Switch checked={f.whatsapp_enabled ?? false} onCheckedChange={(v) => set("whatsapp_enabled", v)} />
              </div>
              {f.whatsapp_enabled && (
                <Input value={f.whatsapp_number ?? ""} onChange={(e) => set("whatsapp_number", e.target.value)} placeholder="+33 6 12 34 56 78" />
              )}
            </div>
          </SectionCard>
        )}

        {/* ── Homepage ── */}
        {matchSection("page accueil hero newsletter catégories chatbot abeilles buzz cta") && (
          <SectionCard
            id="homepage"
            icon={<Home className="w-5 h-5" />}
            title="Page d'accueil"
            description="Sections visibles et textes du hero"
            saving={savingSection === "homepage"}
            dirty={isDirty([
              "show_hero", "show_buzz_section", "show_newsletter", "show_categories_filter",
              "show_chatbot", "show_bee_animations", "hero_title", "hero_subtitle", "hero_cta_text",
              "newsletter_title", "newsletter_subtitle", "newsletter_enabled",
            ])}
            onSave={() => handleSave("homepage", [
              "show_hero", "show_buzz_section", "show_newsletter", "show_categories_filter",
              "show_chatbot", "show_bee_animations", "hero_title", "hero_subtitle", "hero_cta_text",
              "newsletter_title", "newsletter_subtitle", "newsletter_enabled",
            ])}
          >
            <div className="space-y-1 divide-y divide-border">
              <ToggleRow label="Section Hero (slider)" checked={f.show_hero ?? true} onChange={(v) => set("show_hero", v)} />
              <ToggleRow label='Section "Ça fait le buzz"' checked={f.show_buzz_section ?? true} onChange={(v) => set("show_buzz_section", v)} />
              <ToggleRow label="Section Newsletter" checked={f.show_newsletter ?? true} onChange={(v) => set("show_newsletter", v)} />
              <ToggleRow label="Filtres Catégories" checked={f.show_categories_filter ?? true} onChange={(v) => set("show_categories_filter", v)} />
              <ToggleRow label="Chatbot Assistant" checked={f.show_chatbot ?? true} onChange={(v) => set("show_chatbot", v)} />
              <ToggleRow label="Animations abeilles" checked={f.show_bee_animations ?? true} onChange={(v) => set("show_bee_animations", v)} />
            </div>
            <div className="border-t border-border pt-4 space-y-4">
              <Field label="Titre du hero">
                <Input value={f.hero_title ?? ""} onChange={(e) => set("hero_title", e.target.value)} />
              </Field>
              <Field label="Sous-titre du hero">
                <Input value={f.hero_subtitle ?? ""} onChange={(e) => set("hero_subtitle", e.target.value)} />
              </Field>
              <Field label="Texte du bouton CTA">
                <Input value={f.hero_cta_text ?? ""} onChange={(e) => set("hero_cta_text", e.target.value)} />
              </Field>
              <Field label="Titre newsletter">
                <Input value={f.newsletter_title ?? ""} onChange={(e) => set("newsletter_title", e.target.value)} />
              </Field>
              <Field label="Sous-titre newsletter">
                <Input value={f.newsletter_subtitle ?? ""} onChange={(e) => set("newsletter_subtitle", e.target.value)} />
              </Field>
            </div>
          </SectionCard>
        )}

        {/* ── Articles ── */}
        {matchSection("articles commentaires modération auteur date partage similaires") && (
          <SectionCard
            id="articles"
            icon={<FileText className="w-5 h-5" />}
            title="Articles & Commentaires"
            description="Commentaires, affichage et pagination"
            saving={savingSection === "articles"}
            dirty={isDirty([
              "comments_enabled", "comments_moderation", "show_author", "show_date",
              "show_related_articles", "show_share_buttons", "articles_per_page",
            ])}
            onSave={() => handleSave("articles", [
              "comments_enabled", "comments_moderation", "show_author", "show_date",
              "show_related_articles", "show_share_buttons", "articles_per_page",
            ])}
          >
            <div className="space-y-1 divide-y divide-border">
              <ToggleRow label="Activer les commentaires" checked={f.comments_enabled ?? true} onChange={(v) => set("comments_enabled", v)} />
              <ToggleRow label="Modération avant publication" description="Les commentaires doivent être approuvés" checked={f.comments_moderation ?? true} onChange={(v) => set("comments_moderation", v)} />
              <ToggleRow label="Afficher l'auteur" checked={f.show_author ?? true} onChange={(v) => set("show_author", v)} />
              <ToggleRow label="Afficher la date" checked={f.show_date ?? true} onChange={(v) => set("show_date", v)} />
              <ToggleRow label="Articles similaires" checked={f.show_related_articles ?? true} onChange={(v) => set("show_related_articles", v)} />
              <ToggleRow label="Boutons de partage" checked={f.show_share_buttons ?? true} onChange={(v) => set("show_share_buttons", v)} />
            </div>
            <Field label="Articles par page">
              <Select value={String(f.articles_per_page ?? 10)} onValueChange={(v) => set("articles_per_page", Number(v))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </SectionCard>
        )}

        {/* ── SEO ── */}
        {matchSection("seo analytics meta description keywords google umami sitemap robots") && (
          <SectionCard
            id="seo"
            icon={<BarChart3 className="w-5 h-5" />}
            title="SEO & Analytics"
            description="Référencement et outils de suivi"
            saving={savingSection === "seo"}
            dirty={isDirty(["meta_description", "meta_keywords", "google_analytics_id", "umami_website_id"])}
            onSave={() => handleSave("seo", ["meta_description", "meta_keywords", "google_analytics_id", "umami_website_id"])}
          >
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
              <Input value={f.meta_keywords ?? ""} onChange={(e) => set("meta_keywords", e.target.value)} placeholder="apiculture, miel, ruches" />
            </Field>
            <Field label="Google Analytics ID" hint="Ex: G-XXXXXXXXXX">
              <Input value={f.google_analytics_id ?? ""} onChange={(e) => set("google_analytics_id", e.target.value)} placeholder="G-XXXXXXXXXX" />
            </Field>
            <Field label="Umami Website ID">
              <Input value={f.umami_website_id ?? ""} onChange={(e) => set("umami_website_id", e.target.value)} />
            </Field>
          </SectionCard>
        )}

        {/* ── Security ── */}
        {matchSection("sécurité maintenance inscription lovable accès") && (
          <SectionCard
            id="security"
            icon={<Shield className="w-5 h-5" />}
            title="Sécurité & Accès"
            description="Mode maintenance et options d'accès"
            saving={savingSection === "security"}
            dirty={isDirty(["maintenance_mode", "public_registration"])}
            onSave={() => handleSave("security", ["maintenance_mode", "public_registration"])}
          >
            <div className="space-y-1 divide-y divide-border">
              <ToggleRow
                label="Mode maintenance"
                description="Affiche une page 'Bientôt disponible' aux visiteurs"
                checked={f.maintenance_mode ?? false}
                onChange={(v) => set("maintenance_mode", v)}
              />
              <ToggleRow
                label="Inscription publique"
                description="Autoriser les visiteurs à créer un compte"
                checked={f.public_registration ?? false}
                onChange={(v) => set("public_registration", v)}
              />
            </div>
          </SectionCard>
        )}

        <div className="h-8" />
      </div>
    </motion.div>
  );
}
