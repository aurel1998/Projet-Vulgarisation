"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { RotateCcw, CheckCircle, Sparkles, Film } from "lucide-react";
import mission3Data from "@/data/mission3.json";
import { completeMission } from "@/lib/progress";

interface Movie {
  id: string;
  title: string;
  tags: string[];
}

interface Mission3RecoProps {
  missionId: number;
  onComplete?: (isComplete: boolean) => void;
}

export default function Mission3Reco({ missionId, onComplete }: Mission3RecoProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const maxTags = 3;

  // Calculer les recommandations
  const recommendations = useMemo(() => {
    if (selectedTags.length === 0) return [];

    const moviesWithScores = mission3Data.movies.map((movie: Movie) => {
      const commonTags = selectedTags.filter(tag => movie.tags.includes(tag));
      const score = commonTags.length;
      
      return {
        ...movie,
        score,
        commonTags,
      };
    });

    // Trier par score décroissant, puis par titre (stable)
    moviesWithScores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.title.localeCompare(b.title);
    });

    // Prendre le Top 3
    return moviesWithScores.slice(0, 3).filter(m => m.score > 0);
  }, [selectedTags]);

  // Vérifier la condition de réussite
  const isComplete = useMemo(() => {
    return selectedTags.length === maxTags && recommendations.length >= 2 && 
           recommendations.filter(r => r.score >= 2).length >= 2;
  }, [selectedTags.length, recommendations]);

  // Tag dominant dans les matches
  const dominantTag = useMemo(() => {
    if (recommendations.length === 0) return null;
    
    const tagCounts: Record<string, number> = {};
    recommendations.forEach(rec => {
      rec.commonTags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    let maxCount = 0;
    let dominant = null;
    for (const [tag, count] of Object.entries(tagCounts)) {
      if (count > maxCount) {
        maxCount = count;
        dominant = tag;
      }
    }
    return dominant;
  }, [recommendations]);

  // Toggle tag
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else if (selectedTags.length < maxTags) {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  // Réinitialiser
  const handleReset = () => {
    setSelectedTags([]);
    if (onComplete) onComplete(false);
  };

  // Essayer un autre profil (3 tags au hasard)
  const handleRandomProfile = () => {
    const shuffled = [...mission3Data.availableTags].sort(() => Math.random() - 0.5);
    setSelectedTags(shuffled.slice(0, maxTags));
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
      {/* Titre et sous-texte */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Netflix dans ta tête</h2>
        <p className="text-lg text-foreground-muted">
          Choisis {maxTags} goûts et regarde ce que le système te recommande.
        </p>
      </div>

      {/* Zone de sélection */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-foreground">Tes goûts</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground-muted">
              {selectedTags.length}/{maxTags} goûts choisis
            </span>
            <Button variant="secondary" onClick={handleReset} size="sm">
              <RotateCcw size={16} className="mr-2" />
              Réinitialiser
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {mission3Data.availableTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            const isDisabled = !isSelected && selectedTags.length >= maxTags;
            
            return (
              <motion.button
                key={tag}
                onClick={() => toggleTag(tag)}
                disabled={isDisabled}
                whileHover={!isDisabled ? { scale: 1.05 } : {}}
                whileTap={!isDisabled ? { scale: 0.95 } : {}}
                role="button"
                aria-pressed={isSelected}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isSelected
                    ? "bg-accent-cyan text-background border-2 border-accent-cyan"
                    : isDisabled
                    ? "bg-background-tertiary text-foreground-muted border-2 border-border opacity-50 cursor-not-allowed"
                    : "bg-background-secondary text-foreground border-2 border-border hover:border-accent-violet/50"
                }`}
              >
                {tag}
              </motion.button>
            );
          })}
        </div>

        {selectedTags.length < maxTags && (
          <p className="text-sm text-foreground-muted">
            Sélectionne encore {maxTags - selectedTags.length} goût{maxTags - selectedTags.length > 1 ? "s" : ""} pour voir tes recommandations.
          </p>
        )}

        {selectedTags.length === 0 && (
          <div className="mt-4">
            <Button variant="outline" onClick={handleRandomProfile} size="sm">
              Essayer un profil au hasard
            </Button>
          </div>
        )}
      </Card>

      {/* Zone résultats */}
      {selectedTags.length === maxTags && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-accent-cyan/20 via-accent-violet/20 to-background-tertiary border-accent-cyan/30">
              <div className="flex items-center gap-3 mb-6">
                <Film className="text-accent-cyan" size={32} />
                <h3 className="text-2xl font-bold text-foreground">Tes recommandations</h3>
              </div>

              {recommendations.length > 0 ? (
                <>
                  <p className="text-foreground-muted mb-6">
                    Pourquoi ? Parce que ces tags matchent tes goûts.
                  </p>
                  
                  <div className="space-y-4">
                    {recommendations.map((movie, idx) => (
                      <motion.div
                        key={movie.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-background-secondary rounded-lg p-5 border border-border hover:border-accent-cyan/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-xl font-bold text-foreground">{movie.title}</h4>
                              <Badge variant="cyan">
                                Score: {movie.score}/{maxTags}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {movie.commonTags.map((tag) => (
                                <Badge key={tag} variant="default" className="text-xs">
                                  ✓ {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Insight - Tag dominant */}
                  {dominantTag && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-6 p-4 bg-background-tertiary rounded-lg border border-accent-violet/30"
                    >
                      <p className="text-foreground">
                        <strong>Insight :</strong> Ton goût dominant est <strong className="text-accent-violet">{dominantTag}</strong> (présent dans tes meilleures recommandations).
                      </p>
                    </motion.div>
                  )}
                </>
              ) : (
                <p className="text-foreground-muted text-center py-8">
                  Aucun film ne correspond à tes goûts. Essaie d&apos;autres tags !
                </p>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Comment ça marche */}
      <Card className="bg-accent-cyan/10 border-accent-cyan/30">
        <h3 className="text-lg font-bold text-foreground mb-3">💡 Comment ça marche ?</h3>
        <p className="text-foreground-muted">
          {mission3Data.scoring.description || "Plus un film partage de tags avec tes goûts, plus son score monte."}
        </p>
      </Card>

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
                    Tu viens de créer un système de recommandation basé sur la similarité.
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
          Tu viens d&apos;utiliser la similarité pour recommander. C&apos;est une base des systèmes de recommandation (Netflix, Spotify, etc.).
        </p>
      </Card>
    </div>
  );
}

