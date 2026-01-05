// Types pour le simulateur
export type Bac = "Général" | "Techno";
export type Interet = "Sport" | "Réseaux" | "Environnement" | "Marketing";
export type Pref = "Projets" | "Théorie" | "Mix";

export interface SimulatorAnswers {
  bac: Bac | null;
  interet: Interet | null;
  pref: Pref | null;
}

export interface RecommendationResult {
  missionIds: number[];
  careerTitres: string[];
  tips: string[];
}

/**
 * Recommande un parcours personnalisé basé sur les réponses
 */
export function recommendPath(answers: SimulatorAnswers): RecommendationResult {
  const { bac, interet, pref } = answers;
  
  const missionIds: number[] = [];
  const careerTitres: string[] = [];
  const tips: string[] = [];

  // Mapping des missions selon le centre d'intérêt
  if (interet === "Sport") {
    missionIds.push(2, 4, 1); // Qui va gagner le match, Parle en graphiques, Détective des données
    careerTitres.push("Analyste sport", "Data Analyst");
  } else if (interet === "Réseaux") {
    missionIds.push(4, 1, 5); // Parle en graphiques, Détective des données, Mini IA anti-spam
    careerTitres.push("Consultant data", "Data Analyst");
  } else if (interet === "Environnement") {
    missionIds.push(4, 2, 1); // Parle en graphiques, Qui va gagner le match, Détective des données
    careerTitres.push("Analyste énergie / environnement", "Chargé d'études statistiques");
  } else if (interet === "Marketing") {
    missionIds.push(3, 4, 2); // Netflix dans ta tête, Parle en graphiques, Qui va gagner le match
    careerTitres.push("Analyste marketing", "Data Analyst");
  } else {
    // Par défaut: missions générales
    missionIds.push(1, 2, 4);
    careerTitres.push("Data Analyst", "Chargé d'études statistiques");
  }

  // Conseils selon la préférence
  if (pref === "Projets") {
    tips.push(
      "💡 Fais les missions 1 et 4 en premier : elles te montrent concrètement comment on nettoie et visualise des données.",
      "🎯 Le BUT SD est très orienté projets ! Tu vas adorer les travaux pratiques et les cas concrets.",
      "🚀 N'hésite pas à tester plusieurs fois les missions pour bien comprendre chaque étape."
    );
  } else if (pref === "Théorie") {
    tips.push(
      "📚 Prends le temps de lire les explications 'Ce que tu apprends' dans chaque mission : elles te donnent le contexte théorique.",
      "🧠 Même si tu préfères la théorie, tu vas vite voir qu'elle sert toujours à comprendre des cas pratiques.",
      "💭 Explore aussi la page Formation pour comprendre le programme complet du BUT SD."
    );
  } else if (pref === "Mix") {
    tips.push(
      "⚖️ Alterne mission + lecture + chatbot : c'est le meilleur moyen de comprendre à la fois la pratique et les concepts.",
      "🔄 Après chaque mission, prends 2 minutes pour lire 'Ce que tu apprends' et pose tes questions au chatbot.",
      "📖 La combinaison pratique + théorie, c'est exactement ce que propose le BUT SD."
    );
  }

  // Conseils selon le bac
  if (bac === "Général") {
    tips.push(
      "✅ Tu as de bonnes bases pour progresser en statistiques et en analyse de données.",
      "🎓 Le BUT SD va te permettre d'appliquer tes connaissances générales à des cas concrets passionnants.",
      "💪 Tes compétences en raisonnement et analyse seront un atout majeur."
    );
  } else if (bac === "Techno") {
    tips.push(
      "🔧 Tu vas progresser vite grâce au côté concret et projets du BUT SD.",
      "💼 Tes compétences pratiques sont un atout : le BUT SD valorise beaucoup les projets et les stages.",
      "🌟 Beaucoup d'étudiants de bac techno réussissent très bien en BUT SD. L'important, c'est ta curiosité et ta volonté d'apprendre."
    );
  }

  // Conseils généraux (toujours ajoutés)
  tips.push(
    "🎯 Commence par explorer les missions recommandées pour découvrir concrètement le BUT SD.",
    "💬 N'hésite pas à poser tes questions au chatbot étudiant si tu as des doutes.",
    "📈 Les métiers de la data sont très demandés : tu auras de nombreuses opportunités après le BUT."
  );

  // Limiter à 3 conseils au total (les plus pertinents)
  return {
    missionIds: missionIds.slice(0, 3),
    careerTitres: careerTitres.slice(0, 2),
    tips: tips.slice(0, 3),
  };
}


