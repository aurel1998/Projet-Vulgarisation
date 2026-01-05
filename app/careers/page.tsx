"use client";

import { motion } from "framer-motion";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import careersData from "@/data/careers.json";
import Link from "next/link";

export default function CareersPage() {
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
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Métiers et débouchés
          </h1>
          <p className="text-xl text-foreground-muted mb-8">
            Après le BUT Science des Données, tu as plein de possibilités ! Découvre les métiers qui t&apos;attendent.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {careersData.map((career) => (
            <motion.div key={career.id} variants={itemVariants}>
              <Card className="h-full flex flex-col">
                <h2 className="text-2xl font-bold text-foreground mb-3">{career.titre}</h2>
                <p className="text-foreground-muted mb-4 flex-1">{career.description}</p>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-foreground mb-2">Ce que tu fais :</p>
                  <p className="text-sm text-foreground-muted mb-3">{career.whatYouDo}</p>
                </div>

                {career.linkToMissions && career.linkToMissions.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-foreground mb-2">Missions liées :</p>
                    <div className="flex flex-wrap gap-2">
                      {career.linkToMissions.map((mission, idx) => (
                        <Badge key={idx} variant="cyan">{mission}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm font-medium text-foreground mb-2">Outils utilisés :</p>
                  <div className="flex flex-wrap gap-2">
                    {career.outils.map((outil) => (
                      <Badge key={outil} variant="default">{outil}</Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-4 pt-4 border-t border-border">
                  <p className="text-sm font-medium text-foreground mb-2">Salaire débutant :</p>
                  <p className="text-accent-cyan font-bold">{career.salaireDebut}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-foreground mb-2">Perspectives :</p>
                  <p className="text-sm text-foreground-muted">{career.perspectives}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants} className="text-center">
          <Card className="bg-gradient-to-r from-accent-cyan/20 to-accent-violet/20 border-accent-cyan/30">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Tu veux en savoir plus ?
            </h2>
            <p className="text-foreground-muted mb-6">
              Découvre les missions interactives pour voir concrètement ce que tu apprendras en BUT SD !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/missions" variant="primary" size="lg">
                Découvrir les missions
              </Button>
              <Button href="/apply" variant="outline" size="lg">
                Comment candidater
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

