# BUT Science des Données - Site de Valorisation Pédagogique

Site web complet et impressionnant pour valoriser le BUT Science des Données auprès des lycéens (15-18 ans). Le site vulgarise les acquis de la formation de façon ludique, concrète et moderne, avec des missions interactives et un chatbot étudiant.

## 🎯 Objectifs

- **Vulgariser** les acquis du BUT SD (nettoyage, analyse, visualisation, automatisation, IA)
- **Démystifier** la data science avec des analogies concrètes (Netflix, Spotify, sport...)
- **Rendre l'apprentissage interactif** avec 5 missions gamifiées
- **Répondre aux questions** des lycéens via un chatbot étudiant rule-based
- **Donner envie de s'inscrire** en montrant les débouchés concrets

## 🚀 Technologies

- **Next.js 14** (App Router) avec TypeScript
- **Tailwind CSS** pour le styling
- **Framer Motion** pour les animations
- **Recharts** pour les graphiques
- **Lucide React** pour les icônes
- **Export statique** (pas de backend nécessaire)

## 📦 Installation

### Prérequis

- Node.js 18+ installé
- npm ou yarn

### Étapes

1. **Cloner ou télécharger le projet**

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer le serveur de développement**
```bash
npm run dev
```

Le site sera accessible sur `http://localhost:3000`

4. **Build pour production**
```bash
npm run build
```

Le site statique sera généré dans le dossier `out/`

5. **Déployer sur Vercel**
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

Ou simplement connecter le repo GitHub à Vercel depuis l'interface web.

## 📁 Structure du projet

```
.
├── app/                      # Pages Next.js (App Router)
│   ├── page.tsx             # Landing page
│   ├── missions/            # Pages missions
│   │   ├── page.tsx         # Hub missions
│   │   └── [id]/page.tsx    # Page mission dynamique
│   ├── chat/page.tsx        # Chatbot étudiant
│   ├── careers/page.tsx     # Débouchés
│   ├── program/page.tsx     # La formation
│   ├── faq/page.tsx         # FAQ
│   ├── demo/page.tsx        # Espace Jury
│   ├── apply/page.tsx       # Candidater
│   ├── layout.tsx           # Layout global
│   └── globals.css          # Styles globaux
├── components/              # Composants réutilisables
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   └── ProgressBar.tsx
├── data/                    # Données mock JSON
│   ├── missions.json
│   ├── careers.json
│   ├── faqs.json
│   ├── testimonials.json
│   ├── chatbot_intents.json
│   └── mission*.json        # Données pour chaque mission
├── lib/                     # Utilitaires
│   └── progress.ts          # Gestion progression localStorage
└── public/                  # Assets statiques (optionnel)
```

## 🎮 Fonctionnalités

### Pages principales

1. **Landing Page (/)** : Hero impactant, sections "Pourquoi c'est fait pour toi", timeline compétences, mini-démo interactive, métiers, témoignages
2. **Missions (/missions)** : Hub gamifié avec 5 missions, progression, badges, filtres
3. **Missions individuelles (/missions/[id])** : Missions interactives (actuellement Mission 1 complète)
4. **Chatbot (/chat)** : Chatbot étudiant rule-based avec intents et quick replies
5. **Débouchés (/careers)** : Métiers après le BUT SD avec salaires, outils, perspectives
6. **Formation (/program)** : Programme vulgarisé, timeline, stages, alternance
7. **FAQ (/faq)** : 15 questions fréquentes en accordéon
8. **Candidater (/apply)** : Comment postuler, formulaire de contact (démo)

### Système de progression

- **localStorage** pour sauvegarder la progression
- **Badges** : "Explorateur Data", "Détective", "Mini-IA"
- **Score** : Points gagnés par mission complétée
- **Missions complétées** : Suivi des missions terminées

### Design System

- **Thème dark premium** : Near-black background (#0a0a0a), accents cyan/violet
- **Typographie** : Inter via next/font/google
- **Animations** : Framer Motion (apparition au scroll, hover, transitions)
- **Responsive** : Mobile-first, breakpoints Tailwind
- **Accessibilité** : Navigation clavier, contraste, ARIA labels

## 🎯 Missions

### Mission 1 : Détective des données ✅
- **Nettoyage de données** : Corriger les erreurs, supprimer les doublons, compléter les valeurs manquantes
- **Dataset** : Inscriptions à un club (nom, âge, ville, sport)
- **Objectif** : Obtenir 100% de qualité des données

### Missions 2-5 : Squelettes
Les missions 2-5 sont des squelettes à étendre avec leur logique complète :
- **Mission 2** : Qui va gagner le match ? (Analyse statistique)
- **Mission 3** : Netflix dans ta tête (Recommandation)
- **Mission 4** : Parle en graphiques (Dataviz)
- **Mission 5** : Mini IA anti-spam (Classification)

Les données JSON sont déjà prêtes dans `data/mission*.json`. Il suffit d'implémenter la logique dans `app/missions/[id]/page.tsx`.

## 🤖 Chatbot

Le chatbot est **rule-based** (pas d'IA nécessaire). Il utilise :
- **Intents** définis dans `data/chatbot_intents.json`
- **Matching de mots-clés** pour trouver la réponse appropriée
- **Quick replies** pour questions fréquentes
- **Liens** vers les pages pertinentes

### Ajouter une nouvelle réponse

Éditer `data/chatbot_intents.json` et ajouter un nouvel intent :

```json
{
  "keywords": ["nouveau", "mot-clé"],
  "reponse": "La réponse du chatbot",
  "liens": ["/page"]
}
```

## 📊 Données Mock

Toutes les données sont dans `data/*.json` :
- **missions.json** : Liste des 5 missions
- **careers.json** : 8 métiers après le BUT SD
- **faqs.json** : 15 questions fréquentes
- **testimonials.json** : 4 témoignages étudiants
- **chatbot_intents.json** : Intents et réponses du chatbot
- **mission*.json** : Données pour chaque mission

## 🎨 Personnalisation

### Couleurs

Éditer `tailwind.config.ts` :

```typescript
colors: {
  background: {
    DEFAULT: "#0a0a0a",  // Near-black
    secondary: "#111111",
    tertiary: "#1a1a1a",
  },
  accent: {
    cyan: "#06b6d4",
    violet: "#8b5cf6",
  },
}
```

### Contenu

- **Textes** : Éditer directement les fichiers JSON dans `data/`
- **Pages** : Modifier les composants dans `app/`
- **Composants** : Personnaliser les composants dans `components/`

## 🚀 Déploiement

### Vercel (recommandé)

1. Push le code sur GitHub
2. Aller sur [vercel.com](https://vercel.com)
3. Importer le projet
4. Vercel détecte automatiquement Next.js
5. Le site est déployé !

### Autres plateformes

Le site utilise `output: 'export'` dans `next.config.js`, donc il génère un site statique dans `out/` qui peut être déployé sur :
- Netlify
- GitHub Pages
- Cloudflare Pages
- Tout serveur web statique

## 📝 TODO / Améliorations possibles

- [ ] Implémenter complètement les missions 2-5
- [ ] Ajouter plus d'animations et micro-interactions
- [ ] Mode sombre/clair (toggle)
- [ ] Analytics (Google Analytics, Plausible)
- [ ] Formulaire de contact fonctionnel (backend)
- [ ] Export PDF de la brochure
- [ ] QR code réel
- [ ] Tests unitaires
- [ ] Mode "Lycéen pressé" (missions rapides 1,3,5)

## 📄 Licence

Projet de valorisation pédagogique - Usage éducatif

## 👥 Crédits

Site développé pour valoriser le BUT Science des Données auprès des lycéens.

---

**Note** : Ce site est une démonstration. Les données sont mockées et les formulaires sont en mode démo (pas d'envoi réel).

