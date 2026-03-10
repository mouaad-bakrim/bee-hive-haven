import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.16a8.16 8.16 0 004.76 1.53v-3.5a4.82 4.82 0 01-1-.5z" />
    </svg>
  );
}

export default function Footer() {
  const { data: settings } = useSiteSettings();
  const siteName = settings?.site_name || "Coin des Apiculteurs";
  const slogan = settings?.slogan || "Ruches, miel et passion — faisons grandir nos colonies ensemble.";
  const contactEmail = settings?.contact_email || "";

  const socialLinks = [
    { url: settings?.instagram_url, enabled: settings?.instagram_enabled, icon: <Instagram className="w-4 h-4" />, label: "Instagram" },
    { url: settings?.facebook_url, enabled: settings?.facebook_enabled, icon: <Facebook className="w-4 h-4" />, label: "Facebook" },
    { url: settings?.youtube_url, enabled: settings?.youtube_enabled, icon: <Youtube className="w-4 h-4" />, label: "YouTube" },
    { url: settings?.tiktok_url, enabled: settings?.tiktok_enabled, icon: <TikTokIcon className="w-4 h-4" />, label: "TikTok" },
    { url: settings?.twitter_url, enabled: settings?.twitter_enabled, icon: <Twitter className="w-4 h-4" />, label: "Twitter" },
  ].filter((s) => s.enabled !== false && s.url);

  return (
    <footer className="bg-foreground text-background/80 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🐝</span>
              <span className="font-heading font-bold text-lg text-background">{siteName}</span>
            </div>
            <p className="text-sm text-background/60 leading-relaxed">{slogan}</p>
          </div>

          <div>
            <h4 className="font-heading font-bold text-background mb-3">Navigation</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-background/60 hover:text-primary transition-colors">Accueil</Link>
              <Link to="/a-propos" className="text-sm text-background/60 hover:text-primary transition-colors">À propos</Link>
              <Link to="/contact" className="text-sm text-background/60 hover:text-primary transition-colors">Nous contacter</Link>
              <Link to="/confidentialite" className="text-sm text-background/60 hover:text-primary transition-colors">Politique de confidentialité</Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-background mb-3">Suivez-nous</h4>
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mb-4">
                {socialLinks.map((s) => (
                  <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
            {contactEmail && (
              <p className="text-xs text-background/40">
                📧 <a href={`mailto:${contactEmail}`} className="hover:text-primary transition-colors">{contactEmail}</a>
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40">© {new Date().getFullYear()} {siteName} | All Rights Reserved</p>
          <div className="flex gap-4 text-xs text-background/40">
            <Link to="/confidentialite" className="hover:text-primary transition-colors">Confidentialité</Link>
            <Link to="/a-propos" className="hover:text-primary transition-colors">À propos</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
