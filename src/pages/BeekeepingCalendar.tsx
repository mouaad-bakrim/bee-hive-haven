import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const MONTHS = [
  {
    name: "Janvier", emoji: "❄️", color: "bg-blue-500/10 border-blue-500/20",
    title: "Hivernage",
    tasks: ["Vérifier les réserves de nourriture", "S'assurer que la ruche est bien ventilée", "Ne pas ouvrir la ruche sauf urgence", "Traiter contre le varroa si nécessaire"],
    tip: "Les abeilles forment une grappe pour maintenir la chaleur autour de 35°C au centre.",
  },
  {
    name: "Février", emoji: "🌨️", color: "bg-blue-400/10 border-blue-400/20",
    title: "Fin d'hivernage",
    tasks: ["Peser les ruches pour évaluer les réserves", "Préparer le matériel pour le printemps", "Commander les cadres et la cire gaufrée", "Nourrir au candi si réserves faibles"],
    tip: "La reine recommence à pondre. La colonie a besoin de protéines (pollen).",
  },
  {
    name: "Mars", emoji: "🌸", color: "bg-green-500/10 border-green-500/20",
    title: "Reprise d'activité",
    tasks: ["Première visite de printemps", "Vérifier la présence de la reine", "Évaluer la force de la colonie", "Nettoyer les plateaux", "Remplacer les vieux cadres"],
    tip: "Les premières fleurs (saule, noisetier) fournissent pollen et nectar essentiels.",
  },
  {
    name: "Avril", emoji: "🌼", color: "bg-green-400/10 border-green-400/20",
    title: "Développement",
    tasks: ["Ajouter des cadres de cire gaufrée", "Surveiller l'espace dans la ruche", "Prévenir l'essaimage", "Poser les premières hausses"],
    tip: "La population explose. Une colonie forte peut passer de 10 000 à 40 000 abeilles.",
  },
  {
    name: "Mai", emoji: "🐝", color: "bg-amber-500/10 border-amber-500/20",
    title: "Essaimage & Miellée",
    tasks: ["Surveillance hebdomadaire de l'essaimage", "Détruire les cellules royales si besoin", "Créer des essaims artificiels", "Ajouter des hausses", "Début de la grande miellée"],
    tip: "Le mois le plus actif ! L'essaimage est le mode naturel de reproduction de la colonie.",
  },
  {
    name: "Juin", emoji: "🌻", color: "bg-amber-400/10 border-amber-400/20",
    title: "Pleine miellée",
    tasks: ["Récolter le miel de printemps", "Ajouter des hausses si nécessaire", "Surveiller les réserves d'eau", "Vérifier l'état sanitaire"],
    tip: "Une colonie en pleine forme peut produire jusqu'à 2 kg de miel par jour !",
  },
  {
    name: "Juillet", emoji: "☀️", color: "bg-orange-500/10 border-orange-500/20",
    title: "Récolte d'été",
    tasks: ["Récolter le miel d'été", "Extraction et mise en pot", "Laisser suffisamment de miel aux abeilles", "Surveiller les pillages entre ruches"],
    tip: "Récoltez le matin quand les butineuses sont en vol pour minimiser le dérangement.",
  },
  {
    name: "Août", emoji: "🍯", color: "bg-orange-400/10 border-orange-400/20",
    title: "Préparation de l'hivernage",
    tasks: ["Dernière récolte de miel", "Réunir les colonies faibles", "Traitement anti-varroa obligatoire", "Commencer le nourrissement"],
    tip: "Le varroa est l'ennemi n°1. Un traitement bien mené est crucial pour la survie hivernale.",
  },
  {
    name: "Septembre", emoji: "🍂", color: "bg-amber-600/10 border-amber-600/20",
    title: "Nourrissement",
    tasks: ["Nourrir au sirop lourd (2:1)", "Vérifier les réserves (min. 15-18 kg)", "Réduire les entrées de ruche", "Protéger contre les frelons asiatiques"],
    tip: "Les abeilles nées en septembre-octobre sont les abeilles d'hiver, elles vivront 6 mois.",
  },
  {
    name: "Octobre", emoji: "🍁", color: "bg-red-500/10 border-red-500/20",
    title: "Mise en hivernage",
    tasks: ["Dernière inspection de l'année", "Poser les partitions si nécessaire", "Protéger contre le vent et l'humidité", "Installer des portes anti-souris"],
    tip: "Une bonne isolation et ventilation sont plus importantes que le chauffage de la ruche.",
  },
  {
    name: "Novembre", emoji: "🌧️", color: "bg-gray-500/10 border-gray-500/20",
    title: "Repos",
    tasks: ["Laisser les abeilles tranquilles", "Entretenir et réparer le matériel", "Faire le bilan de la saison", "Planifier l'année suivante"],
    tip: "C'est le moment de lire, se former et échanger avec d'autres apiculteurs.",
  },
  {
    name: "Décembre", emoji: "🎄", color: "bg-gray-400/10 border-gray-400/20",
    title: "Hivernage",
    tasks: ["Vérifier que les ruches ne sont pas renversées", "Traitement varroa à l'acide oxalique", "Préparer les commandes de matériel", "Offrir du miel pour les fêtes ! 🍯"],
    tip: "Le traitement à l'acide oxalique par dégouttement se fait en absence de couvain.",
  },
];

export default function BeekeepingCalendar() {
  const currentMonth = new Date().getMonth();
  const [selected, setSelected] = useState(currentMonth);

  const month = MONTHS[selected];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 inline-block mr-2 text-primary" />
            Calendrier Apicole
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">Les activités essentielles mois par mois pour vos ruches.</p>
        </div>

        {/* Month selector */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 mb-6 sm:mb-8">
          {MONTHS.map((m, i) => (
            <button
              key={m.name}
              onClick={() => setSelected(i)}
              className={`p-2 rounded-xl text-center transition-all min-h-[44px] ${
                selected === i
                  ? "honey-gradient text-primary-foreground shadow-md scale-105"
                  : i === currentMonth
                  ? "bg-primary/10 border border-primary/30 text-foreground hover:bg-primary/20"
                  : "bg-card border border-border text-foreground hover:border-primary/30"
              }`}
            >
              <span className="text-base sm:text-lg block">{m.emoji}</span>
              <span className="text-[10px] sm:text-xs font-medium">{m.name.slice(0, 3)}</span>
            </button>
          ))}
        </div>

        {/* Month detail */}
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl border p-4 sm:p-6 md:p-8 ${month.color}`}
        >
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <span className="text-3xl sm:text-4xl">{month.emoji}</span>
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">{month.name}</h2>
              <p className="text-primary font-medium text-sm sm:text-base">{month.title}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="font-heading font-bold text-foreground mb-3 text-sm sm:text-base">📋 Tâches du mois</h3>
              <ul className="space-y-2">
                {month.tasks.map((task, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-foreground break-words">{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card/50 rounded-lg p-4 border border-border/50">
              <h3 className="font-heading font-bold text-foreground mb-2 text-sm sm:text-base">💡 Le saviez-vous ?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed break-words">{month.tip}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
