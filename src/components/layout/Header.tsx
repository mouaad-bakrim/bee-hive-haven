import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, X, Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useCategories } from "@/hooks/useCategories";
import { useTranslation } from "@/hooks/useTranslation";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.16a8.16 8.16 0 004.76 1.53v-3.5a4.82 4.82 0 01-1-.5z" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { data: settings } = useSiteSettings();
  const { data: categories } = useCategories();
  const { t } = useTranslation();
  const menuRef = useRef<HTMLDivElement>(null);

  const siteName = settings?.site_name || t("site_name");
  const logoUrl = settings?.logo_url || "";

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [mobileOpen]);

  const navItems = [
    { label: t("nav_home"), path: "/" },
    ...(categories ?? []).map((c) => ({ label: c.name, path: `/categorie/${c.slug}` })),
    { label: t("nav_community"), path: "/communaute" },
    { label: t("nav_glossary"), path: "/glossaire" },
    { label: t("nav_calendar"), path: "/calendrier" },
  ];

  const socialLinks = [
    { url: settings?.instagram_url, enabled: settings?.instagram_enabled, icon: <Instagram className="w-4 h-4" />, label: "Instagram" },
    { url: settings?.facebook_url, enabled: settings?.facebook_enabled, icon: <Facebook className="w-4 h-4" />, label: "Facebook" },
    { url: settings?.youtube_url, enabled: settings?.youtube_enabled, icon: <Youtube className="w-4 h-4" />, label: "YouTube" },
    { url: settings?.tiktok_url, enabled: settings?.tiktok_enabled, icon: <TikTokIcon className="w-4 h-4" />, label: "TikTok" },
    { url: settings?.twitter_url, enabled: settings?.twitter_enabled, icon: <Twitter className="w-4 h-4" />, label: "Twitter" },
    { url: (settings as any)?.pinterest_url, enabled: (settings as any)?.pinterest_enabled, icon: <PinterestIcon className="w-4 h-4" />, label: "Pinterest" },
  ].filter((s) => s.enabled !== false && s.url);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const closeMenu = () => setMobileOpen(false);

  return (
    <header ref={menuRef} className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0" onClick={closeMenu}>
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
            className="p-2 rounded-lg text-foreground/60 hover:text-primary hover:bg-primary/5 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label={t("search")}>
            <Search className="w-5 h-5" />
          </button>

          {socialLinks.slice(0, 3).map((s) => (
            <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer" aria-label={s.label}
              className="hidden md:flex p-2 rounded-lg text-foreground/60 hover:text-primary hover:bg-primary/5 transition-colors min-h-[44px] min-w-[44px] items-center justify-center">
              {s.icon}
            </a>
          ))}

          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-foreground/60 hover:text-primary hover:bg-primary/5 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Menu">
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
                placeholder={t("search_article")}
                className="flex-1 px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm min-h-[44px]"
                autoFocus />
              <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity min-h-[44px]">
                {t("search_btn")}
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
                <Link key={item.path} to={item.path} onClick={closeMenu}
                  className="px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors min-h-[44px] flex items-center">
                  {item.label}
                </Link>
              ))}
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-3 pt-3 mt-2 border-t border-border">
                  {socialLinks.map((s) => (
                    <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                      className="p-2 text-foreground/60 hover:text-primary min-h-[44px] min-w-[44px] flex items-center justify-center">
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
