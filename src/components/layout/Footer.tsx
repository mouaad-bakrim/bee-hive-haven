import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/80 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🐝</span>
              <span className="font-heading font-bold text-lg text-background">Coin des Apiculteurs</span>
            </div>
            <p className="text-sm text-background/60 leading-relaxed">
              Ruches, miel et passion — faisons grandir nos colonies ensemble.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-bold text-background mb-3">Navigation</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-background/60 hover:text-primary transition-colors">Accueil</Link>
              <Link to="/a-propos" className="text-sm text-background/60 hover:text-primary transition-colors">À propos</Link>
              <Link to="/contact" className="text-sm text-background/60 hover:text-primary transition-colors">Nous contacter</Link>
              <Link to="/confidentialite" className="text-sm text-background/60 hover:text-primary transition-colors">Politique de confidentialité</Link>
            </div>
          </div>

          {/* Social + Newsletter */}
          <div>
            <h4 className="font-heading font-bold text-background mb-3">Suivez-nous</h4>
            <div className="flex gap-3 mb-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-background/40">
              Inscrivez-vous à la newsletter pour ne rien rater !
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40">
            © 2024 Coin des Apiculteurs | All Rights Reserved
          </p>
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
