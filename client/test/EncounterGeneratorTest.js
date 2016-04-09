require('should');
var _ = require('lodash');

var EncounterGenerator = require('../src/EncounterGenerator');

var generator = null;
var pokemonRepartition = {};

/**
 * Simule un grand nombre de rencontres et retourne le résultat.
 * @returns {object} Rencontres générées
 */
var simulateEncounters = function() {
    var NUMBER_OF_CYCLES = 2;
    var NUMBER_OF_POST_TO_TEST = generator.getCycleLength() * NUMBER_OF_CYCLES;

    // Tente $NUMBER_OF_POST_TO_TEST rencontres et stocke les résultats.
    var encounters = {};

    _.times(NUMBER_OF_POST_TO_TEST, function(postId) {
        var pokemonId = generator.getEncounterForPost(postId);

        if (pokemonId !== null) {
            if (typeof encounters[pokemonId] === 'undefined') {
                encounters[pokemonId] = {
                    count: 0,
                };
            }
            encounters[pokemonId].count++;
        }
    });

    // Calcule le taux de rencontre de chaque Pokémon rencontré.
    _(encounters).forEach(function(currentEncounter, pokemonId) {
        encounters[pokemonId].encounterRate = currentEncounter.count / NUMBER_OF_POST_TO_TEST;
    });
    return encounters;
};

describe('EncounterGenerator', function() {

    beforeEach(function() {
        var ENCOUNTER_RATE = 0.15;

        var NEAR_IMPOSSIBLE_FACTOR = 1;
        var LEGENDARY_FACTOR = 2;
        var RARE_FACTOR = 4;
        var MEDIUM_FACTOR = 6;
        var COMMON_FACTOR = 8;

        pokemonRepartition = [
            { id: 'Rattata', frequencyFactor: COMMON_FACTOR },
            { id: 'Roucool', frequencyFactor: COMMON_FACTOR },
            { id: 'Chenipan', frequencyFactor: COMMON_FACTOR },
            { id: 'Piafabec', frequencyFactor: MEDIUM_FACTOR },
            { id: 'Pikachu', frequencyFactor: MEDIUM_FACTOR },
            { id: 'Tauros', frequencyFactor: RARE_FACTOR },
            { id: 'Artikodin', frequencyFactor: LEGENDARY_FACTOR },
            { id: 'Sulfura', frequencyFactor: LEGENDARY_FACTOR },
            { id: 'Electhor', frequencyFactor: LEGENDARY_FACTOR },
            { id: 'Mew', frequencyFactor: NEAR_IMPOSSIBLE_FACTOR },
        ];

        generator = new EncounterGenerator(pokemonRepartition, ENCOUNTER_RATE);
    });

    describe('#setPokemonRepartitionList()', function() {
        it('should fail when argument is not an array', function() {
            (function() {
                generator.setPokemonRepartitionList('test');
            }).should.throw('Repartition list must be an array.');
        });
        it('should fail when factors are not positive integers', function() {
            (function() {
                generator.setPokemonRepartitionList([{ frequencyFactor: 0.5, id: 'test' }]);
            }).should.throw('Frequency factors must be positive integers.');
        });
        it('should fail when ids are not set', function() {
            (function() {
                generator.setPokemonRepartitionList([{ frequencyFactor: 1 }]);
            }).should.throw('Pokemon ID must be defined.');
        });
    });

    describe('#setWantedEncounterRate()', function() {
        it('should have an upper limit of 1', function() {
            var tooHighRate = 2;
            generator.setWantedEncounterRate(tooHighRate);
            generator.getWantedEncounterRate().should.be.eql(1);
        });

        it('should have a lower limit of 0', function() {
            var tooLowRate = -1;
            generator.setWantedEncounterRate(tooLowRate);
            generator.getWantedEncounterRate().should.be.eql(0);
        });

        it('should keep a value between 0 and 1', function() {
            var goodRate = 0;
            generator.setWantedEncounterRate(goodRate);
            generator.getWantedEncounterRate().should.be.eql(goodRate);

            goodRate = 0.5;
            generator.setWantedEncounterRate(goodRate);
            generator.getWantedEncounterRate().should.be.eql(goodRate);

            goodRate = 1;
            generator.setWantedEncounterRate(goodRate);
            generator.getWantedEncounterRate().should.be.eql(goodRate);
        });
    });

    describe('#getPokemonRatio()', function() {
        it('should get the correct ratio for each Pokémon', function() {

            // Compte le nombre de Pokémon pour calculer le ratio manuellement.
            var pokemonCount = 0;
            pokemonRepartition.forEach(function(pokemon) {
                pokemonCount += pokemon.frequencyFactor;
            });

            // Vérifie le ratio de chaque Pokémon.
            pokemonRepartition.forEach(function(pokemon) {
                var expectedRatio;

                // Si le taux de rencontre est nul, le ratio est nul, lui-aussi.
                if (generator.getWantedEncounterRate() === 0) {
                    expectedRatio = 0;
                }
                else {
                    expectedRatio = pokemon.frequencyFactor / pokemonCount;
                }
                generator.getPokemonRatio(pokemon.id).should.be.eql(expectedRatio);
            });
        });
    });

    describe('#getPokemonEncounterRate()', function() {
        it('should get the right encounter rate for each Pokémon', function() {

            // Compte le nombre de Pokémon pour calculer le taux de rencontre manuellement.
            var pokemonCount = 0;
            pokemonRepartition.forEach(function(pokemon) {
                pokemonCount += pokemon.frequencyFactor;
            });

            // Vérifie le taux de rencontre de chaque Pokémon.
            pokemonRepartition.forEach(function(pokemon) {
                var ratio = pokemon.frequencyFactor / pokemonCount;
                var expectedRate = ratio * generator.getActualEncounterRate();
                generator.getPokemonEncounterRate(pokemon.id).should.be.eql(expectedRate);
            });
        });
    });

    /**
     * Vérifie que le taux de rencontre des Pokémon de chaque groupe soit bon.
     */
    describe('encounter proportions', function() {
        it('should be right for each Pokémon', function() {
            var DELTA = 0.0000001;
            var encounters = simulateEncounters();
            pokemonRepartition.forEach(function(pokemon) {
                var expectedRate = generator.getPokemonEncounterRate(pokemon.id);
                encounters[pokemon.id].encounterRate.should.be.approximately(expectedRate, DELTA);
            });
        });
    });
});
