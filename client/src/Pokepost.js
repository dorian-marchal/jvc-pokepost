var EncounterGenerator = require('./EncounterGenerator');
var PageUtil = require('./util/PageUtil');
var PokepostConfig = require('./config/pokemon-data.json');

var Pokepost = function() {};

Pokepost.prototype = {
    constructor: Pokepost,

    init: function() {
        // Génère l'éventuelle rencontre sur la page courante.
        var newPost = PageUtil.getNewlySentPost(PokepostConfig.postMaxAgeMs);

        if (newPost !== null) {
            var generator = new EncounterGenerator(PokepostConfig.pokemonList, PokepostConfig.globalEncounterRate);
            var encounter = generator.getEncounterForPost(newPost.id);
            console.log(encounter);
        }
    },
};

module.exports = Pokepost;
