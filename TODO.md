# v0.1 :
- [ ] Mise à jour auto
- [ ] Build avec webpack
- [ ] Pas d'authentification
- [ ] Rencontre :
    - à chaque nouveau post, une rencontre peut être faite.
    - affichage d'une simple image lors d'une rencontre
- [ ] Capture
    - animation simple :
      click -> affichage d'une pokéball sur l'image
            -> fadeout du Pokémon en cas d'échec
    - Enregistrer la capture dans le pokédex
    - Une seule capture possible par espèce
- [ ] Pokédex
    - Simple liste des Pokémon capturés / restants
    - lien en haut à droite des forums
- [ ] Warning beta dans le topic
- [ ] Trouver un nom au script

# v0.2
- [ ] ES6
- [ ] Authentification
- [ ] Pokédex voir le pokédex d'un utilisateur dans son profil (icône pokédex)

#v0.3
- [ ] Autoriser plusieurs captures

#v0.4
- [ ] Echanges entre utilisateurs

# v1
- [ ] Statistiques d'utilisation du script
- [ ] Monitoring du serveur
- [ ] Animations peaufinées
    - [ ] Rencontre
    - [ ] Capture / Fuite
    - [ ] Echange
    - [ ] Pokédex complet


# Général
- [ ] Trouver un meilleur nom (court, facile à chercher sur Google)
- [ ] Ajouter des tests
    - mapping rencontres / captures
    - simuler le nombre de posts moyen pour remplir le pokédex

# Technique

### Tech
- Plusieurs modules -> Gulp + Webpack
- Passer à ES6
- Améliorer les tests (état global mocha)
- Test que les pokémons d'un même group aient le même taux de rencontre
- Test que wantedEncounterRate et encounterRate ne soient pas trop éloignés
- definition approximation
- Ajouter un gulpfile (install / test / lint)
- Hook pour lancer les test

### Authentification
- Pokéball en bas à droite (noir et blanc quand pas connecté)
- Identification par mot de passe (pseudo visible)
    - Stockage d'un token renvoyé en localStorage (par exemple)

### Autoupdater
- Va chercher automatiquement les màj (Demander à Alexandre)

### Statistiques
- Une entrée par appel (date, ip, port, type)
- Envisager l'utilisation de Google Analytics
- Décorateur à la réception des requêtes côté serveur

### Stockage
- Modèle de données (rencontres, captures, ...)

### Pokédex
- Onglet dans le profil accessible depuis en haut à droite
- Compteur de Pokémon directement sur le pokédex
- Liste des Pokémon capturés et manquants
- Compteur pour chaques Pokémon
- Voir le pokédex des autres utilisateurs
    - Compteur sur chaque utilisateur
    - cache client ?
- Utiliser les images d'un site externe (les stocker dans le dépôt ? Vérifier l'aspect légal)

### Echanges
- Par MP -> Demande d'échange -> acceptation
- Possibilité d'obtenir plusieurs fois le même Pokémon
- Interface d'échange dans un topic en particulier ?
- Possibilité de bloquer les échanges pour éviter les abus ?

### Rencontre
- Définir un taux de rencontre pour chaque Pokémon
- À chaque nouveau post, l'id du post détermine si une rencontre a lieu (1)
- Si une rencontre a lieu, le permalien du post est envoyé au serveur du script
- Le serveur vérifie :
    - que l'id du post correspond au taux de rencontre choisi
    - que le post appartient bien à l'utilisateur qui l'a envoyé,
    - qu'il a été posté récemment (pour éviter l'utilisation des vieux posts),
    - que le post n'a pas déjà été utilisé pour une rencontre
    - que le nombre de dernières rencontres ne dépassent pas le max autorisé (x par heure ?)
- Si tout est bon, on marque le post comme "utilisé" en base
- On tente une capture (Voir section du dessous)
- Pouvoir exporter un tableau de rencontres potentielles pour l'enregistrer en JSON puis l'importer
    - Le mettre dans un Objet JSON serializable
- Attention à limiter le nombre de requêtes parallèles à jeuxvideo.com

### Capture
- Objet "Pokémon" contenant le taux de rencontre et de capture ?
- Vérifier la rencontre côté serveur
    - Choisir une URL légère à récupérer.
- Taux de capture pour les différents Pokémon
    - Fixe + variable, du type `min(1, 0.4 + (0.06 * frequencyFactor))``
      frequencyFactor:1 -> 0.46
      frequencyFactor:4 -> 0.64
      frequencyFactor:8 -> 0.88
      frequencyFactor:12 -> 1
- Coût des pokéballs pour éviter des Pokémon faciles à capturer
- Random côté serveur

__Problématique__
- Anticiper les shineys
- Définir un nombre de rencontres acceptables
- Identifier user avec hash de son cookie de connexion -> impossible

__Idées__
- Animation de capture (réussite / échec)
- Musique lors de la réussite ou de l'échec
- Taux de capture en fonction du texte dans le message ?

### Evolution
- Choisir une équipe qui gagnera de l'XP
- Possibilité de combattre le Pokémon plutôt que de le capturer pour monter en niveau ?
    - 1 post = 1 niveau
- Objets récupérables au clic que certaines pages (du types pierres d'évolution)
- Evolution lors d'échange ?
- Impossibilité de capturer directement les évolutions ?
- Animation d'évolution

## Améliorations
- Pokédex rempli = événement spécial -> Faire un topic au nom du premier ?
- Shinys
- Générer des signatures, Avatars, etc pour faire connaître le jeu
- Echange (anticiper les soucis)
- Légendaires : récupération particulière ? animation spécifique ?
- Site web
- Différents types de ball
- Tableau avec taux de capture
- Plusieurs générations
- Evolution des Pokémon ?
- Possibilité d'activer un repousse
    - Repousse spécial permettant de masquer les rencontres avec les Pokémon obtenus
- Checking périodique des Pokémon obtenus (puis stockage en localStorage)
- Ajouter plus de Pokémon (151, dans la première version)
- Intégration dans SpawnKill ? Pub dans le topic ? Pub dans la signature ? o/
- Version JVForum
