// Helper pour gérer le localStorage de manière sécurisée

export const storage = {
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error(`Erreur lors de la lecture de ${key}:`, e);
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Erreur lors de l'écriture de ${key}:`, e);
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.error(`Erreur lors de la suppression de ${key}:`, e);
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.clear();
    } catch (e) {
      console.error('Erreur lors du nettoyage du localStorage:', e);
    }
  },
};


