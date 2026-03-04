import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, Instagram, Facebook } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const navItems = [
  { label: "Accueil", path: "/" },
  { label: "Actualité", path: "/categorie/actualite" },
  { label: "Histoires", path: "/categorie/histoires" },
  { label: "Cours gratuit", path: "/categorie/cours" },
  { label: "Santé", path: "/categorie/sante" },
  { label: "Buzz", path: "/categorie/buzz" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { data: settings } = useSiteSettings();
  const siteName = settings?.site_name || "Coin des Apiculteurs";
  const instagramUrl = settings?.instagram_url || "";
  const facebookUrl = settings?.facebook_url || "";

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
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-2xl">🐝</span>
          <span className="font-heading font-bold text-lg text-foreground hidden sm:inline">
            {siteName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="px-3 py-2 text-sm font-medium text-foreground/75 hover:text-primary transition-colors rounded-md hover:bg-primary/5"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-lg text-foreground/60 hover:text-primary hover:bg-primary/5 transition-colors"
            aria-label="Rechercher"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Social */}
          {instagramUrl && (
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
              className="hidden md:flex p-2 rounded-lg text-foreground/60 hover:text-primary hover:bg-primary/5 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {facebookUrl && (
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer"
              className="hidden md:flex p-2 rounded-lg text-foreground/60 hover:text-primary hover:bg-primary/5 transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-foreground/60 hover:text-primary hover:bg-primary/5 transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border overflow-hidden"
          >
            <form onSubmit={handleSearch} className="container mx-auto px-4 py-3 flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un article…"
                className="flex-1 px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg honey-gradient text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Rechercher
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-border overflow-hidden bg-card"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 pt-3 mt-2 border-t border-border">
                {instagramUrl && (
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-foreground/60 hover:text-primary">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {facebookUrl && (
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-foreground/60 hover:text-primary">
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
