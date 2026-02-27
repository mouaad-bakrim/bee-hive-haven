import { motion } from "framer-motion";

export default function Privacy() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-6">🔒 Politique de confidentialité</h1>

      <div className="article-content">
        <p><em>Dernière mise à jour : janvier 2024</em></p>

        <h2>1. Collecte des données</h2>
        <p>Nous collectons uniquement les données que vous nous fournissez volontairement via notre formulaire de contact (nom, email, message). Aucune donnée personnelle n'est collectée automatiquement à des fins commerciales.</p>

        <h2>2. Utilisation des données</h2>
        <p>Vos données sont utilisées exclusivement pour répondre à vos demandes et améliorer nos services. Elles ne sont jamais vendues ni partagées avec des tiers.</p>

        <h2>3. Cookies</h2>
        <p>Notre site utilise des cookies techniques essentiels au bon fonctionnement du site. Aucun cookie publicitaire n'est utilisé.</p>

        <h2>4. Vos droits (RGPD)</h2>
        <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
        <ul>
          <li>Droit d'accès à vos données personnelles</li>
          <li>Droit de rectification</li>
          <li>Droit à l'effacement</li>
          <li>Droit à la portabilité</li>
          <li>Droit d'opposition au traitement</li>
        </ul>

        <h2>5. Contact</h2>
        <p>Pour toute question relative à vos données personnelles, contactez-nous via notre formulaire de contact.</p>

        <p><em>Le Coin des Apiculteurs s'engage à protéger votre vie privée. 🐝</em></p>
      </div>
    </motion.div>
  );
}
