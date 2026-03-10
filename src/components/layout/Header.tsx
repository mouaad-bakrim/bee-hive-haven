import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useCategories } from "@/hooks/useCategories";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.16a8.16 8.16 0 004.76 1.53v-3.5a4.82 4.82 0 01-1-.5z" />
    </svg>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { data: settings } = useSiteSettings();
  const { data: categories } = useCategories();

  const siteName = settings?.site_name || "Coin des Apiculteurs";
  const logoUrl = settings?.logo_url || "";

  const navItems = [
    { label: "Accueil", path: "/" },
    ...(categories ?? []).map((c) => ({ label: c.name, path: `/categorie/${c.slug}` })),
    { label: "Communauté", path: "/communaute" },
    { label: "Glossaire", path: "/glossaire" },
    { label: "Calendrier", path: "/calendrier" },
  ];

  const socialLinks = [
    { url: settings?.instagram_url, enabled: settings?.instagram_enabled, icon: <Instagram className="w-4 h-4" />, label: "Instagram" },
    { url: settings?.facebook_url, enabled: settings?.facebook_enabled, icon: <Facebook className="w-4 h-4" />, label: "Facebook" },
    { url: settings?.youtube_url, enabled: settings?.youtube_enabled, icon: <Youtube className="w-4 h-4" />, label: "YouTube" },
    { url: settings?.tiktok_url, enabled: settings?.tiktok_enabled, icon: <TikTokIcon className="w-4 h-4" />, label: "TikTok" },
    { url: settings?.twitter_url, enabled: settings?.twitter_enabled, icon: <Twitter className="w-4 h-4" />, label: "Twitter" },
  ].filter((s) => s.enabled !== false && s.url);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          {logoUrl ? (
            <img src={logoUrl} alt={siteName} className="h-8 w-auto" />
          ) : (
            <span className="text-2xl">🐝</span>
          )}
          <span className="font-heading font-bold text-lg text-foreground hidden sm:inline">{siteName}</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}
              className="px-3 py-2 text-sm font-medium text-foreground/75 hover:text-primary transition-colors rounded-md hover:bg-primary/5">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-lg text-foreground/60 hover:text-primary hover:bg-primary/5 transition-colors" aria-label="Rechercher">
            <Search className="w-5 h-5" />
          </button>

          {socialLinks.slice(0, 3).map((s) => (
            <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer" aria-label={s.label}
              className="hidden md:flex p-2 rounded-lg text-foreground/60 hover:text-primary hover:bg-primary/5 transition-colors">
              {s.icon}
            </a>
          ))}

          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-foreground/60 hover:text-primary hover:bg-primary/5 transition-colors" aria-label="Menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="border-t border-border overflow-hidden">
            <form onSubmit={handleSearch} className="container mx-auto px-4 py-3 flex gap-2">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un article…"
                className="flex-1 px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                autoFocus />
              <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                Rechercher
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-border overflow-hidden bg-card">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                  {item.label}
                </Link>
              ))}
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-3 pt-3 mt-2 border-t border-border">
                  {socialLinks.map((s) => (
                    <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                      className="p-2 text-foreground/60 hover:text-primary">
                      {s.icon}
                    </a>
                  ))}
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
