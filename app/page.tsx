"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import missionsData from "@/data/missions.json";
import careersData from "@/data/careers.json";
import testimonialsData from "@/data/testimonials.json";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, Code, Target, Sparkles } from "lucide-react";

const chartData = [
  { jour: "Lun", temp: 12 },
  { jour: "Mar", temp: 15 },
  { jour: "Mer", temp: 18 },
  { jour: "Jeu", temp: 20 },
  { jour: "Ven", temp: 22 },
  { jour: "Sam", temp: 19 },
  { jour: "Dim", temp: 16 },
];

export default function Home() {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <motion.section
        className="text-center mb-20 mt-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight"
        >
          <span className="block">La science des données,</span>
          <span className="block">c&apos;est comprendre le monde</span>
          <span className="block text-accent-cyan">avec des chiffres.</span>
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-xl text-foreground-muted mb-8 max-w-2xl mx-auto"
        >
          Découvre le BUT Science des Données en 5 missions rapides + un chatbot étudiant.
        </motion.p>
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <Button href="/missions" variant="primary" size="lg">
            Commencer les missions
          </Button>
          <Button href="/chat" variant="outline" size="lg">
            Parler au chatbot
          </Button>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-6 text-sm text-foreground-muted"
        >
          <div className="flex items-center gap-2">
            <Badge variant="cyan">5 missions</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="violet">~15 min</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge>0 prérequis</Badge>
          </div>
        </motion.div>
      </motion.section>

      {/* Pourquoi c'est fait pour toi */}
      <motion.section
        className="mb-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
          Pourquoi c&apos;est fait pour toi ?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants}>
            <Card>
              <div className="text-4xl mb-4">💭</div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Tu aimes comprendre / expliquer
              </h3>
              <p className="text-foreground-muted">
                Tu cherches des réponses, tu poses des questions, tu veux comprendre comment ça marche.
                La data, c&apos;est trouver des réponses dans les chiffres.
              </p>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card>
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Tu aimes les outils / le numérique
              </h3>
              <p className="text-foreground-muted">
                Tu es à l&apos;aise avec un ordinateur, tu aimes apprendre de nouveaux outils.
                Le BUT SD, c&apos;est Python, Excel, SQL, des tableaux de bord...
              </p>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card>
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Tu veux un métier concret
              </h3>
              <p className="text-foreground-muted">
                Tu veux travailler directement après le BUT ou continuer en école/master.
                Les entreprises cherchent des profils data partout !
              </p>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Ce que tu vas savoir faire */}
      <motion.section
        className="mb-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
          Ce que tu vas savoir faire
        </h2>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-accent-cyan hidden md:block" />
          <div className="space-y-8">
            {[
              { icon: "🧹", title: "Nettoyer", desc: "Préparer et fiabiliser les données avant analyse" },
              { icon: "📊", title: "Analyser", desc: "Trouver des tendances, des corrélations, faire des prédictions" },
              { icon: "📈", title: "Visualiser", desc: "Transformer des chiffres en histoires visuelles" },
              { icon: "⚙️", title: "Automatiser", desc: "Coder des scripts Python/SQL pour traiter les données" },
              { icon: "🤖", title: "Modéliser", desc: "Créer des modèles d&apos;IA pour classer, recommander, prédire" },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-start gap-6 relative"
              >
                <div className="bg-accent-cyan text-background rounded-full w-16 h-16 flex items-center justify-center text-2xl z-10 flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 pt-4">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-foreground-muted text-lg">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Mini démo interactive */}
      <motion.section
        className="mb-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <Card className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Mini démo interactive
          </h2>
          <p className="text-foreground-muted mb-6 text-center">
            Regarde ce graphique de températures sur 7 jours. Quelle tendance vois-tu ?
          </p>
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="jour" stroke="#a3a3a3" />
                <YAxis stroke="#a3a3a3" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #1f1f1f",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="temp" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <motion.div
            className="bg-accent-cyan/20 border border-accent-cyan/30 rounded-lg p-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-foreground">
              <strong>Bien vu !</strong> Les températures montent progressivement de 12°C à 22°C.
              C&apos;est une <strong>tendance à la hausse</strong>. En BUT SD, tu apprends à identifier
              ces tendances dans toutes sortes de données : ventes, trafic web, météo...
            </p>
          </motion.div>
        </Card>
      </motion.section>

      {/* Métiers en sortie */}
      <motion.section
        className="mb-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
          Métiers en sortie
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careersData.slice(0, 6).map((career) => (
            <motion.div key={career.id} variants={itemVariants}>
              <Card hover>
                <h3 className="text-xl font-bold text-foreground mb-3">{career.titre}</h3>
                <p className="text-foreground-muted mb-4">{career.description}</p>
                <div className="flex flex-wrap gap-2">
                  {career.outils.slice(0, 3).map((outil) => (
                    <Badge key={outil} variant="default">{outil}</Badge>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button href="/careers" variant="outline">
            Voir tous les débouchés
          </Button>
        </div>
      </motion.section>

      {/* Témoignages */}
      <motion.section
        className="mb-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
          Ils/elles en parlent
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonialsData.map((testimonial) => (
            <motion.div key={testimonial.id} variants={itemVariants}>
              <Card>
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-foreground">{testimonial.nom}</h3>
                      <Badge variant="cyan">{testimonial.annee}</Badge>
                    </div>
                    <p className="text-foreground-muted mb-2">{testimonial.temoignage}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Final */}
      <motion.section
        className="text-center mb-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-accent-cyan/20 to-accent-violet/20 border-accent-cyan/30">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Prêt à découvrir la data ?
            </h2>
            <p className="text-foreground-muted mb-8 text-lg">
              Lance-toi dans les missions ou pose tes questions au chatbot étudiant !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/missions" variant="primary" size="lg">
                Découvrir les missions
              </Button>
              <Button href="/chat" variant="secondary" size="lg">
                Parler au chatbot
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.section>
    </div>
  );
}
