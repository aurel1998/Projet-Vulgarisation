export interface Progress {
  missionsCompleted: number[];
  badges: string[];
  score: number;
}

const STORAGE_KEY = "but-sd-progress";

export function getProgress(): Progress {
  if (typeof window === "undefined") {
    return { missionsCompleted: [], badges: [], score: 0 };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { missionsCompleted: [], badges: [], score: 0 };
    }
  }

  return { missionsCompleted: [], badges: [], score: 0 };
}

export function saveProgress(progress: Progress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function completeMission(missionId: number): void {
  const progress = getProgress();
  if (!progress.missionsCompleted.includes(missionId)) {
    progress.missionsCompleted.push(missionId);
    progress.score += 100;
    
    // Attribuer des badges
    if (progress.missionsCompleted.length === 1) {
      progress.badges.push("Explorateur Data");
    }
    if (progress.missionsCompleted.length === 3) {
      progress.badges.push("Détective");
    }
    if (progress.missionsCompleted.length === 5) {
      progress.badges.push("Mini-IA");
    }

    saveProgress(progress);
  }
}

export function addScore(points: number): void {
  const progress = getProgress();
  progress.score += points;
  saveProgress(progress);
}



