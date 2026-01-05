# 🚀 Guide de déploiement sur Vercel

## Méthode 1 : Via l'interface web Vercel (RECOMMANDÉE)

### Étape 1 : Créer un compte Vercel
1. Va sur [vercel.com](https://vercel.com)
2. Clique sur **"Sign Up"** ou **"Log In"**
3. Connecte-toi avec ton compte **GitHub** (le plus simple)

### Étape 2 : Importer le projet
1. Une fois connecté, clique sur **"Add New..."** → **"Project"**
2. Tu verras la liste de tes repositories GitHub
3. Sélectionne **"Projet-Vulgarisation"** (ou cherche-le)
4. Clique sur **"Import"**

### Étape 3 : Configurer le projet
Vercel détecte automatiquement que c'est un projet Next.js. Les paramètres par défaut sont :
- **Framework Preset** : Next.js
- **Root Directory** : `./` (racine)
- **Build Command** : `npm run build`
- **Output Directory** : `out` (car tu as `output: 'export'` dans next.config.js)
- **Install Command** : `npm install`

⚠️ **IMPORTANT** : Vérifie que **Output Directory** est bien `out`

### Étape 4 : Déployer
1. Clique sur **"Deploy"**
2. Attends 2-3 minutes que le build se termine
3. Une fois terminé, tu auras un lien du type : `https://projet-vulgarisation-xxx.vercel.app`

### Étape 5 : Obtenir un nom de domaine personnalisé (optionnel)
1. Dans les paramètres du projet sur Vercel
2. Va dans **"Settings"** → **"Domains"**
3. Tu peux ajouter un domaine personnalisé ou utiliser le sous-domaine Vercel

---

## Méthode 2 : Via la CLI Vercel

### Étape 1 : Installer Vercel CLI
```bash
npm i -g vercel
```

### Étape 2 : Se connecter
```bash
vercel login
```

### Étape 3 : Déployer
```bash
cd "C:\Users\aurel\Documents\Projet Palmier"
vercel
```

Suis les instructions :
- **Set up and deploy?** → Oui
- **Which scope?** → Ton compte
- **Link to existing project?** → Non (première fois)
- **Project name?** → `projet-vulgarisation` (ou ce que tu veux)
- **Directory?** → `./`

### Étape 4 : Déployer en production
```bash
vercel --prod
```

---

## ✅ Vérifications avant déploiement

1. **Le projet build correctement** :
   ```bash
   npm run build
   ```
   Si ça fonctionne, Vercel fonctionnera aussi.

2. **Le repository GitHub est à jour** :
   ```bash
   git status
   git push
   ```

3. **Le fichier vercel.json existe** (déjà fait ✅)

---

## 🔗 Après le déploiement

Une fois déployé, tu auras :
- **URL de production** : `https://projet-vulgarisation-xxx.vercel.app`
- **URL de preview** : Pour chaque commit (déploiement automatique)

Tu peux partager ce lien à ton professeur ! 🎉

---

## 🐛 En cas de problème

### Erreur de build
- Vérifie que `npm run build` fonctionne en local
- Regarde les logs de build sur Vercel

### Erreur 404
- Vérifie que `outputDirectory` est bien `out` dans les paramètres Vercel
- Vérifie que `next.config.js` a bien `output: 'export'`

### Problème de dépendances
- Vérifie que toutes les dépendances sont dans `package.json`
- Vérifie que `node_modules` n'est pas commité (déjà dans .gitignore ✅)
