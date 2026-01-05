"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import ProgressBar from "@/components/ProgressBar";
import missionsData from "@/data/missions.json";
import { getProgress } from "@/lib/progress";
import { Clock, Target, TrendingUp, Zap } from "lucide-react";

export default function MissionsPage() {
  const [progress, setProgress] = useState(getProgress());
  const [filter, setFilter] = useState<"all" | "Débutant" | "Curieux" | "Déjà à l'aise">("all");

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const filteredMissions = filter === "all" 
    ? missionsData 
    : missionsData.filter(m => m.difficulte === filter);

  const progressPercentage = (progress.missionsCompleted.length / missionsData.length) * 100;

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
        className="mb-12"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-foreground mb-4"
        >
          Missions interactives
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-xl text-foreground-muted mb-8"
        >
          Découvre les compétences du BUT Science des Données à travers 5 missions ludiques.
        </motion.p>

        {/* Progression */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Ta progression</h2>
                <p className="text-foreground-muted">
                  {progress.missionsCompleted.length} / {missionsData.length} missions complétées
                </p>
              </div>
              <div className="text-3xl font-bold text-accent-cyan">
                {progress.score} pts
              </div>
            </div>
            <ProgressBar value={progressPercentage} label="Progression globale" />
            {progress.badges.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-foreground-muted">Badges :</span>
                {progress.badges.map((badge) => (
                  <Badge key={badge} variant="cyan">{badge}</Badge>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Filtres et mode rapide */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-accent-cyan text-background"
                : "bg-background-secondary text-foreground-muted hover:text-foreground"
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter("Débutant")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "Débutant"
                ? "bg-accent-cyan text-background"
                : "bg-background-secondary text-foreground-muted hover:text-foreground"
            }`}
          >
            Débutant
          </button>
          <button
            onClick={() => setFilter("Curieux")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "Curieux"
                ? "bg-accent-cyan text-background"
                : "bg-background-secondary text-foreground-muted hover:text-foreground"
            }`}
          >
            Curieux
          </button>
          <button
            onClick={() => setFilter("Déjà à l'aise")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "Déjà à l'aise"
                ? "bg-accent-cyan text-background"
                : "bg-background-secondary text-foreground-muted hover:text-foreground"
            }`}
          >
            Déjà à l&apos;aise
          </button>
          <Link
            href="/missions/rapide"
            className="px-4 py-2 bg-accent-violet text-background rounded-lg hover:bg-accent-violet-dark transition-colors font-medium"
          >
            <Zap className="inline mr-2" size={16} />
            Mode Lycéen pressé (5 min)
          </Link>
        </motion.div>

        {/* Liste des missions */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredMissions.map((mission) => {
            const isCompleted = progress.missionsCompleted.includes(mission.id);
            return (
              <motion.div
                key={mission.id}
                variants={itemVariants}
              >
                <Card className={`h-full flex flex-col ${isCompleted ? "border-accent-cyan border-2" : ""}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-foreground">
                          Mission {mission.id} : {mission.titre}
                        </h3>
                        {isCompleted && (
                          <Badge variant="cyan">✓ Complétée</Badge>
                        )}
                      </div>
                      <p className="text-foreground-muted mb-4">{mission.sousTitre}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="default">
                      <Clock className="inline mr-1" size={14} />
                      {mission.duree}
                    </Badge>
                    <Badge
                      variant={
                        mission.difficulte === "Débutant"
                          ? "cyan"
                          : mission.difficulte === "Curieux"
                          ? "violet"
                          : "default"
                      }
                    >
                      {mission.difficulte}
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-foreground mb-2">
                      Ce que tu vas faire :
                    </p>
                    <p className="text-sm text-foreground-muted">{mission.ceQueTuFais}</p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-border">
                    <Link href={`/missions/${mission.id}`}>
                      <Button variant="primary" className="w-full">
                        Lancer la mission
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}



