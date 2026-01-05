"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import mission1Data from "@/data/mission1.json";
import { completeMission } from "@/lib/progress";
import { CheckCircle, AlertCircle } from "lucide-react";
import Mission2MatchPredict from "@/components/missions/Mission2MatchPredict";
import Mission3Reco from "@/components/missions/Mission3Reco";
import Mission4Dataviz from "@/components/missions/Mission4Dataviz";
import Mission5Spam from "@/components/missions/Mission5Spam";

interface DataRow {
  id: number;
  prenom: string;
  age: number | null;
  ville: string;
  sport: string | null;
  erreur: string | null;
  valeurErronee?: number;
  corrige?: boolean;
  isDuplicate?: boolean;
}

interface MissionClientProps {
  missionId: number;
  mission: {
    id: number;
    titre: string;
    sousTitre: string;
    objectif: string;
    ceQueTuApprends: string;
    competencesBUTSD: string[];
  };
}

export default function MissionClient({ missionId, mission }: MissionClientProps) {
  const router = useRouter();
  const [data, setData] = useState<DataRow[]>([]);
  const [quality, setQuality] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Détecter automatiquement les erreurs basées sur les règles
  const detectErrors = (rows: typeof mission1Data.rows): DataRow[] => {
    const rules = mission1Data.rules;
    const [minAge, maxAge] = rules.ageValidRange;

    return rows.map((row, index) => {
      const errors: string[] = [];
      let valeurErronee: number | undefined;
      let isDuplicate = false;

      // Détecter les valeurs manquantes
      if (rules.missingValueFields.includes("age") && (row.age === null || row.age === undefined)) {
        errors.push("age_manquant");
      }
      if (rules.missingValueFields.includes("ville") && (!row.ville || row.ville === "")) {
        errors.push("ville_vide");
      }
      if (rules.missingValueFields.includes("sport") && (!row.sport || row.sport === null)) {
        errors.push("sport_vide");
      }

      // Détecter les âges invalides
      if (row.age !== null && row.age !== undefined && (row.age < minAge || row.age > maxAge)) {
        errors.push("age_invalide");
        valeurErronee = row.age;
      }

      // Détecter les doublons
      const duplicateFields = rules.duplicateKeyFields;
      const isDup = rows.slice(0, index).some(prevRow => {
        return duplicateFields.every(field => {
          if (field === "prenom") return prevRow.prenom === row.prenom;
          if (field === "age") return prevRow.age === row.age;
          if (field === "ville") return prevRow.ville === row.ville;
          if (field === "sport") return prevRow.sport === row.sport;
          return false;
        });
      });

      if (isDup) {
        errors.push("doublon");
        isDuplicate = true;
      }

      return {
        ...row,
        erreur: errors.length > 0 ? errors[0] : null,
        valeurErronee,
        corrige: false,
        isDuplicate,
      };
    });
  };

  useEffect(() => {
    if (missionId === 1) {
      const rowsWithErrors = detectErrors(mission1Data.rows);
      setData(rowsWithErrors);
    }
  }, [missionId]);

  const calculateQuality = () => {
    const total = data.length;
    const errors = data.filter(row => row.erreur && !row.corrige).length;
    const qualityScore = total > 0 ? Math.round(((total - errors) / total) * 100) : 0;
    setQuality(qualityScore);
  };

  useEffect(() => {
    calculateQuality();
  }, [data]);

  const fixAge = (rowId: number) => {
    const rules = mission1Data.rules;
    const [minAge, maxAge] = rules.ageValidRange;
    setData(prev => prev.map(row => {
      if (row.id === rowId && (row.erreur === "age_invalide" || row.erreur === "age_manquant")) {
        let fixedAge = row.age;
        if (row.age === null || row.age === undefined) {
          fixedAge = Math.round((minAge + maxAge) / 2); // Valeur moyenne
        } else if (row.age > maxAge) {
          fixedAge = maxAge;
        } else if (row.age < minAge) {
          fixedAge = minAge;
        }
        return { ...row, age: fixedAge, erreur: null, corrige: true };
      }
      return row;
    }));
  };

  const removeDuplicate = (rowId: number) => {
    setData(prev => prev.filter(row => row.id !== rowId));
  };

  const fillVille = (rowId: number) => {
    setData(prev => prev.map(row => {
      if (row.id === rowId && row.erreur === "ville_vide") {
        return { ...row, ville: "Non renseigné", erreur: null, corrige: true };
      }
      return row;
    }));
  };

  const fillSport = (rowId: number) => {
    setData(prev => prev.map(row => {
      if (row.id === rowId && row.erreur === "sport_vide") {
        return { ...row, sport: "Non renseigné", erreur: null, corrige: true };
      }
      return row;
    }));
  };

  const handleComplete = () => {
    completeMission(missionId);
    setShowSuccess(true);
    setTimeout(() => {
      router.push("/missions");
    }, 3000);
  };

  const [mission2Complete, setMission2Complete] = useState(false);
  const [mission3Complete, setMission3Complete] = useState(false);
  const [mission4Complete, setMission4Complete] = useState(false);
  const [mission5Complete, setMission5Complete] = useState(false);

  // Router vers les différentes missions
  if (missionId === 5) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête */}
        <div className="mb-8">
          <Link href="/missions" className="text-accent-cyan hover:text-accent-cyan-dark mb-4 inline-block">
            ← Retour aux missions
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Mission {mission.id} : {mission.titre}
          </h1>
          <p className="text-xl text-foreground-muted mb-6">{mission.sousTitre}</p>
        </div>

        {/* Objectif */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Objectif</h2>
          <p className="text-foreground-muted mb-4">{mission.objectif}</p>
          {mission5Complete && (
            <div className="mt-4">
              <Button onClick={handleComplete} variant="primary">
                Mission terminée !
              </Button>
            </div>
          )}
        </Card>

        {/* Mission 5 Component */}
        <Mission5Spam missionId={missionId} onComplete={setMission5Complete} />

        {/* Explication BUT SD */}
        {mission5Complete && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8"
            >
              <Card className="bg-accent-cyan/20 border-accent-cyan/30">
                <div className="flex items-start gap-4">
                  <CheckCircle className="text-accent-cyan flex-shrink-0 mt-1" size={24} />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Ce que tu viens d&apos;apprendre (BUT SD)
                    </h3>
                    <p className="text-foreground-muted mb-4">{mission.ceQueTuApprends}</p>
                    <div className="flex flex-wrap gap-2">
                      {mission.competencesBUTSD?.map((comp, idx) => (
                        <Badge key={idx} variant="cyan">{comp}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    );
  }

  if (missionId === 4) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête */}
        <div className="mb-8">
          <Link href="/missions" className="text-accent-cyan hover:text-accent-cyan-dark mb-4 inline-block">
            ← Retour aux missions
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Mission {mission.id} : {mission.titre}
          </h1>
          <p className="text-xl text-foreground-muted mb-6">{mission.sousTitre}</p>
        </div>

        {/* Objectif */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Objectif</h2>
          <p className="text-foreground-muted mb-4">{mission.objectif}</p>
          {mission4Complete && (
            <div className="mt-4">
              <Button onClick={handleComplete} variant="primary">
                Mission terminée !
              </Button>
            </div>
          )}
        </Card>

        {/* Mission 4 Component */}
        <Mission4Dataviz missionId={missionId} onComplete={setMission4Complete} />

        {/* Explication BUT SD */}
        {mission4Complete && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8"
            >
              <Card className="bg-accent-cyan/20 border-accent-cyan/30">
                <div className="flex items-start gap-4">
                  <CheckCircle className="text-accent-cyan flex-shrink-0 mt-1" size={24} />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Ce que tu viens d&apos;apprendre (BUT SD)
                    </h3>
                    <p className="text-foreground-muted mb-4">{mission.ceQueTuApprends}</p>
                    <div className="flex flex-wrap gap-2">
                      {mission.competencesBUTSD?.map((comp, idx) => (
                        <Badge key={idx} variant="cyan">{comp}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    );
  }

  if (missionId === 3) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête */}
        <div className="mb-8">
          <Link href="/missions" className="text-accent-cyan hover:text-accent-cyan-dark mb-4 inline-block">
            ← Retour aux missions
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Mission {mission.id} : {mission.titre}
          </h1>
          <p className="text-xl text-foreground-muted mb-6">{mission.sousTitre}</p>
        </div>

        {/* Objectif */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Objectif</h2>
          <p className="text-foreground-muted mb-4">{mission.objectif}</p>
          {mission3Complete && (
            <div className="mt-4">
              <Button onClick={handleComplete} variant="primary">
                Mission terminée !
              </Button>
            </div>
          )}
        </Card>

        {/* Mission 3 Component */}
        <Mission3Reco missionId={missionId} onComplete={setMission3Complete} />

        {/* Explication BUT SD */}
        {mission3Complete && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8"
            >
              <Card className="bg-accent-cyan/20 border-accent-cyan/30">
                <div className="flex items-start gap-4">
                  <CheckCircle className="text-accent-cyan flex-shrink-0 mt-1" size={24} />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Ce que tu viens d&apos;apprendre (BUT SD)
                    </h3>
                    <p className="text-foreground-muted mb-4">{mission.ceQueTuApprends}</p>
                    <div className="flex flex-wrap gap-2">
                      {mission.competencesBUTSD?.map((comp, idx) => (
                        <Badge key={idx} variant="cyan">{comp}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    );
  }

  if (missionId === 2) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête */}
        <div className="mb-8">
          <Link href="/missions" className="text-accent-cyan hover:text-accent-cyan-dark mb-4 inline-block">
            ← Retour aux missions
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Mission {mission.id} : {mission.titre}
          </h1>
          <p className="text-xl text-foreground-muted mb-6">{mission.sousTitre}</p>
        </div>

        {/* Objectif */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Objectif</h2>
          <p className="text-foreground-muted mb-4">{mission.objectif}</p>
          {mission2Complete && (
            <div className="mt-4">
              <Button onClick={handleComplete} variant="primary">
                Mission terminée !
              </Button>
            </div>
          )}
        </Card>

        {/* Mission 2 Component */}
        <Mission2MatchPredict missionId={missionId} onComplete={setMission2Complete} />

        {/* Explication BUT SD */}
        {mission2Complete && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8"
            >
              <Card className="bg-accent-cyan/20 border-accent-cyan/30">
                <div className="flex items-start gap-4">
                  <CheckCircle className="text-accent-cyan flex-shrink-0 mt-1" size={24} />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Ce que tu viens d&apos;apprendre (BUT SD)
                    </h3>
                    <p className="text-foreground-muted mb-4">{mission.ceQueTuApprends}</p>
                    <div className="flex flex-wrap gap-2">
                      {mission.competencesBUTSD?.map((comp, idx) => (
                        <Badge key={idx} variant="cyan">{comp}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    );
  }

  if (missionId === 1) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête */}
        <div className="mb-8">
          <Link href="/missions" className="text-accent-cyan hover:text-accent-cyan-dark mb-4 inline-block">
            ← Retour aux missions
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Mission {mission.id} : {mission.titre}
          </h1>
          <p className="text-xl text-foreground-muted mb-6">{mission.sousTitre}</p>
        </div>

        {/* Objectif */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Objectif</h2>
          <p className="text-foreground-muted mb-4">{mission.objectif}</p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-foreground-muted">Qualité des données</span>
                <span className="text-sm font-bold text-foreground">{quality}%</span>
              </div>
              <div className="w-full h-4 bg-background-secondary rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${quality === 100 ? "bg-accent-cyan" : "bg-accent-violet"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${quality}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            {quality === 100 && (
              <Button onClick={handleComplete} variant="primary">
                Mission terminée !
              </Button>
            )}
          </div>
        </Card>

        {/* Conseils */}
        {mission1Data.tips && mission1Data.tips.length > 0 && (
          <Card className="mb-8 bg-accent-violet/10 border-accent-violet/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-accent-violet flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Conseils</h3>
                <ul className="space-y-1 text-sm text-foreground-muted">
                  {mission1Data.tips.map((tip, idx) => (
                    <li key={idx}>• {tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Données */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Dataset : Inscriptions au club</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-3 text-foreground-muted font-medium">Prénom</th>
                  <th className="p-3 text-foreground-muted font-medium">Âge</th>
                  <th className="p-3 text-foreground-muted font-medium">Ville</th>
                  <th className="p-3 text-foreground-muted font-medium">Sport</th>
                  <th className="p-3 text-foreground-muted font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr
                    key={row.id}
                    className={`border-b border-border ${row.corrige ? "bg-accent-cyan/10" : row.erreur ? "bg-red-500/5" : ""}`}
                  >
                    <td className="p-3 text-foreground">{row.prenom}</td>
                    <td className="p-3">
                      {row.age === null || row.age === undefined ? (
                        <span className="text-yellow-400 font-medium">Manquant</span>
                      ) : (row.erreur === "age_invalide" && row.valeurErronee) ? (
                        <span className="text-red-400 font-medium">{row.valeurErronee}</span>
                      ) : (
                        <span className="text-foreground">{row.age}</span>
                      )}
                    </td>
                    <td className="p-3">
                      {!row.ville || row.ville === "" ? (
                        <span className="text-yellow-400 font-medium">Vide</span>
                      ) : (
                        <span className="text-foreground">{row.ville}</span>
                      )}
                    </td>
                    <td className="p-3">
                      {!row.sport || row.sport === null ? (
                        <span className="text-yellow-400 font-medium">Vide</span>
                      ) : (
                        <span className="text-foreground">{row.sport}</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2 flex-wrap">
                        {(row.erreur === "age_invalide" || row.erreur === "age_manquant") && !row.corrige && (
                          <button
                            onClick={() => fixAge(row.id)}
                            className="px-3 py-1 bg-accent-cyan text-background rounded text-sm hover:bg-accent-cyan-dark transition-colors"
                          >
                            Corriger âge
                          </button>
                        )}
                        {row.erreur === "doublon" && (
                          <button
                            onClick={() => removeDuplicate(row.id)}
                            className="px-3 py-1 bg-red-500 text-background rounded text-sm hover:bg-red-600 transition-colors"
                          >
                            Supprimer doublon
                          </button>
                        )}
                        {row.erreur === "ville_vide" && !row.corrige && (
                          <button
                            onClick={() => fillVille(row.id)}
                            className="px-3 py-1 bg-accent-violet text-background rounded text-sm hover:bg-accent-violet-dark transition-colors"
                          >
                            Compléter ville
                          </button>
                        )}
                        {row.erreur === "sport_vide" && !row.corrige && (
                          <button
                            onClick={() => fillSport(row.id)}
                            className="px-3 py-1 bg-accent-violet text-background rounded text-sm hover:bg-accent-violet-dark transition-colors"
                          >
                            Compléter sport
                          </button>
                        )}
                        {row.corrige && !row.erreur && (
                          <span className="text-accent-cyan flex items-center">
                            <CheckCircle size={20} />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Explication */}
        <AnimatePresence>
          {quality === 100 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Card className="bg-accent-cyan/20 border-accent-cyan/30">
                <div className="flex items-start gap-4">
                  <CheckCircle className="text-accent-cyan flex-shrink-0 mt-1" size={24} />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Excellent ! Qualité de données 100%
                    </h3>
                    <p className="text-foreground mb-4">{mission.ceQueTuApprends}</p>
                    <div className="bg-background-secondary rounded-lg p-4">
                      <p className="text-sm font-medium text-foreground mb-2">
                        Compétences BUT SD développées :
                      </p>
                      <ul className="list-disc list-inside text-sm text-foreground-muted space-y-1">
                        {mission.competencesBUTSD.map((comp, idx) => (
                          <li key={idx}>{comp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de succès */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-background-secondary border border-accent-cyan rounded-xl p-8 max-w-md text-center"
              >
                <CheckCircle className="text-accent-cyan mx-auto mb-4" size={64} />
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Mission complétée !
                </h2>
                <p className="text-foreground-muted mb-6">
                  Tu viens d&apos;apprendre à nettoyer des données, une compétence fondamentale du BUT SD !
                </p>
                <p className="text-sm text-foreground-muted">
                  Redirection vers les missions...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Placeholder pour les autres missions
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/missions" className="text-accent-cyan hover:text-accent-cyan-dark mb-4 inline-block">
          ← Retour aux missions
        </Link>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Mission {mission.id} : {mission.titre}
        </h1>
      </div>
      <Card>
        <p className="text-foreground-muted">
          Cette mission est en cours de développement. Retourne aux missions pour explorer les autres !
        </p>
        <Link href="/missions">
          <Button className="mt-4">Retour aux missions</Button>
        </Link>
      </Card>
    </div>
  );
}
