import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-6">🐝 À propos du Coin des Apiculteurs</h1>

      <div className="article-content">
        <p>
          <strong>Le Coin des Apiculteurs</strong> est une communauté en ligne dédiée à tous les passionnés d'abeilles et d'apiculture.
          Que vous soyez débutant curieux ou apiculteur chevronné, vous trouverez ici des ressources, des témoignages et des conseils pour
          faire prospérer vos colonies.
        </p>

        <h2>Notre mission</h2>
        <p>
          Notre mission est simple : rassembler la communauté apicole francophone, partager les savoirs et promouvoir une apiculture
          respectueuse des abeilles et de l'environnement. 🌿
        </p>

        <h2>Ce que nous proposons</h2>
        <ul>
          <li>📰 Des <strong>articles d'actualité</strong> sur le monde apicole</li>
          <li>🍯 Des <strong>conseils santé</strong> autour des produits de la ruche</li>
          <li>📚 Des <strong>cours gratuits</strong> et guides téléchargeables</li>
          <li>💬 Des <strong>histoires</strong> et témoignages d'apiculteurs</li>
          <li>🐝 Du <strong>contenu buzz</strong> pour le plaisir !</li>
        </ul>

        <div className="did-you-know">
          <span className="dyk-icon">🐝</span>
          <div>
            <strong>Le saviez-vous ?</strong>
            <p>Les abeilles pollinisent environ 80% des plantes à fleurs et contribuent à un tiers de notre alimentation. Les protéger, c'est protéger notre avenir.</p>
          </div>
        </div>

        <p>
          Envie de rejoindre l'aventure ? <Link to="/contact" className="text-primary font-medium hover:underline">Contactez-nous</Link> ou
          suivez-nous sur les réseaux sociaux !
        </p>
      </div>
    </motion.div>
  );
}
