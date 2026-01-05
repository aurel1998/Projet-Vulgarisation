"use client";

import { motion } from "framer-motion";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";

export default function ProgramPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const competences = [
    { icon: "📊", title: "Tu manipules des données", desc: "Nettoyer, préparer, structurer des données pour les analyser" },
    { icon: "💻", title: "Tu codes des scripts", desc: "Python, SQL pour automatiser le traitement des données" },
    { icon: "📈", title: "Tu fais parler les chiffres", desc: "Analyser des tendances, trouver des corrélations, faire des prédictions" },
    { icon: "🎨", title: "Tu présentes des résultats", desc: "Créer des visualisations, des tableaux de bord, des rapports" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            La Formation
          </h1>
          <p className="text-xl text-foreground-muted">
            Découvre ce que tu vas apprendre en BUT Science des Données, sans jargon !
          </p>
        </motion.div>

        {/* Compétences */}
        <motion.section variants={itemVariants} className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Ce que tu apprends</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {competences.map((comp, idx) => (
              <Card key={idx}>
                <div className="text-4xl mb-4">{comp.icon}</div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{comp.title}</h3>
                <p className="text-foreground-muted">{comp.desc}</p>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Timeline */}
        <motion.section variants={itemVariants} className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Les 6 semestres</h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-accent-cyan hidden md:block" />
            <div className="space-y-8">
              {[
                { sem: "S1-S2", title: "Fondamentaux", desc: "Bases de Python, statistiques, bases de données" },
                { sem: "S3-S4", title: "Approfondissement", desc: "Analyse avancée, visualisation, projets pratiques" },
                { sem: "S5-S6", title: "Spécialisation", desc: "IA, machine learning, stage en entreprise" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="flex items-start gap-6 relative"
                >
                  <div className="bg-accent-cyan text-background rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold z-10 flex-shrink-0">
                    {item.sem}
                  </div>
                  <Card className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-foreground-muted">{item.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Semaine type */}
        <motion.section variants={itemVariants} className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Une semaine type</h2>
          <Card>
            <div className="grid md:grid-cols-5 gap-4">
              {["Lun", "Mar", "Mer", "Jeu", "Ven"].map((jour, idx) => (
                <div key={idx} className="text-center">
                  <div className="font-bold text-foreground mb-2">{jour}</div>
                  <div className="text-sm text-foreground-muted">
                    {idx === 0 || idx === 2 ? "7h" : idx === 1 || idx === 3 ? "6h" : "4h"}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-foreground-muted text-center">
                Environ 35 heures par semaine : cours, TD, projets pratiques. 
                Beaucoup de pratique concrète sur des cas réels !
              </p>
            </div>
          </Card>
        </motion.section>

        {/* Stages */}
        <motion.section variants={itemVariants} className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Stages et alternance</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-2xl font-bold text-foreground mb-3">Stages</h3>
              <p className="text-foreground-muted mb-4">
                Tu feras plusieurs stages en entreprise (en 2e et 3e année généralement).
                C&apos;est l&apos;occasion de mettre en pratique ce que tu apprends dans une vraie entreprise !
              </p>
            </Card>
            <Card>
              <h3 className="text-2xl font-bold text-foreground mb-3">Alternance</h3>
              <p className="text-foreground-muted mb-4">
                Tu peux faire le BUT en alternance selon les IUT : tu alternes entre cours et entreprise.
                C&apos;est une excellente façon d&apos;apprendre et de gagner de l&apos;expérience !
              </p>
            </Card>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div variants={itemVariants} className="text-center">
          <Card className="bg-gradient-to-r from-accent-cyan/20 to-accent-violet/20 border-accent-cyan/30">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Prêt à découvrir concrètement ?
            </h2>
            <p className="text-foreground-muted mb-6">
              Lance-toi dans les missions interactives pour voir ce que tu vas apprendre !
            </p>
            <Button href="/missions" variant="primary" size="lg">
              Découvrir les missions
            </Button>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}



