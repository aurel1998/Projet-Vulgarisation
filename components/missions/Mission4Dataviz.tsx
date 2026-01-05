"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { CheckCircle, XCircle, ArrowRight, AlertTriangle, TrendingUp, BarChart3, PieChart as PieChartIcon, RotateCcw } from "lucide-react";
import mission4Data from "@/data/mission4.json";
import { completeMission } from "@/lib/progress";

interface Scenario {
  id: string;
  title: string;
  question: string;
  data: Array<{ label?: string; day?: string; value: number }>;
  options: string[];
  correct: string;
  why: string;
}

interface Mission4DatavizProps {
  missionId: number;
  onComplete?: (isComplete: boolean) => void;
}

const COLORS = ["#06b6d4", "#a855f7", "#10b981", "#f59e0b", "#ef4444"];

export default function Mission4Dataviz({ missionId, onComplete }: Mission4DatavizProps) {
  // États pour la partie 1 (choisir le bon graphique)
  const [part1Answers, setPart1Answers] = useState<Record<string, string>>({});
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  
  // États pour la partie 2 (voir les graphiques)
  const [showPart2, setShowPart2] = useState(false);
  
  // États pour la partie 3 (piège)
  const [showPart3, setShowPart3] = useState(false);
  const [trapAnswer, setTrapAnswer] = useState<string | null>(null);

  const scenarios = mission4Data.scenarios as Scenario[];
  const trap = mission4Data.trap;

  // Déterminer l'étape actuelle (1, 2 ou 3)
  const currentStep = useMemo(() => {
    if (showPart3) return 3;
    if (showPart2) return 2;
    return 1;
  }, [showPart2, showPart3]);

  // Vérifier si la partie 1 est complète (3 réponses)
  const part1Complete = useMemo(() => {
    return scenarios.every(scenario => part1Answers[scenario.id]);
  }, [part1Answers, scenarios]);

  // Calculer le score de la partie 1
  const part1Score = useMemo(() => {
    let correct = 0;
    scenarios.forEach(scenario => {
      if (part1Answers[scenario.id] === scenario.correct) {
        correct++;
      }
    });
    return correct;
  }, [part1Answers, scenarios]);

  // Condition de réussite : 3/3 correct dans partie 1 ET bonne réponse au piège
  const isComplete = useMemo(() => {
    return part1Score === scenarios.length && trapAnswer === "L'axe Y est coupé";
  }, [part1Score, scenarios.length, trapAnswer]);

  // Gérer la réponse d'un scénario (partie 1)
  const handleScenarioAnswer = (scenarioId: string, answer: string) => {
    if (part1Answers[scenarioId]) return; // Déjà répondu, verrouillé
    setPart1Answers(prev => ({ ...prev, [scenarioId]: answer }));
  };

  // Passer au scénario suivant (partie 1)
  const handleNextScenario = () => {
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
    } else {
      // Tous les scénarios sont faits, passer à la partie 2
      setShowPart2(true);
    }
  };

  // Passer à la partie 3
  const handleGoToPart3 = () => {
    setShowPart3(true);
  };

  // Gérer la réponse du piège (partie 3)
  const handleTrapAnswer = (answer: string) => {
    setTrapAnswer(answer);
  };

  // Réinitialiser
  const handleReset = () => {
    setPart1Answers({});
    setCurrentScenarioIndex(0);
    setShowPart2(false);
    setShowPart3(false);
    setTrapAnswer(null);
    if (onComplete) onComplete(false);
  };

  // Notifier le parent de la complétion
  useEffect(() => {
    if (isComplete) {
      if (onComplete) onComplete(true);
      completeMission(missionId);
    } else {
      if (onComplete) onComplete(false);
    }
  }, [isComplete, missionId, onComplete]);

  const currentScenario = scenarios[currentScenarioIndex];
  const currentAnswer = currentScenario ? part1Answers[currentScenario.id] : null;
  const isCurrentCorrect = currentScenario && currentAnswer === currentScenario.correct;

  // Préparer les données pour les graphiques
  const prepareChartData = (data: Array<{ label?: string; day?: string; value: number }>) => {
    return data.map((item, idx) => ({
      name: item.label || item.day || `Item ${idx + 1}`,
      value: item.value,
      fill: COLORS[idx % COLORS.length],
    }));
  };

  // Rendre le graphique selon le type
  const renderChart = (type: string, data: Array<{ label?: string; day?: string; value: number }>) => {
    const chartData = prepareChartData(data);

    switch (type) {
      case "Courbe":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" stroke="#a3a3a3" />
              <YAxis stroke="#a3a3a3" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #1f1f1f",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={{ fill: "#06b6d4" }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case "Barres":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#a3a3a3" />
              <YAxis stroke="#a3a3a3" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #1f1f1f",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      case "Camembert":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #1f1f1f",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  // Phrases pédagogiques pour chaque type de graphique
  const getPedagogicalPhrase = (type: string): string => {
    switch (type) {
      case "Courbe":
        return "La courbe montre facilement si ça monte ou ça descend.";
      case "Barres":
        return "Les barres sont idéales pour comparer des valeurs.";
      case "Camembert":
        return "Le camembert montre une répartition simple.";
      default:
        return "";
    }
  };

  // Obtenir le contexte textuel pour chaque scénario (format exact selon spécifications)
  const getScenarioContext = (scenario: Scenario): string => {
    if (scenario.title.includes("Temps d'écran") || scenario.title.includes("écran")) {
      return "Voici le temps d'écran d'un élève sur 7 jours.";
    }
    if (scenario.title.includes("Répartition") || scenario.title.includes("applis")) {
      return "Voici la répartition des applications utilisées par un élève.";
    }
    if (scenario.title.includes("Comparer") || scenario.title.includes("classes")) {
      return "Voici les moyennes de deux classes.";
    }
    return "Voici les données à visualiser.";
  };

  // Générer le feedback adapté selon le scénario et la réponse (format exact selon spécifications)
  const getFeedbackMessage = (scenario: Scenario, isCorrect: boolean): string => {
    if (isCorrect) {
      // Feedback positif avec formatage exact
      switch (scenario.correct) {
        case "Courbe":
          return "✅ Bien vu !\nIci, on veut voir une évolution dans le temps.\nUne courbe est parfaite pour ça.";
        case "Barres":
          return "✅ Bien vu !\nIci, on veut comparer des valeurs.\nLes barres sont parfaites pour ça.";
        case "Camembert":
          return "✅ Bien vu !\nIci, on veut voir une répartition simple.\nUn camembert est parfait pour ça.";
        default:
          return `✅ Bien vu !\n${scenario.why}`;
      }
    } else {
      // Feedback négatif avec formatage exact
      switch (scenario.correct) {
        case "Courbe":
          return "❌ Pas tout à fait.\nIci, on cherche une évolution dans le temps.\nLe meilleur choix était : Courbe.";
        case "Barres":
          return "❌ Pas tout à fait.\nIci, on cherche à comparer des valeurs.\nLe meilleur choix était : Barres.";
        case "Camembert":
          return "❌ Pas tout à fait.\nIci, on cherche à voir une répartition simple.\nLe meilleur choix était : Camembert.";
        default:
          return `❌ Pas tout à fait.\n${scenario.why}\nLe meilleur choix était : ${scenario.correct}.`;
      }
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 sm:px-6">
      {/* ============================================ */}
      {/* HEADER GÉNÉRAL */}
      {/* ============================================ */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Parle en graphiques
        </h2>
        <p className="text-lg md:text-xl text-foreground-muted mb-4">
          Un bon graphique, c&apos;est celui qui fait comprendre en 5 secondes.
        </p>
        
        {/* Indicateur de progression */}
        <Badge variant="cyan" className="text-base px-4 py-2">
          Étape {currentStep} sur 3
        </Badge>
      </div>

      {/* ============================================ */}
      {/* PARTIE 1 — CHOISIR LE BON GRAPHIQUE */}
      {/* ============================================ */}
      {!showPart2 && !showPart3 && currentScenario && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScenario.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 md:p-8">
              <div className="mb-6">
                <Badge variant="violet" className="mb-3">
                  Scénario {currentScenarioIndex + 1}/{scenarios.length}
                </Badge>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                  {currentScenario.title}
                </h3>
              </div>

              {/* A) CONTEXTE */}
              <div className="mb-6">
                <p className="text-foreground-muted text-base md:text-lg leading-relaxed">
                  {getScenarioContext(currentScenario)}
                </p>
              </div>

              {/* B) DONNÉES BRUTES (mini tableau) */}
              <div className="mb-6 p-4 bg-background-secondary rounded-lg border border-border">
                <h4 className="text-sm font-semibold text-foreground-muted mb-3 uppercase tracking-wide">
                  Données :
                </h4>
                <div className="space-y-2">
                  {currentScenario.data.map((item: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-3 bg-background-tertiary rounded border border-border/50"
                    >
                      <span className="text-foreground-muted font-medium">
                        {item.label || item.day}
                      </span>
                      <span className="text-foreground font-bold text-lg">
                        {item.value}
                        {currentScenario.title.includes("temps") || currentScenario.title.includes("écran") 
                          ? "h" 
                          : currentScenario.title.includes("moyenne") 
                          ? "/20" 
                          : "%"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* C) QUESTION CENTRALE */}
              <div className="mb-6">
                <p className="text-lg md:text-xl font-bold text-foreground">
                  Quel graphique est le <span className="text-accent-cyan">PLUS adapté</span> pour comprendre ces données ?
                </p>
              </div>

              {/* D) 3 BOUTONS DE RÉPONSE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {currentScenario.options.map((option) => {
                  const isSelected = currentAnswer === option;
                  const isCorrect = option === currentScenario.correct;
                  const showResult = currentAnswer !== null;
                  const isDisabled = currentAnswer !== null;

                  return (
                    <motion.button
                      key={option}
                      onClick={() => handleScenarioAnswer(currentScenario.id, option)}
                      disabled={isDisabled}
                      whileHover={!isDisabled ? { scale: 1.05 } : {}}
                      whileTap={!isDisabled ? { scale: 0.95 } : {}}
                      role="button"
                      aria-pressed={isSelected}
                      type="button"
                      className={`p-6 rounded-lg border-2 transition-all text-center ${
                        showResult && isCorrect
                          ? "border-green-500 bg-green-500/20"
                          : showResult && isSelected && !isCorrect
                          ? "border-red-500 bg-red-500/20"
                          : isSelected
                          ? "border-accent-cyan bg-accent-cyan/20"
                          : "border-border bg-background-secondary hover:border-accent-violet/50 hover:bg-background-tertiary"
                      } ${isDisabled ? "cursor-not-allowed opacity-75" : "cursor-pointer"}`}
                      style={{ pointerEvents: isDisabled ? 'none' : 'auto' }}
                    >
                      <div className="flex flex-col items-center gap-3">
                        {option === "Courbe" && <TrendingUp size={32} className="text-foreground-muted" />}
                        {option === "Barres" && <BarChart3 size={32} className="text-foreground-muted" />}
                        {option === "Camembert" && <PieChartIcon size={32} className="text-foreground-muted" />}
                        <span className="font-semibold text-foreground text-lg">{option}</span>
                        {showResult && (
                          isCorrect ? (
                            <CheckCircle className="text-green-500" size={24} />
                          ) : isSelected ? (
                            <XCircle className="text-red-500" size={24} />
                          ) : null
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* E) FEEDBACK IMMÉDIAT (format exact selon spécifications) */}
              {currentAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 rounded-lg mb-6 ${
                    isCurrentCorrect
                      ? "bg-green-500/20 border-2 border-green-500/50"
                      : "bg-red-500/20 border-2 border-red-500/50"
                  }`}
                >
                  <p className="text-foreground font-medium text-base md:text-lg leading-relaxed whitespace-pre-line">
                    {getFeedbackMessage(currentScenario, isCurrentCorrect)}
                  </p>
                </motion.div>
              )}

              {/* F) BOUTON SUIVANT */}
              {currentAnswer && (
                <div className="flex justify-end">
                  <Button
                    onClick={handleNextScenario}
                    variant="primary"
                    size="lg"
                  >
                    {currentScenarioIndex < scenarios.length - 1 ? (
                      <>
                        Scénario suivant <ArrowRight size={20} className="ml-2" />
                      </>
                    ) : (
                      <>
                        Voir les graphiques <ArrowRight size={20} className="ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {/* ============================================ */}
      {/* PARTIE 2 — VOIR LE BON GRAPHIQUE */}
      {/* ============================================ */}
      {showPart2 && !showPart3 && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-accent-cyan/20 to-accent-violet/20 border-accent-cyan/30 p-6 md:p-8">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
                Voici les graphiques adaptés
              </h3>
              
              <div className="space-y-8">
                {scenarios.map((scenario, idx) => (
                  <motion.div
                    key={scenario.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    className="bg-background-secondary rounded-lg p-6 border border-border"
                  >
                    <h4 className="text-xl font-bold text-foreground mb-4">{scenario.title}</h4>
                    <div className="mb-4">
                      {renderChart(scenario.correct, scenario.data)}
                    </div>
                    <div className="p-4 bg-accent-cyan/10 rounded-lg border border-accent-cyan/30">
                      <p className="text-foreground-muted">
                        <strong className="text-foreground">{scenario.correct} :</strong> {getPedagogicalPhrase(scenario.correct)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-end mt-8">
                <Button onClick={handleGoToPart3} variant="primary" size="lg">
                  Voir le piège <ArrowRight size={20} className="ml-2" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {/* ============================================ */}
      {/* PARTIE 3 — LE PIÈGE : GRAPHIQUE TROMPEUR */}
      {/* ============================================ */}
      {showPart3 && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/30 p-6 md:p-8">
              {/* A) CONTEXTE */}
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-red-500 flex-shrink-0" size={32} />
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                  Attention : ce graphique peut tromper
                </h3>
              </div>

              <p className="text-foreground-muted text-base md:text-lg mb-6 leading-relaxed">
                Ces deux graphiques montrent la <strong className="text-foreground">même information</strong>.
              </p>

              {/* B) 2 GRAPHIQUES CÔTE À CÔTE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Graphique A — TROMPEUR */}
                <div className="p-4 bg-background-secondary rounded-lg border-2 border-red-500/50">
                  <h4 className="text-sm font-semibold text-red-500 mb-3 flex items-center gap-2">
                    <AlertTriangle size={20} />
                    Graphique trompeur
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={trap.badExample.values.map(v => ({ name: v.label, value: v.value }))}>
                      <XAxis dataKey="name" stroke="#a3a3a3" />
                      <YAxis stroke="#a3a3a3" domain={[45, 55]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1a1a",
                          border: "1px solid #1f1f1f",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="value" fill="#ef4444" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-foreground-muted mt-2 text-center">
                    L&apos;axe Y est coupé (45-55)
                  </p>
                </div>

                {/* Graphique B — CORRECT */}
                <div className="p-4 bg-background-secondary rounded-lg border-2 border-green-500/50">
                  <h4 className="text-sm font-semibold text-green-500 mb-3 flex items-center gap-2">
                    <CheckCircle size={20} />
                    Graphique correct
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={trap.badExample.values.map(v => ({ name: v.label, value: v.value }))}>
                      <XAxis dataKey="name" stroke="#a3a3a3" />
                      <YAxis stroke="#a3a3a3" domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1a1a",
                          border: "1px solid #1f1f1f",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-foreground-muted mt-2 text-center">
                    L&apos;axe Y part de 0
                  </p>
                </div>
              </div>

              {/* C) QUESTION */}
              <div className="mb-6">
                <p className="text-lg md:text-xl font-bold text-foreground mb-4">
                  Pourquoi le premier graphique est trompeur ?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    "L'axe Y est coupé",
                    "Les couleurs sont moches",
                    "Il manque un titre"
                  ].map((option) => {
                    const isSelected = trapAnswer === option;
                    const isCorrect = option === "L'axe Y est coupé";
                    const showResult = trapAnswer !== null;

                    return (
                      <motion.button
                        key={option}
                        onClick={() => handleTrapAnswer(option)}
                        disabled={trapAnswer !== null}
                        whileHover={trapAnswer === null ? { scale: 1.05 } : {}}
                        whileTap={trapAnswer === null ? { scale: 0.95 } : {}}
                        className={`p-4 rounded-lg border-2 transition-all text-center ${
                          showResult && isCorrect
                            ? "border-green-500 bg-green-500/20"
                            : showResult && isSelected && !isCorrect
                            ? "border-red-500 bg-red-500/20"
                            : isSelected
                            ? "border-accent-cyan bg-accent-cyan/20"
                            : "border-border bg-background-secondary hover:border-accent-violet/50"
                        } ${trapAnswer !== null ? "cursor-not-allowed opacity-75" : "cursor-pointer"}`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <span className="font-semibold text-foreground">{option}</span>
                          {showResult && (
                            isCorrect ? (
                              <CheckCircle className="text-green-500" size={24} />
                            ) : isSelected ? (
                              <XCircle className="text-red-500" size={24} />
                            ) : null
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* D) FEEDBACK (format exact selon spécifications) */}
              {trapAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 rounded-lg mb-4 ${
                    trapAnswer === "L'axe Y est coupé"
                      ? "bg-green-500/20 border-2 border-green-500/50"
                      : "bg-red-500/20 border-2 border-red-500/50"
                  }`}
                >
                  <p className="text-foreground font-medium text-base md:text-lg leading-relaxed whitespace-pre-line">
                    {trapAnswer === "L'axe Y est coupé" ? (
                      "✅ Exact !\nCouper l'axe exagère une petite différence."
                    ) : (
                      "❌ Regarde l'axe vertical.\nIl ne part pas de 0, ça change la perception."
                    )}
                  </p>
                  {trapAnswer === "L'axe Y est coupé" && (
                    <p className="text-foreground-muted text-sm mt-3">{trap.fixTip}</p>
                  )}
                </motion.div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {/* ============================================ */}
      {/* MISSION RÉUSSIE */}
      {/* ============================================ */}
      {isComplete && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-accent-cyan/20 border-accent-cyan/50 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <CheckCircle className="text-accent-cyan flex-shrink-0 mt-1" size={40} />
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                    🎉 Mission réussie !
                  </h3>
                  <p className="text-foreground-muted text-lg md:text-xl leading-relaxed whitespace-pre-line">
                    Tu sais maintenant choisir le bon graphique et repérer les pièges.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {/* ============================================ */}
      {/* ENCART FINAL — CE QUE TU VIENS DE FAIRE EN BUT SD */}
      {/* ============================================ */}
      {isComplete && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-accent-cyan/20 to-accent-violet/20 border-accent-cyan/30 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <CheckCircle className="text-accent-cyan flex-shrink-0 mt-1" size={32} />
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                    Ce que tu viens de faire en BUT Science des Données
                  </h3>
                  <p className="text-foreground-muted text-base md:text-lg mb-4 leading-relaxed whitespace-pre-line">
                    En BUT SD, tu apprends à transformer des chiffres{'\n'}en graphiques clairs pour aider à prendre des décisions.
                  </p>
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-foreground-muted mb-2 uppercase tracking-wide">
                      Métiers liés :
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Data analyst", "Consultant data", "Chargé d'études"].map((metier, idx) => (
                        <Badge key={idx} variant="cyan" className="text-sm">
                          {metier}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {/* ============================================ */}
      {/* MINI MÉMO */}
      {/* ============================================ */}
      {isComplete && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-background-secondary border-border p-6 md:p-8">
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-3">
                📝 Règle simple :
              </h3>
              <div className="space-y-2 text-foreground-muted">
                <p className="flex items-center gap-2">
                  <TrendingUp size={20} className="text-accent-cyan" />
                  <strong className="text-foreground">Courbe</strong> = évolution
                </p>
                <p className="flex items-center gap-2">
                  <BarChart3 size={20} className="text-accent-violet" />
                  <strong className="text-foreground">Barres</strong> = comparaison
                </p>
                <p className="flex items-center gap-2">
                  <PieChartIcon size={20} className="text-accent-cyan" />
                  <strong className="text-foreground">Camembert</strong> = répartition simple
                </p>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {/* ============================================ */}
      {/* BOUTON REJOUER */}
      {/* ============================================ */}
      {(part1Complete || showPart2 || showPart3) && (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={handleReset} size="lg">
            <RotateCcw size={20} className="mr-2" />
            Rejouer la mission
          </Button>
        </div>
      )}
    </div>
  );
}
