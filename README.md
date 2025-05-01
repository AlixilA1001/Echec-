# Chess System - Jeu d'Échecs Multijoueur ou Ordinateur & Analyse de partie

**Chess System** est un projet web de jeu d’échecs interactif permettant :
- de créer une partie en ligne avec un lien à partager
- de jouer contre un bot doté d’une intelligence minimale
- de suivre les pièces capturées et le statut de la partie
- d’analyser une partie PGN via une interface dédiée

---

## Technologies utilisées

- **Frontend** : HTML5, CSS3, JavaScript, jQuery
- **Moteur d’échecs** : [Chess.js](https://github.com/jhlywa/chess.js)
- **Échiquier interactif** : [Chessboard.js](https://chessboardjs.com)
- **Temps réel** : [Socket.IO](https://socket.io)
- **Backend** : Node.js + Express

---

## Structure du projet

```
.
├── css/
│   ├── analyse.css
│   ├── chessboard-1.0.0.css
│   ├── design.css
│   ├── game.css
│   ├── lienPartie.css
│   ├── ordi.css
│   ├── pageA.css
│   ├── pere.css
│   └── room.css
├── html/
│   ├── Analyse.html
│   ├── game.html
│   ├── Lienpartie.html
│   ├── Ordi.html
│   ├── pageAccueil.html
│   ├── Pere.html
│   └── room.html
├── img/
│   └── chesspieces/wikipedia/
├── js/
│   └── typing.js
├── analyse.js
├── chess.js
├── chessboards.js
├── game.js
├── index.js
├── jqueryy.js
├── ordi.js
├── socket.js
├── package-lock.json
├── package.json
└── README.md
```

---

## Installation et exécution

### 1. Cloner le projet

```bash
git clone https://github.com/AlixilA1001/Echec-.git
cd Echec-
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Démarrer le serveur

```bash
node index.js
```

### 4. Accéder à l’application

Ouvrez [http://localhost:8000](http://localhost:8000) dans votre navigateur.

---

## Fonctionnalités

-  Afficahge responsive
-  Partie en ligne avec un ami (génération de lien unique)
-  Jouer contre un **bot basique** (priorise les captures)
-  Affichage des **pièces capturées**
-  Gestion complète des règles (Chess.js)
-  Minuteur 10 min par joueur
-  Chat entre joueurs (en mode multijoueur)
-  Détection d’**échec**, **échec et mat**, **égalité**

---

## Exemples de pages

- `/Accueil` — Page d’accueil
- `/Partie` — Créer une partie en ligne
- `/Room/:id` — Attente d’un adversaire
- `/game/:id` — Partie en ligne
- `/Ordi` — Partie contre un bot
- `/Analyse` - Analyse de PGN ou de partie 

---

## Amélioration pour suite de projet

- Déployement du site en ligne pas seulement en local

## Auteur

Projet développé par Alix Tieo & Moe Triquet - Université Paris Cité M1 Informatique IAD - Module Programmation Web encadré par Mr. Antoine Martin.
