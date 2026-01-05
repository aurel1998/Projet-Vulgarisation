"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { Trophy, TrendingUp, TrendingDown, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import mission2Data from "@/data/mission2.json";
import { completeMission } from "@/lib/progress";

interface TeamStats {
  name: string;
  shots: number;
  possession: number;
  fouls: number;
}

interface Mission2MatchPredictProps {
  missionId: number;
  onComplete?: (isComplete: boolean) => void;
}

export default function Mission2MatchPredict({ missionId, onComplete }: Mission2MatchPredictProps) {
  const [teamA, setTeamA] = useState<TeamStats>(mission2Data.teams[0]);
  const [teamB, setTeamB] = useState<TeamStats>(mission2Data.teams[1]);
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [showQuizFeedback, setShowQuizFeedback] = useState(false);

  const weights = mission2Data.weights;

  // Calculer les scores
  const scores = useMemo(() => {
    const scoreA = teamA.shots * weights.shots + teamA.possession * weights.possession + teamA.fouls * weights.fouls;
    const scoreB = teamB.shots * weights.shots + teamB.possession * weights.possession + teamB.fouls * weights.fouls;
    return { scoreA, scoreB };
  }, [teamA, teamB, weights]);

  // Calculer les probabilités
  const probabilities = useMemo(() => {
    const diff = scores.scoreA - scores.scoreB;
    const probaA = 1 / (1 + Math.exp(-diff / 10));
    const probaB = 1 - probaA;
    return {
      probaA: Math.round(probaA * 100),
      probaB: Math.round(probaB * 100),
    };
  }, [scores]);

  // Déterminer le facteur le plus influent
  const mostInfluentialFactor = useMemo(() => {
    const absWeights = {
      shots: Math.abs(weights.shots),
      possession: Math.abs(weights.possession),
      fouls: Math.abs(weights.fouls),
    };
    
    if (absWeights.shots >= absWeights.possession && absWeights.shots >= absWeights.fouls) {
      return "Les tirs";
    } else if (absWeights.possession >= absWeights.fouls) {
      return "La possession";
    } else {
      return "Les fautes";
    }
  }, [weights]);

  // Données pour le graphique
  const chartData = [
    { name: teamA.name, score: scores.scoreA, proba: probabilities.probaA },
    { name: teamB.name, score: scores.scoreB, proba: probabilities.probaB },
  ];

  // Avantage
  const advantage = scores.scoreA > scores.scoreB ? teamA.name : scores.scoreB > scores.scoreA ? teamB.name : "Égalité";

  // Réinitialiser
  const handleReset = () => {
    setTeamA(mission2Data.teams[0]);
    setTeamB(mission2Data.teams[1]);
    setQuizPassed(false);
    setQuizAnswer(null);
    setShowQuizFeedback(false);
    if (onComplete) onComplete(false);
  };

  // Gérer le quiz
  const handleQuizAnswer = (answer: string) => {
    setQuizAnswer(answer);
    setShowQuizFeedback(true);
    
    const isCorrect = answer === mostInfluentialFactor;
    if (isCorrect) {
      setQuizPassed(true);
      if (onComplete) onComplete(true);
      completeMission(missionId);
    }
  };

  // Notifier le parent du changement de statut
  useEffect(() => {
    if (onComplete) {
      onComplete(quizPassed);
    }
  }, [quizPassed, onComplete]);

  return (
    <div className="space-y-8">
      {/* Titre et sous-texte */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Qui va gagner le match ?</h2>
        <p className="text-lg text-foreground-muted">
          Bouge les stats et regarde comment ça change la prédiction.
        </p>
      </div>

      {/* Contrôles et Résultats - 2 colonnes */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Colonne A: Contrôles (Sliders) */}
        <Card>
          <h3 className="text-xl font-bold text-foreground mb-6">Contrôles</h3>
          
          {/* Équipe A */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-foreground mb-4">{teamA.name}</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-2">
                  Tirs: <span className="text-foreground font-bold">{teamA.shots}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={teamA.shots}
                  onChange={(e) => setTeamA({ ...teamA, shots: parseInt(e.target.value) })}
                  className="w-full h-2 bg-background-tertiary rounded-lg appearance-none cursor-pointer accent-accent-cyan"
                  aria-label={`Tirs ${teamA.name}`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-2">
                  Possession: <span className="text-foreground font-bold">{teamA.possession}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={teamA.possession}
                  onChange={(e) => setTeamA({ ...teamA, possession: parseInt(e.target.value) })}
                  className="w-full h-2 bg-background-tertiary rounded-lg appearance-none cursor-pointer accent-accent-cyan"
                  aria-label={`Possession ${teamA.name}`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-2">
                  Fautes: <span className="text-foreground font-bold">{teamA.fouls}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={teamA.fouls}
                  onChange={(e) => setTeamA({ ...teamA, fouls: parseInt(e.target.value) })}
                  className="w-full h-2 bg-background-tertiary rounded-lg appearance-none cursor-pointer accent-accent-cyan"
                  aria-label={`Fautes ${teamA.name}`}
                />
              </div>
            </div>
          </div>

          {/* Équipe B */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">{teamB.name}</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-2">
                  Tirs: <span className="text-foreground font-bold">{teamB.shots}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={teamB.shots}
                  onChange={(e) => setTeamB({ ...teamB, shots: parseInt(e.target.value) })}
                  className="w-full h-2 bg-background-tertiary rounded-lg appearance-none cursor-pointer accent-accent-violet"
                  aria-label={`Tirs ${teamB.name}`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-2">
                  Possession: <span className="text-foreground font-bold">{teamB.possession}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={teamB.possession}
                  onChange={(e) => setTeamB({ ...teamB, possession: parseInt(e.target.value) })}
                  className="w-full h-2 bg-background-tertiary rounded-lg appearance-none cursor-pointer accent-accent-violet"
                  aria-label={`Possession ${teamB.name}`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-2">
                  Fautes: <span className="text-foreground font-bold">{teamB.fouls}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={teamB.fouls}
                  onChange={(e) => setTeamB({ ...teamB, fouls: parseInt(e.target.value) })}
                  className="w-full h-2 bg-background-tertiary rounded-lg appearance-none cursor-pointer accent-accent-violet"
                  aria-label={`Fautes ${teamB.name}`}
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button variant="secondary" onClick={handleReset} className="w-full">
              <RotateCcw size={16} className="mr-2" />
              Réinitialiser
            </Button>
          </div>
        </Card>

        {/* Colonne B: Résultats */}
        <Card>
          <h3 className="text-xl font-bold text-foreground mb-6">Résultats</h3>
          
          {/* Scores */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <motion.div
              className="bg-background-secondary rounded-lg p-4 border border-border"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-sm text-foreground-muted mb-1">{teamA.name}</div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {scores.scoreA.toFixed(1)}
              </div>
              <div className="text-sm text-accent-cyan font-medium">
                {probabilities.probaA}% de chances
              </div>
            </motion.div>
            
            <motion.div
              className="bg-background-secondary rounded-lg p-4 border border-border"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-sm text-foreground-muted mb-1">{teamB.name}</div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {scores.scoreB.toFixed(1)}
              </div>
              <div className="text-sm text-accent-violet font-medium">
                {probabilities.probaB}% de chances
              </div>
            </motion.div>
          </div>

          {/* Indicateur d'avantage */}
          <div className="mb-6 p-3 bg-background-tertiary rounded-lg flex items-center gap-2">
            {advantage === teamA.name ? (
              <TrendingUp className="text-accent-cyan" size={20} />
            ) : advantage === teamB.name ? (
              <TrendingDown className="text-accent-violet" size={20} />
            ) : (
              <Trophy className="text-foreground-muted" size={20} />
            )}
            <span className="text-foreground font-medium">
              Avantage: {advantage}
            </span>
          </div>

          {/* Bar Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#a3a3a3" />
                <YAxis stroke="#a3a3a3" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #1f1f1f",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [value.toFixed(1), "Score"]}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? "#06b6d4" : "#a855f7"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Astuce */}
      <Card className="bg-accent-cyan/10 border-accent-cyan/30">
        <h3 className="text-lg font-bold text-foreground mb-3">💡 Astuce</h3>
        <ul className="space-y-1 text-foreground-muted">
          {mission2Data.explain.map((tip, idx) => (
            <li key={idx}>• {tip}</li>
          ))}
        </ul>
      </Card>

      {/* Mini Quiz */}
      <Card>
        <h3 className="text-xl font-bold text-foreground mb-4">
          Quiz de compréhension
        </h3>
        <p className="text-foreground-muted mb-4">
          Quel facteur influence le plus la prédiction ici ?
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {["Les tirs", "La possession", "Les fautes"].map((option) => {
            const isSelected = quizAnswer === option;
            const isCorrect = option === mostInfluentialFactor;
            const showResult = showQuizFeedback && isSelected;
            
            return (
              <motion.button
                key={option}
                onClick={() => !showQuizFeedback && handleQuizAnswer(option)}
                disabled={showQuizFeedback}
                whileHover={!showQuizFeedback ? { scale: 1.05 } : {}}
                whileTap={!showQuizFeedback ? { scale: 0.95 } : {}}
                className={`p-4 rounded-lg border-2 transition-all ${
                  showResult && isCorrect
                    ? "border-green-500 bg-green-500/20"
                    : showResult && !isCorrect
                    ? "border-red-500 bg-red-500/20"
                    : isSelected
                    ? "border-accent-cyan bg-accent-cyan/20"
                    : "border-border bg-background-secondary hover:border-accent-violet/50"
                } ${showQuizFeedback ? "cursor-not-allowed opacity-75" : "cursor-pointer"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{option}</span>
                  {showResult && (
                    isCorrect ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : (
                      <XCircle className="text-red-500" size={20} />
                    )
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {showQuizFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${
              quizPassed
                ? "bg-green-500/20 border border-green-500/50"
                : "bg-red-500/20 border border-red-500/50"
            }`}
          >
            <p className="text-foreground font-medium">
              {quizPassed ? (
                <>✅ Bien vu ! Ici, {mostInfluentialFactor.toLowerCase()} pèse le plus.</>
              ) : (
                <>❌ Pas tout à fait. Regarde les coefficients : ici, {mostInfluentialFactor.toLowerCase()} pèse plus.</>
              )}
            </p>
          </motion.div>
        )}

        {quizPassed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-4 bg-accent-cyan/20 border border-accent-cyan/50 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="text-accent-cyan" size={24} />
              <span className="text-xl font-bold text-foreground">Mission réussie ✅</span>
            </div>
            <p className="text-foreground-muted">
              Tu as compris comment les données influencent une prédiction !
            </p>
          </motion.div>
        )}
      </Card>

      {/* Ce que tu viens de faire */}
      <Card className="bg-background-secondary">
        <h3 className="text-lg font-bold text-foreground mb-2">Ce que tu viens de faire</h3>
        <p className="text-foreground-muted">
          Tu viens d&apos;utiliser des données pour comparer et prédire. C&apos;est une base de l&apos;analyse en BUT SD.
        </p>
      </Card>
    </div>
  );
}


