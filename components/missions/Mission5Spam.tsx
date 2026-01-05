"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { CheckCircle, XCircle, RotateCcw, Brain, TestTube, Sparkles, AlertCircle, HelpCircle } from "lucide-react";
import mission5Data from "@/data/mission5.json";
import { completeMission } from "@/lib/progress";

interface Message {
  text: string;
  label: "spam" | "ham";
}

interface Mission5SpamProps {
  missionId: number;
  onComplete?: (isComplete: boolean) => void;
}

type Step = "label" | "train" | "test";

export default function Mission5Spam({ missionId, onComplete }: Mission5SpamProps) {
  const [step, setStep] = useState<Step>("label");
  const [userLabels, setUserLabels] = useState<Record<number, "spam" | "ham">>({});
  const [trained, setTrained] = useState(false);
  const [tested, setTested] = useState(false);
  const [testResults, setTestResults] = useState<Array<{
    text: string;
    predicted: "spam" | "ham";
    actual: "spam" | "ham";
    correct: boolean;
  }>>([]);
  const [accuracy, setAccuracy] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizPassed, setQuizPassed] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [customPrediction, setCustomPrediction] = useState<"spam" | "ham" | null>(null);
  const [detectedKeywords, setDetectedKeywords] = useState<string[]>([]);

  const trainData = mission5Data.train as Message[];
  const testData = mission5Data.test as Message[];
  const spamKeywords = mission5Data.simpleRules?.spamKeywords || [];

  // Vérifier si tous les messages sont étiquetés
  const allLabeled = useMemo(() => {
    return trainData.every((_, idx) => userLabels[idx] !== undefined);
  }, [userLabels, trainData]);

  // Fonction de prédiction simple basée sur les mots-clés
  const predict = (text: string): { prediction: "spam" | "ham"; keywords: string[] } => {
    const lowerText = text.toLowerCase();
    const foundKeywords = spamKeywords.filter(keyword => 
      lowerText.includes(keyword.toLowerCase())
    );
    
    return {
      prediction: foundKeywords.length > 0 ? "spam" : "ham",
      keywords: foundKeywords,
    };
  };

  // Entraîner le modèle
  const handleTrain = () => {
    setTrained(true);
    setStep("test");
  };

  // Tester le modèle
  const handleTest = () => {
    const results = testData.map((item) => {
      const { prediction } = predict(item.text);
      return {
        text: item.text,
        predicted: prediction,
        actual: item.label,
        correct: prediction === item.label,
      };
    });

    setTestResults(results);
    const correctCount = results.filter(r => r.correct).length;
    const acc = Math.round((correctCount / results.length) * 100);
    setAccuracy(acc);
    setTested(true);
  };

  // Tester un message personnalisé
  const handleTestCustom = () => {
    if (!customMessage.trim()) return;
    const { prediction, keywords } = predict(customMessage);
    setCustomPrediction(prediction);
    setDetectedKeywords(keywords);
  };

  // Gérer le quiz
  const handleQuizAnswer = (answer: string) => {
    setQuizAnswer(answer);
    if (answer === "A") {
      setQuizPassed(true);
    }
  };

  // Condition de réussite
  const isComplete = useMemo(() => {
    return trained && tested && accuracy >= 60 && quizPassed;
  }, [trained, tested, accuracy, quizPassed]);

  // Réinitialiser
  const handleReset = () => {
    setStep("label");
    setUserLabels({});
    setTrained(false);
    setTested(false);
    setTestResults([]);
    setAccuracy(0);
    setQuizAnswer(null);
    setQuizPassed(false);
    setCustomMessage("");
    setCustomPrediction(null);
    setDetectedKeywords([]);
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Mini IA anti-spam</h2>
        <p className="text-lg text-foreground-muted">
          Tu vas donner des exemples, puis on teste si le modèle s&apos;en sort.
        </p>
      </div>

      {/* Indicateur d'étapes */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className={`flex items-center gap-2 ${step === "label" ? "text-accent-cyan" : step === "train" || step === "test" ? "text-accent-violet" : "text-foreground-muted"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "label" ? "bg-accent-cyan text-background" : step === "train" || step === "test" ? "bg-accent-violet text-background" : "bg-background-tertiary"}`}>
            1
          </div>
          <span className="font-medium">Étiqueter</span>
        </div>
        <div className="w-12 h-0.5 bg-border" />
        <div className={`flex items-center gap-2 ${step === "train" ? "text-accent-cyan" : step === "test" ? "text-accent-violet" : "text-foreground-muted"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "train" ? "bg-accent-cyan text-background" : step === "test" ? "bg-accent-violet text-background" : "bg-background-tertiary"}`}>
            2
          </div>
          <span className="font-medium">Entraîner</span>
        </div>
        <div className="w-12 h-0.5 bg-border" />
        <div className={`flex items-center gap-2 ${step === "test" ? "text-accent-cyan" : "text-foreground-muted"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "test" ? "bg-accent-cyan text-background" : "bg-background-tertiary"}`}>
            3
          </div>
          <span className="font-medium">Tester</span>
        </div>
      </div>

      {/* ÉTAPE A : Étiquetage */}
      {step === "label" && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-foreground">Je classe des exemples</h3>
                <Badge variant="cyan">
                  {Object.keys(userLabels).length}/{trainData.length} classés
                </Badge>
              </div>

              {/* Aide */}
              <div className="mb-6 p-4 bg-accent-violet/10 border border-accent-violet/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <HelpCircle className="text-accent-violet flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-foreground-muted">
                      <strong>Spam</strong> = messages qui poussent à cliquer / gagner / offre trop belle.
                    </p>
                  </div>
                </div>
              </div>

              {/* Liste des messages */}
              <div className="space-y-4 mb-6">
                {trainData.map((message, idx) => {
                  const userLabel = userLabels[idx];
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 bg-background-secondary rounded-lg border border-border"
                    >
                      <p className="text-foreground mb-4">{message.text}</p>
                      <div className="flex gap-3">
                        <motion.button
                          onClick={() => setUserLabels(prev => ({ ...prev, [idx]: "spam" }))}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          role="button"
                          aria-pressed={userLabel === "spam"}
                          className={`px-6 py-2 rounded-lg font-medium transition-all ${
                            userLabel === "spam"
                              ? "bg-red-500 text-background border-2 border-red-500"
                              : "bg-background-tertiary text-foreground border-2 border-border hover:border-red-500/50"
                          }`}
                        >
                          SPAM
                        </motion.button>
                        <motion.button
                          onClick={() => setUserLabels(prev => ({ ...prev, [idx]: "ham" }))}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          role="button"
                          aria-pressed={userLabel === "ham"}
                          className={`px-6 py-2 rounded-lg font-medium transition-all ${
                            userLabel === "ham"
                              ? "bg-green-500 text-background border-2 border-green-500"
                              : "bg-background-tertiary text-foreground border-2 border-border hover:border-green-500/50"
                          }`}
                        >
                          OK
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bouton suivant */}
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    setStep("train");
                  }}
                  variant="primary"
                  disabled={!allLabeled}
                >
                  Entraîner le modèle →
                </Button>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {/* ÉTAPE B : Entraîner */}
      {step === "train" && !trained && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-accent-cyan/20 to-accent-violet/20 border-accent-cyan/30">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="text-accent-cyan" size={32} />
                <h3 className="text-2xl font-bold text-foreground">J&apos;entraîne</h3>
              </div>

              <p className="text-foreground-muted mb-6">
                Clique sur le bouton pour entraîner le modèle avec les mots-clés.
              </p>

              <div className="flex justify-center mb-6">
                <Button onClick={handleTrain} variant="primary" size="lg">
                  <Brain size={20} className="mr-2" />
                  Entraîner
                </Button>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Ce que le modèle a appris */}
      {trained && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-background-secondary">
            <h3 className="text-xl font-bold text-foreground mb-4">Ce que le modèle a appris</h3>
            <p className="text-foreground-muted mb-4">
              Ici, on fait simple : si le message contient certains mots, on le considère comme spam.
            </p>
            <div className="flex flex-wrap gap-2">
              {spamKeywords.map((keyword, idx) => (
                <Badge key={idx} variant="default" className="text-sm">
                  {keyword}
                </Badge>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* ÉTAPE C : Test */}
      {step === "test" && trained && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <TestTube className="text-accent-cyan" size={32} />
                <h3 className="text-2xl font-bold text-foreground">Je teste</h3>
              </div>

              {!tested ? (
                <>
                  <p className="text-foreground-muted mb-6">
                    Teste le modèle sur de nouveaux messages qu&apos;il n&apos;a jamais vus.
                  </p>
                  <div className="flex justify-center">
                    <Button onClick={handleTest} variant="primary" size="lg">
                      <TestTube size={20} className="mr-2" />
                      Tester
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* KPI Précision */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <Card className="bg-gradient-to-br from-accent-cyan/20 to-accent-violet/20 border-accent-cyan/30">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-foreground mb-2">{accuracy}%</div>
                        <div className="text-foreground-muted">Précision</div>
                      </div>
                    </Card>
                    <Card className="bg-background-secondary">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-foreground mb-2">
                          {testResults.filter(r => r.correct).length}/{testResults.length}
                        </div>
                        <div className="text-foreground-muted">Correct</div>
                      </div>
                    </Card>
                  </div>

                  {/* Explication précision */}
                  <div className="mb-6 p-4 bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg">
                    <p className="text-sm text-foreground-muted">
                      <strong>La précision</strong> = nombre de bonnes réponses / nombre total de tests.
                    </p>
                  </div>

                  {/* Résultats */}
                  <div className="space-y-3 mb-6">
                    <h4 className="text-lg font-bold text-foreground">Résultats du test :</h4>
                    {testResults.map((result, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 bg-background-secondary rounded-lg border border-border"
                      >
                        <p className="text-foreground mb-3">{result.text}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge variant={result.predicted === "spam" ? "default" : "cyan"}>
                            Prédit: {result.predicted === "spam" ? "SPAM" : "OK"}
                          </Badge>
                          <Badge variant={result.actual === "spam" ? "default" : "cyan"}>
                            Réel: {result.actual === "spam" ? "SPAM" : "OK"}
                          </Badge>
                          {result.correct ? (
                            <CheckCircle className="text-green-500" size={20} />
                          ) : (
                            <XCircle className="text-red-500" size={20} />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Mini Quiz */}
                  {!quizPassed && (
                    <Card className="bg-background-secondary mb-6">
                      <h4 className="text-lg font-bold text-foreground mb-4">
                        Quiz de compréhension
                      </h4>
                      <p className="text-foreground-muted mb-4">
                        Pourquoi on teste le modèle sur de nouveaux messages ?
                      </p>
                      <div className="space-y-3">
                        {[
                          { value: "A", label: "Pour vérifier s'il marche sur des exemples qu'il n'a jamais vus" },
                          { value: "B", label: "Parce que ça rend le texte plus joli" },
                          { value: "C", label: "Pour faire plus de calculs" },
                        ].map((option) => {
                          const isSelected = quizAnswer === option.value;
                          const isCorrect = option.value === "A";
                          const showResult = quizAnswer !== null;

                          return (
                            <motion.button
                              key={option.value}
                              onClick={() => handleQuizAnswer(option.value)}
                              disabled={quizAnswer !== null}
                              whileHover={quizAnswer === null ? { scale: 1.02 } : {}}
                              whileTap={quizAnswer === null ? { scale: 0.98 } : {}}
                              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                                showResult && isCorrect
                                  ? "border-green-500 bg-green-500/20"
                                  : showResult && isSelected && !isCorrect
                                  ? "border-red-500 bg-red-500/20"
                                  : isSelected
                                  ? "border-accent-cyan bg-accent-cyan/20"
                                  : "border-border bg-background-tertiary hover:border-accent-violet/50"
                              } ${quizAnswer !== null ? "cursor-not-allowed opacity-75" : "cursor-pointer"}`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-foreground">{option.label}</span>
                                {showResult && (
                                  isCorrect ? (
                                    <CheckCircle className="text-green-500" size={20} />
                                  ) : isSelected ? (
                                    <XCircle className="text-red-500" size={20} />
                                  ) : null
                                )}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </Card>
                  )}

                  {/* Tester avec un message perso */}
                  <Card className="bg-background-secondary mb-6">
                    <h4 className="text-lg font-bold text-foreground mb-4">
                      Tester avec un message perso
                    </h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="Tape ton message..."
                        className="w-full bg-background-tertiary border border-border rounded-lg px-4 py-3 text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent-cyan"
                      />
                      <Button onClick={handleTestCustom} variant="outline" disabled={!customMessage.trim()}>
                        Tester
                      </Button>
                      {customPrediction && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-background-tertiary rounded-lg"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-foreground font-medium">Prédiction :</span>
                            <Badge variant={customPrediction === "spam" ? "default" : "cyan"}>
                              {customPrediction === "spam" ? "SPAM" : "OK"}
                            </Badge>
                          </div>
                          {detectedKeywords.length > 0 && (
                            <div className="mt-2">
                              <span className="text-sm text-foreground-muted">Mots détectés : </span>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {detectedKeywords.map((keyword, idx) => (
                                  <Badge key={idx} variant="default" className="text-xs">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </Card>

                  {/* Limites */}
                  <Card className="bg-accent-violet/10 border-accent-violet/30">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-accent-violet flex-shrink-0 mt-1" size={20} />
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Limites</h4>
                        <p className="text-sm text-foreground-muted">
                          Un vrai modèle apprend plus finement que des mots-clés. Ici c&apos;est une version simplifiée pour comprendre.
                        </p>
                      </div>
                    </div>
                  </Card>
                </>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Mission réussie */}
      {isComplete && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-accent-cyan/20 border-accent-cyan/50">
              <div className="flex items-start gap-4">
                <CheckCircle className="text-accent-cyan flex-shrink-0 mt-1" size={32} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="text-accent-cyan" size={24} />
                    <h3 className="text-2xl font-bold text-foreground">Mission réussie ✅</h3>
                  </div>
                  <p className="text-foreground-muted text-lg">
                    Tu as entraîné une mini IA et tu as mesuré sa précision. C&apos;est exactement l&apos;idée de base de la classification en data.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Ce que tu viens de faire */}
      <Card className="bg-background-secondary">
        <h3 className="text-lg font-bold text-foreground mb-2">Ce que tu viens de faire</h3>
        <p className="text-foreground-muted">
          Tu viens d&apos;entraîner un modèle simple de classification et de mesurer sa précision. C&apos;est la base de l&apos;apprentissage automatique.
        </p>
      </Card>

      {/* Bouton Réinitialiser */}
      {(step !== "label" || Object.keys(userLabels).length > 0) && (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={handleReset}>
            <RotateCcw size={16} className="mr-2" />
            Réinitialiser
          </Button>
        </div>
      )}
    </div>
  );
}


