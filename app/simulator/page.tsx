"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { ArrowRight, CheckCircle, Sparkles, RotateCcw } from "lucide-react";
import { recommendPath, type SimulatorAnswers, type Bac, type Interet, type Pref } from "@/lib/simulator";
import { storage } from "@/lib/storage";
import missionsData from "@/data/missions.json";
import careersData from "@/data/careers.json";

export default function SimulatorPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<SimulatorAnswers>({
    bac: null,
    interet: null,
    pref: null,
  });
  const [result, setResult] = useState<ReturnType<typeof recommendPath> | null>(null);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // S'assurer que nous sommes côté client
  useEffect(() => {
    setIsClient(true);
    const savedAnswers = storage.get<SimulatorAnswers>("simulator.answers");
    const savedResult = storage.get<ReturnType<typeof recommendPath>>("simulator.result");
    
    if (savedAnswers && savedResult) {
      setHasSavedData(true);
    }
  }, []);

  const updateAnswer = <K extends keyof SimulatorAnswers>(
    key: K,
    value: SimulatorAnswers[K]
  ) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    storage.set("simulator.answers", newAnswers);
  };

  const handleSubmit = () => {
    if (answers.bac && answers.interet && answers.pref) {
      const recommendation = recommendPath(answers);
      setResult(recommendation);
      storage.set("simulator.result", recommendation);
      setStep(3);
    }
  };

  const handleReset = () => {
    setAnswers({ bac: null, interet: null, pref: null });
    setResult(null);
    setStep(0);
    storage.remove("simulator.answers");
    storage.remove("simulator.result");
    setHasSavedData(false);
  };

  const handleResume = () => {
    const savedAnswers = storage.get<SimulatorAnswers>("simulator.answers");
    const savedResult = storage.get<ReturnType<typeof recommendPath>>("simulator.result");
    
    if (savedAnswers && savedResult) {
      setAnswers(savedAnswers);
      setResult(savedResult);
      setStep(3);
    }
  };

  const questions = [
    {
      id: "bac" as const,
      title: "Ton bac",
      icon: "🎓",
      options: [
        { value: "Général" as Bac, label: "Général" },
        { value: "Techno" as Bac, label: "Techno" },
      ],
    },
    {
      id: "interet" as const,
      title: "Tu aimes plutôt",
      icon: "🎯",
      options: [
        { value: "Sport" as Interet, label: "Sport" },
        { value: "Réseaux" as Interet, label: "Réseaux" },
        { value: "Environnement" as Interet, label: "Environnement" },
        { value: "Marketing" as Interet, label: "Marketing" },
      ],
    },
    {
      id: "pref" as const,
      title: "Tu préfères",
      icon: "⚡",
      options: [
        { value: "Projets" as Pref, label: "Projets" },
        { value: "Théorie" as Pref, label: "Théorie" },
        { value: "Mix" as Pref, label: "Mix" },
      ],
    },
  ];

  const isComplete = answers.bac && answers.interet && answers.pref;

  // Vérifier que les données sont chargées
  if (!isClient || !missionsData || !careersData) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-5xl font-bold text-foreground mb-4">Simulateur de Parcours</h1>
        <p className="text-foreground-muted">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <Sparkles className="text-accent-cyan" size={48} />
          Simule ton parcours
        </h1>
        <p className="text-xl text-foreground-muted mb-6">
          3 questions → tes missions + tes métiers + des conseils
        </p>
        
        {/* Proposer de reprendre si données sauvegardées */}
        {hasSavedData && step < 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Button variant="outline" onClick={handleResume} size="md">
              Reprendre mon simulateur
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Formulaire - 3 questions */}
      {step < 3 && questions[step] && (
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{questions[step].icon}</div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {questions[step].title}
                </h2>
                <div className="flex justify-center gap-2 mt-4">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === step
                          ? "bg-accent-cyan w-8"
                          : i < step
                          ? "bg-accent-violet w-2"
                          : "bg-border w-2"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {questions[step].options.map((option) => {
                  const key = questions[step].id;
                  if (!key) return null;
                  const isSelected = answers[key] === option.value;
                  return (
                    <motion.button
                      key={option.value}
                      onClick={() => updateAnswer(key, option.value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-6 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? "border-accent-cyan bg-accent-cyan/20 shadow-lg shadow-accent-cyan/20"
                          : "border-border bg-background-secondary hover:border-accent-violet/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-semibold text-foreground">
                          {option.label}
                        </span>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-accent-cyan"
                          >
                            <CheckCircle size={24} />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="secondary"
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                >
                  ← Précédent
                </Button>
                {step < 2 ? (
                  <Button
                    variant="primary"
                    onClick={() => setStep(step + 1)}
                    disabled={!questions[step] || !answers[questions[step].id]}
                  >
                    Suivant <ArrowRight size={20} className="ml-2" />
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={!isComplete}
                    size="lg"
                  >
                    Voir mon parcours <ArrowRight size={20} className="ml-2" />
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Résultats */}
      {step === 3 && result && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Ton chemin conseillé */}
            <Card className="bg-gradient-to-br from-accent-cyan/20 via-accent-violet/20 to-background-tertiary border-accent-cyan/30">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="text-accent-cyan" size={32} />
                <h2 className="text-3xl font-bold text-foreground">Ton chemin conseillé</h2>
              </div>
              <p className="text-foreground-muted mb-6 text-lg">
                Commence par explorer ces 3 missions pour découvrir concrètement le BUT SD :
              </p>
              <div className="space-y-4">
                {result.missionIds.map((missionId, idx) => {
                  const mission = missionsData.find((m) => m.id === missionId);
                  if (!mission) return null;
                  return (
                    <motion.div
                      key={missionId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-background-secondary rounded-lg p-5 border border-border hover:border-accent-cyan/50 transition-colors"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-accent-cyan text-background flex items-center justify-center font-bold text-lg flex-shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-foreground">
                              {mission.titre}
                            </h3>
                            <p className="text-foreground-muted">{mission.sousTitre}</p>
                          </div>
                        </div>
                        <Link
                          href={`/missions/${mission.id}`}
                          className="px-4 py-2 bg-accent-cyan text-background rounded-lg hover:bg-accent-cyan-dark transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                          Voir <ArrowRight size={16} />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>

            {/* Métiers recommandés */}
            <Card>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Métiers qui pourraient te plaire
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {result.careerTitres.map((titre, idx) => {
                  const career = careersData.find((c) => c.titre === titre);
                  if (!career) return null;
                  return (
                    <motion.div
                      key={titre}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 + 0.3 }}
                      className="bg-background-secondary rounded-lg p-6 border border-border hover:border-accent-violet/50 transition-colors"
                    >
                      <h3 className="text-2xl font-bold text-foreground mb-3">
                        {career.titre}
                      </h3>
                      <p className="text-foreground-muted mb-4">{career.description}</p>
                      <p className="text-foreground mb-4">{career.whatYouDo}</p>
                      <Link
                        href="/careers"
                        className="text-accent-cyan hover:text-accent-cyan-dark underline font-medium"
                      >
                        En savoir plus →
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </Card>

            {/* Conseils */}
            <Card className="bg-background-secondary">
              <h2 className="text-3xl font-bold text-foreground mb-6">3 conseils pour toi</h2>
              <div className="space-y-4">
                {result.tips.map((tip, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 + 0.5 }}
                    className="bg-background rounded-lg p-5 border-l-4 border-accent-cyan"
                  >
                    <p className="text-foreground leading-relaxed text-lg">{tip}</p>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Actions finales */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="secondary" onClick={handleReset}>
                <RotateCcw size={20} className="mr-2" />
                Recommencer
              </Button>
              <Link href="/missions">
                <Button variant="primary" size="lg">
                  Commencer mes missions <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" size="lg">
                  Parler au chatbot <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
