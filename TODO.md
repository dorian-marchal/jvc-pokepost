# TODO
- [ ] Pokédex
- [ ] Rencontre

# Technique

### Tech
- Plusieurs modules -> Gulp + Webpack
- PSR
-

### Authentification

- Pokéball en bas à droite (noir et blanc quand pas connecté)
- Identification par mot de passe (pseudo visible)
    - Stockage d'un token renvoyé en localStorage (par exemple)

# Fonctionnalités
- Utiliser les images d'un site externe

### Autoupdater
- Va chercher automatiquement les màj

### Statistiques
- Décorateur à la réception des requêtes

### Stockage
- Modèle de données pour les

### Pokédex
- Liste des pokémons capturés et manquants
- Voir le pokédex des autres utilisateurs
    -> cache client ?

### Echanges
- Par MP -> Demande d'échange -> acceptation

### Rencontre
- À chaque nouveau post, l'id du post détermine si une rencontre a lieu (1)
- Si une rencontre a lieu, le permalien du post est envoyé au serveur du script
- Le serveur vérifie :
    - que l'id du post correspond au taux de recontre choisi
    - que le post appartient bien à l'utilisateur qui l'a envoyé,
    - qu'il a été posté récemment (pour éviter l'utilisation des vieux posts),
    - que le post n'a pas déjà été utilisé pour une rencontre
    - que le nombre de dernières rencontres ne dépassent pas le max autorisé (x par heure ?)
- Si tout est bon, on marque le post comme "utilisé" en base
- On tente une capture (Voir section du dessous)
- Pouvoir exporter un tableau de rencontres potentielles pour l'enregistrer en JSON puis l'importer
    - Le mettre dans un Objet JSON serializable




### Capture
- Taux de capture pour les différents Pokémon
- Coût des pokéballs pour éviter trop Pokémons faciles à capturer
- Random côté serveur

__Problématique__
- Anticiper les shineys
- Définir un nombre de rencontres acceptables
- Identifier user avec hash de son cookie de connexion
- Choix d'une version ?
- Rareté des pokémons ?

__Idées__
- Animation de capture (réussite / échec)
- Musique lors de la réussite ou de l'échec
- Taux de capture en fonction du texte dans le message ?

## Améliorations
- Tous les pokémons capturés = affichage spécial
- Shinys
- Echange (anticiper les soucis)
- Site web
- Différents types de ball
- Intégration dans SpawnKill ?
- Version JVForum
- Tableau avec taux de capture
- Plusieurs générations
- Possibilité d'activer un repousse
    - Repousse spécial permettant de masquer les rencontres avec les pokémons obtenus
- Checking périodique des pokémons obtenus (puis stockage en localStorage)
