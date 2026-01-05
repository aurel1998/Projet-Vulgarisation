# Rapport : Site de Valorisation du BUT Science des Données
## Outil d'Orientation Interactive pour les Lycéens

---

## 1. Présentation et Contexte

### 1.1 Le Problème Identifié

L'orientation post-bac représente un défi majeur pour les lycéens de 15 à 18 ans. Face à la multiplication des formations, les jeunes manquent d'outils concrets pour comprendre, expérimenter et se projeter dans une formation. Le BUT Science des Données (BUT SD) souffre particulièrement de cette opacité : perçu comme technique et réservé aux "experts", il effraie de nombreux lycéens qui pourraient pourtant y exceller.

### 1.2 La Solution Proposée

Ce site web interactif a été conçu pour **démystifier le BUT Science des Données** en permettant aux lycéens de :
- Découvrir la formation par la pratique (5 missions interactives)
- Comprendre les compétences acquises de manière concrète
- Visualiser les débouchés professionnels
- Obtenir des réponses personnalisées via un chatbot étudiant
- Se projeter dans un parcours adapté à leur profil

**Lien du site** : https://projet-vulgarisation.vercel.app

---

## 2. Fonctionnalités Principales

### 2.1 Les 5 Missions Interactives : Apprendre en Faisant

Le cœur du site réside dans **5 missions gamifiées** qui permettent d'expérimenter les compétences du BUT SD :

- **Mission 1 - "Nettoie tes données"** : Détecter et corriger les erreurs dans un dataset (doublons, valeurs manquantes). Compétence : Nettoyage de données. Durée : ~5 min.

- **Mission 2 - "Qui va gagner le match ?"** : Analyser des statistiques sportives et faire une prédiction. Compétence : Analyse de données, visualisation. Durée : ~5 min.

- **Mission 3 - "Netflix dans ta tête"** : Créer un système de recommandation simple basé sur les goûts. Compétence : Systèmes de recommandation, similarité. Durée : ~4 min.

- **Mission 4 - "Parle en graphiques"** : Choisir le bon type de graphique selon le contexte + détecter les graphiques trompeurs. Compétence : Data visualisation, esprit critique. Durée : ~6 min.

- **Mission 5 - "Détecte le spam"** : Classifier des messages comme spam ou non-spam. Compétence : Classification, apprentissage automatique. Durée : ~5 min.

**Points forts pédagogiques** : Feedback immédiat, gamification (badges, scores), concrétisation des compétences, accessibilité sans prérequis.

### 2.2 Autres Fonctionnalités

- **Chatbot étudiant** : Réponses aux questions courantes (prérequis, programme, débouchés, admission) disponible 24/7
- **Simulateur de parcours** : Outil d'orientation en 3 questions (bac, intérêt, préférence) générant des recommandations personnalisées
- **Pages informatives** : Débouchés (8 métiers), Formation (programme vulgarisé), FAQ (15 questions), Shorts (vidéos format TikTok)

---

## 3. Support et Mode Opératoire

### 3.1 Accès au Site

**Lien principal** : https://projet-vulgarisation.vercel.app

Le site est **accessible 24/7** sans inscription, sur tous les appareils (ordinateur, tablette, smartphone) et navigateurs modernes.

### 3.2 Mode Opératoire pour les Enseignants

#### Étape 1 : Présentation du Site (5-10 min)
1. Projeter le site sur écran/TBI
2. Présenter la page d'accueil et ses sections
3. Montrer rapidement une mission (ex. Mission 1)
4. Expliquer l'objectif : découvrir le BUT SD de manière interactive

#### Étape 2 : Navigation et Exploration (20-30 min)
1. Distribuer le lien aux élèves (via ENT, QR code, ou tableau)
2. Laisser les élèves naviguer librement
3. Encourager à : faire 2 missions, utiliser le simulateur, consulter "Débouchés", tester le chatbot

#### Étape 3 : Utilisation du Simulateur (10-15 min)
1. Accéder à la page "Simulateur"
2. Répondre aux 3 questions (bac, intérêt, préférence)
3. Consulter les recommandations personnalisées
4. Noter les missions et métiers suggérés

#### Étape 4 : Réalisation des Missions (30-45 min)

**Mission 1** : Accéder à `/missions/1` → Observer les erreurs → Cliquer "Corriger" → Atteindre 100% qualité → Lire le feedback

**Mission 2** : Accéder à `/missions/2` → Utiliser les sliders → Observer l'impact → Répondre au quiz → Visualiser les graphiques

**Mission 3** : Accéder à `/missions/3` → Sélectionner 3 goûts → Consulter les recommandations → Comprendre le scoring

**Mission 4** : Accéder à `/missions/4` → Choisir le bon graphique (3 scénarios) → Recevoir feedback → Visualiser graphiques → Détecter piège

**Mission 5** : Accéder à `/missions/5` → Classifier messages → Observer patterns → Comprendre la classification

#### Étape 5 : Utilisation du Chatbot (10 min)
1. Accéder à "Chatbot"
2. Poser questions : "Faut-il savoir coder ?", "Qu'est-ce qu'on apprend ?", "Quels métiers ?", "Comment postuler ?"
3. Consulter réponses et liens suggérés

**Support** : Chaque section contient des instructions claires et un feedback immédiat.

### 3.3 Scénarios d'Utilisation

- **Découverte en autonomie (1h)** : Présentation (5 min) → Exploration libre (30 min) → Partage (15 min) → Retour écrit (10 min)
- **Atelier orientation (2h)** : Découverte (30 min) → Simulateur (20 min) → Missions (40 min) → Débat (30 min)
- **Support entretiens** : Guide l'élève vers sections pertinentes, utilise chatbot, réalise mission ensemble

---

## 4. Créativité et Vulgarisation

### 4.1 Approche Créative

Le site utilise plusieurs **leviers créatifs** pour rendre la science des données accessible :

1. **Gamification** : Missions interactives avec scores et badges, progression visible, feedback immédiat et positif

2. **Analogies Concrètes** : 
   - Netflix pour expliquer les systèmes de recommandation
   - Sport pour illustrer l'analyse de données
   - Graphiques trompeurs pour développer l'esprit critique

3. **Design Moderne** : Interface sombre et moderne (inspirée des outils de développement), animations fluides (Framer Motion), graphiques interactifs (Recharts)

4. **Langage Vulgarisé** : Pas de jargon technique inutile, explications simples et concrètes, exemples du quotidien

### 4.2 Vulgarisation Pédagogique

**Techniques utilisées** :

- **Métaphores** : "Détective des données", "Netflix dans ta tête", "Qui va gagner le match ?"
- **Exemples concrets** : Températures, matchs de foot, recommandations de films, classification de spam
- **Visualisation** : Graphiques interactifs, tableaux colorés, animations, sliders
- **Interactivité** : Manipulation directe des données, feedback immédiat, progression visible
- **Feedback pédagogique** : Explications après chaque action, sections "Ce que tu apprends", "Pourquoi c'est important"

**Résultat** : Des concepts complexes (data cleaning, machine learning, visualisation, systèmes de recommandation) deviennent accessibles et compréhensibles pour des lycéens sans prérequis techniques. Le site transforme une formation perçue comme "réservée aux experts" en une expérience ludique et accessible.

### 4.3 Impact sur les Lycéens

**Avant** : "Le BUT SD, c'est pour les matheux, faut savoir coder, c'est trop technique"

**Après** : "Ah, c'est comprendre des données, nettoyer des tableaux, faire des graphiques. Je peux essayer !"

Le site **brise les barrières psychologiques** en montrant que les compétences sont accessibles, concrètes et apprises progressivement.

---

## 5. Conclusion

Ce site web représente un **outil pédagogique innovant** pour l'orientation des lycéens vers le BUT Science des Données. Il répond à un besoin réel : **démystifier une formation perçue comme inaccessible** en permettant aux jeunes de l'expérimenter concrètement.

### Points Clés à Retenir

✅ **Accessible** : Aucun prérequis technique, interface intuitive  
✅ **Interactif** : 5 missions gamifiées pour expérimenter les compétences  
✅ **Personnalisé** : Simulateur de parcours et chatbot adaptés  
✅ **Complet** : Informations sur la formation, les métiers, l'admission  
✅ **Gratuit** : Aucun coût, accessible 24/7  
✅ **Créatif** : Gamification, analogies concrètes, design moderne, langage vulgarisé

### Recommandation d'Utilisation

Nous recommandons d'intégrer ce site dans :
- Les **séances d'orientation** en classe
- Les **entretiens individuels** avec les élèves
- Les **forums des métiers** comme support interactif
- Les **heures d'Accompagnement Personnalisé**

Le site peut également être partagé directement avec les élèves pour une **découverte en autonomie**.

### Ressources

- **Site principal** : https://projet-vulgarisation.vercel.app
- **Hub des missions** : https://projet-vulgarisation.vercel.app/missions
- **Simulateur** : https://projet-vulgarisation.vercel.app/simulator
- **Chatbot** : https://projet-vulgarisation.vercel.app/chat

**Points techniques** : Compatible tous navigateurs, responsive (mobile/tablette/ordinateur), aucune collecte de données personnelles, conformité RGPD.

---

**Contact et Support** : Pour toute question sur l'utilisation pédagogique du site, n'hésitez pas à nous contacter.

*Rapport rédigé en 2026 - Projet de Valorisation Pédagogique BUT Science des Données*

**Équipe de développement** :
- Aurel SOUSSOUKPO
- Mell-Florda OBISSA
- Faste-Remède MOUANIA
- God-Louange THOMBET
