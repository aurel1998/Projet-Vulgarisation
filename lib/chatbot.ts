import chatbotData from "@/data/chatbot_intents.json";

interface Intent {
  tags: string[];
  patterns: string[];
  responses: string[];
  links: string[];
}

interface ChatbotMatch {
  response: string;
  links: string[];
  confidence: number;
}

/**
 * Améliore le matching en calculant un score de confiance
 * basé sur le nombre de patterns matchés et leur longueur
 */
export function findBestIntent(text: string): ChatbotMatch {
  const lowerText = text.toLowerCase().trim();
  
  // Si le texte est trop court, retourner la réponse par défaut
  if (lowerText.length < 2) {
    return {
      response: chatbotData.default,
      links: [],
      confidence: 0,
    };
  }

  let bestMatch: ChatbotMatch | null = null;
  let bestScore = 0;

  // Parcourir tous les intents
  for (const intent of chatbotData.intents) {
    let matchScore = 0;
    let matchesFound = 0;

    // Vérifier chaque pattern
    for (const pattern of intent.patterns) {
      const lowerPattern = pattern.toLowerCase();
      
      // Score basé sur la correspondance exacte
      if (lowerText.includes(lowerPattern)) {
        matchScore += 10;
        matchesFound++;
      }
      
      // Score bonus si le pattern est au début du texte (question directe)
      if (lowerText.startsWith(lowerPattern)) {
        matchScore += 5;
      }
      
      // Score pour les mots-clés individuels (matching partiel)
      const patternWords = lowerPattern.split(/\s+/);
      for (const word of patternWords) {
        if (word.length > 3 && lowerText.includes(word)) {
          matchScore += 2;
        }
      }
    }

    // Bonus si plusieurs patterns matchent
    if (matchesFound > 1) {
      matchScore += matchesFound * 3;
    }

    // Si on a un meilleur score, on met à jour le meilleur match
    if (matchScore > bestScore) {
      bestScore = matchScore;
      const randomResponse = intent.responses[
        Math.floor(Math.random() * intent.responses.length)
      ];
      
      bestMatch = {
        response: randomResponse,
        links: intent.links || [],
        confidence: matchScore,
      };
    }
  }

  // Si on a un bon match (score > 5), on le retourne
  if (bestMatch && bestScore >= 5) {
    return bestMatch;
  }

  // Sinon, utiliser le fallback si disponible, sinon réponse par défaut
  if (chatbotData.fallback && chatbotData.fallback.responses && chatbotData.fallback.responses.length > 0) {
    const randomFallback = chatbotData.fallback.responses[
      Math.floor(Math.random() * chatbotData.fallback.responses.length)
    ];
    return {
      response: randomFallback,
      links: [],
      confidence: 0,
    };
  }

  return {
    response: chatbotData.default,
    links: [],
    confidence: 0,
  };
}

/**
 * Vérifie si le texte ressemble à une question
 */
export function isQuestion(text: string): boolean {
  const questionWords = ["quoi", "comment", "pourquoi", "qui", "quand", "où", "est-ce", "peut-on", "faut-il", "dois-je"];
  const lowerText = text.toLowerCase();
  return questionWords.some(word => lowerText.includes(word)) || text.trim().endsWith("?");
}

