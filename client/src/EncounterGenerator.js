var shuffle = require('array-shuffle');

/**
 * Permet de générer des rencontres de pokémons à partir d'ID de posts sur les
 * forums de jeuxvideo.com.
 * @param {object} pokemonRepartitionList Liste de répartition des pokémons.
 *        Voir #setPokemonRepartitionList() pour plus d'informations.
 * @param {float} wantedEncounterRate Taux de rencontre global souhaité.
 * @constructor
 */
var EncounterGenerator = function(pokemonRepartitionList, wantedEncounterRate) {
    this.setPokemonRepartitionList(pokemonRepartitionList);
    this.setWantedEncounterRate(wantedEncounterRate);
    this.update();
};

/**
 * Écart minimum entre deux ID de post sur un même topic de jeuxvideo.com.
 * @type {int}
 */
EncounterGenerator.MIN_GAP_BETWEEN_POST_IDS = 8;

EncounterGenerator.prototype._pokemonRepartitionList = [];
EncounterGenerator.prototype._encounterPossibilities = [];

/**
 * @type {float} Probabilité de rencontrer n'importe quel pokémon à chaque
 *      post (entre 0 et 1).
 */
EncounterGenerator.prototype._wantedEncounterRate = 1;

/**
 * Modifie la liste de répartition des pokémons.
 *
 * @param {object} pokemonRepartitionList Liste des différents id de pokémons
 * classés par coefficient de fréquence, de la forme :
 * {
 *     1: ['Mew', 'Mewtwo'], // coefficient 1, les plus rares
 *     4: ['Pikachu'], // 4 fois plus fréquents que ceux du dessus
 *     10: ['Rattata', 'Roucool'], // 10 fois plus fréquents que ceux du dessus
 * }
 * Les coefficients doivent être des entiers positifs.
 *
 * @throws {Error} si la liste passée est mal formée.
 */
EncounterGenerator.prototype.setPokemonRepartitionList = function(pokemonRepartitionList) {
    this._checkRepartitionList(pokemonRepartitionList);
    this._pokemonRepartitionList = pokemonRepartitionList;
};

/**
 * Vérifie que la répartition des pokémons est bien formée.
 * @param {object} pokemonRepartitionList Répartition à vérifier
 * @throws {Error}
 */
EncounterGenerator.prototype._checkRepartitionList = function(pokemonRepartitionList) {
    if (typeof pokemonRepartitionList !== 'object') {
        throw new Error('Repartition list must be an object.');
    }
    for (var frequencyFactor in pokemonRepartitionList) {
        // Les coefficients de fréquences sont des chaînes, on les converti en entier.
        var numberFactor = Number(frequencyFactor);

        // x % 1 !== 0 est vrai si x n'est pas un entier.
        if (typeof numberFactor !== 'number' || numberFactor % 1 !== 0 || numberFactor < 1) {
            throw new Error('Frequency factors must be positive integers.');
        }
    }
};

/**
 * Set le taux de rencontre global. Le taux passé est contraint sur [0, 1], il
 * représente la probabilité de rencontrer un pokémon (quel qu'il soit) à chaque
 * post.
 * Ce taux est approximatif. Pour obtenir le taux de rencontre effectif, il
 * faut appeler la méthode #getActualEncounterRate().
 *
 * @param {int} wantedEncounterRate Taux de rencontre global souhaité
 */
EncounterGenerator.prototype.setWantedEncounterRate = function(wantedEncounterRate) {
    this._wantedEncounterRate = Math.max(Math.min(wantedEncounterRate, 1), 0);
};

/**
 * @return {float} Taux de rencontre global souhaité
 */
EncounterGenerator.prototype.getWantedEncounterRate = function() {
    return this._wantedEncounterRate;
};

/**
 * @return {float} Taux de rencontre global réel.
 */
EncounterGenerator.prototype.getActualEncounterRate = function() {
    return this._getPokemonCount() / this._encounterPossibilities.length;
};

/**
 * Met à jour les données du générateur en fonction des attributs courants.
 * Cette méthode doit être appelée après la modification d'un attribut
 * pour que celui-ci soit pris en compte.
 */
EncounterGenerator.prototype.update = function() {
    this._generateEncounterPossibilities();
};

/**
 * Génère la liste des rencontres potentielles.
 */
EncounterGenerator.prototype._generateEncounterPossibilities = function() {
    this._encounterPossibilities = [];

    if (this._wantedEncounterRate === 0) {
        return;
    }

    var that = this;
    var addEncounterPossibilities = function(amountToAdd, pokemonIdsToAdd) {
        pokemonIdsToAdd.forEach(function(pokemonId) {
            for (var i = 0; i < amountToAdd; i++) {
                that._encounterPossibilities.push(pokemonId);
            }
        });
    };

    for (var frequencyFactor in this._pokemonRepartitionList) {
        var pokemonIds = this._pokemonRepartitionList[frequencyFactor];
        addEncounterPossibilities(Number(frequencyFactor), pokemonIds);
    }

    // Ajoute des éléments null à la liste de rencontre pour réduire le
    // taux de rencontre à `wantedEncounterRate`.
    var nullPossibilitiesToAdd = this._encounterPossibilities.length /
        this._wantedEncounterRate - this._encounterPossibilities.length;

    for (var i = 0; i < nullPossibilitiesToAdd; i++) {
        this._encounterPossibilities.push(null);
    }

    // Mélange le tableau de rencontres pour éviter les cycles de rencontre
    // trop visibles.
    shuffle(this._encounterPossibilities);
};

/**
 * Retourne le pokémon rencontré pour un ID de post particulier.
 *
 * @param {int} postId ID du post
 * @return {string} ID du pokémon rencontré ou null s'il n'y a pas de
 *         rencontre pour cet ID.
 */
EncounterGenerator.prototype.getEncounterForPost = function(postId) {
    // On divise l'ID du post par MIN_GAP_BETWEEN_POST_IDS pour résoudre les
    // problèmes liés au fait que l'écart minimum entre deux ID de message
    // d'un même topic n'est pas de 1 sur les forums de jeuxvideo.com.
    var dividedId = Math.floor(postId / this.constructor.MIN_GAP_BETWEEN_POST_IDS);
    var encounterIndex = dividedId % this._encounterPossibilities.length;
    return this._encounterPossibilities[encounterIndex];
};

/**
 * Retourne le taux de rencontre du pokémon d'id passé en paramètre.
 *
 * @param {string} pokemonId ID du pokémon
 * @return {float} Probabilité de rencontrer le Pokémon d'ID passé en paramètre
 *         À chaque post, entre 0 et 1.
 */
EncounterGenerator.prototype.getPokemonEncounterRate = function(pokemonId) {
    var pokemonRatio = this.getPokemonRatio(pokemonId);
    return pokemonRatio * this.getActualEncounterRate();
};

/**
 * @return {int} Nombre de posts consécutifs minimum pour que tous les
 * pokémons soient rencontrés au moins une fois.
 */
EncounterGenerator.prototype.getCycleLength = function() {
    return this._encounterPossibilities.length * this.constructor.MIN_GAP_BETWEEN_POST_IDS;
};

/**
 * @param {string} pokemonId ID du pokémon
 * @return {number} proportion du Pokémon d'ID passé en paramètre par rapport
 *         à la masse totale de tous les Pokémons.
 */
EncounterGenerator.prototype.getPokemonRatio = function(pokemonId) {
    var pokemonCount = this._getPokemonCount();

    if (pokemonCount > 0) {
        var numberOfOccurences = this._getNumberOfOccurences(pokemonId);
        return numberOfOccurences / pokemonCount;
    }
    return 0;
};

/**
 * @return {int} Retourne le nombre total de pokémons dans la liste des
 * possibilités de rencontre.
 */
EncounterGenerator.prototype._getPokemonCount = function() {
    var nonNullPossibilities = this._encounterPossibilities.filter(function(el) { return el !== null; });
    return nonNullPossibilities.length;
};

/**
 * @param {string} pokemonId ID du pokémon
 * @return {int} Nombre d'occurences d'un Pokémon dans la liste des rencontres
 * potentielles.
 */
EncounterGenerator.prototype._getNumberOfOccurences = function(pokemonId) {
    var countOccurences = function(occurences, currentId) {
        if (currentId === pokemonId) {
            return occurences + 1;
        }
        return occurences;
    };

    return this._encounterPossibilities.reduce(countOccurences, 0);
};

module.exports = EncounterGenerator;
