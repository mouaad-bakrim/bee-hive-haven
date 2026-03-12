import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useTranslation } from "@/hooks/useTranslation";
import NewsletterForm from "@/components/NewsletterForm";

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

export default function Footer() {
  const { data: settings } = useSiteSettings();
  const { t } = useTranslation();
  const siteName = settings?.site_name || t("site_name");
  const slogan = settings?.slogan || "Ruches, miel et passion — faisons grandir nos colonies ensemble.";
  const contactEmail = settings?.contact_email || "";
  const showNewsletter = settings?.show_newsletter !== false;

  const socialLinks = [
    { url: settings?.instagram_url, enabled: settings?.instagram_enabled, icon: <Instagram className="w-4 h-4" />, label: "Instagram" },
    { url: settings?.facebook_url, enabled: settings?.facebook_enabled, icon: <Facebook className="w-4 h-4" />, label: "Facebook" },
    { url: settings?.youtube_url, enabled: settings?.youtube_enabled, icon: <Youtube className="w-4 h-4" />, label: "YouTube" },
    { url: settings?.tiktok_url, enabled: settings?.tiktok_enabled, icon: <TikTokIcon className="w-4 h-4" />, label: "TikTok" },
    { url: settings?.twitter_url, enabled: settings?.twitter_enabled, icon: <Twitter className="w-4 h-4" />, label: "Twitter" },
    { url: (settings as any)?.pinterest_url, enabled: (settings as any)?.pinterest_enabled, icon: <PinterestIcon className="w-4 h-4" />, label: "Pinterest" },
  ].filter((s) => s.enabled !== false && s.url);

  return (
    <footer className="bg-foreground text-background/80 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
              <Link to="/" className="text-sm text-background/60 hover:text-primary transition-colors">{t("nav_home")}</Link>
              <Link to="/communaute" className="text-sm text-background/60 hover:text-primary transition-colors">{t("nav_community")}</Link>
              <Link to="/glossaire" className="text-sm text-background/60 hover:text-primary transition-colors">{t("nav_glossary")}</Link>
              <Link to="/calendrier" className="text-sm text-background/60 hover:text-primary transition-colors">{t("nav_calendar")}</Link>
              <Link to="/a-propos" className="text-sm text-background/60 hover:text-primary transition-colors">{t("about")}</Link>
              <Link to="/contact" className="text-sm text-background/60 hover:text-primary transition-colors">{t("contact")}</Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-background mb-3">{t("follow_us")}</h4>
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
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

          {showNewsletter && (
            <div>
              <NewsletterForm
                title={settings?.newsletter_title || t("newsletter_title")}
                subtitle={settings?.newsletter_subtitle || t("newsletter_subtitle")}
                variant="card"
              />
            </div>
          )}
        </div>

        <div className="mt-10 pt-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40">© {new Date().getFullYear()} {siteName} | All Rights Reserved</p>
          <div className="flex gap-4 text-xs text-background/40">
            <Link to="/confidentialite" className="hover:text-primary transition-colors">{t("privacy")}</Link>
            <Link to="/a-propos" className="hover:text-primary transition-colors">{t("about")}</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">{t("contact")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
