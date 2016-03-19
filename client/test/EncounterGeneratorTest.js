var should = require('should');
var _ = require('lodash');

var EncounterGenerator = require('../src/EncounterGenerator');

var generator = null;
var pokemonRepartition = {};

/**
 * Simule un grand nombre de rencontres et retourne le résultat.
 */
var simulateEncounters = function() {
    var NUMBER_OF_POST_TO_TEST = generator.getCycleLength() * 2;

    // Tente $NUMBER_OF_POST_TO_TEST rencontres et stocke les résultats.
    var encounters = {};

    for (var postId = 0; postId < NUMBER_OF_POST_TO_TEST; postId++) {
        var pokemonId = generator.getEncounterForPost(postId);

        if (pokemonId === null) {
            continue;
        }

        if (encounters[pokemonId] === undefined) {
            encounters[pokemonId] = {
                count: 0,
            };
        }
        encounters[pokemonId].count++;
    }

    // Calcule le taux de rencontre de chaque pokémon rencontré.
    _(encounters).forEach(function(currentEncounter, pokemonId) {
        encounters[pokemonId].encounterRate = currentEncounter.count / NUMBER_OF_POST_TO_TEST;
    });
    return encounters;
};

describe('EncounterGenerator', function() {

    beforeEach(function() {
        var NEAR_IMPOSSIBLE_FACTOR = 1;
        var LEGENDARY_FACTOR = 2;
        var RARE_FACTOR = 4;
        var MEDIUM_FACTOR = 6;
        var COMMON_FACTOR = 8;

        pokemonRepartition = {};
        pokemonRepartition[COMMON_FACTOR] = [
            'Rattata',
            'Roucool',
            'Chenipan',
        ];
        pokemonRepartition[MEDIUM_FACTOR] = [
            'Piafabec',
            'Pikachu',
        ];
        pokemonRepartition[RARE_FACTOR] = [
            'Tauros',
        ];
        pokemonRepartition[LEGENDARY_FACTOR] = [
            'Artikodin',
            'Sulfura',
            'Electhor',
        ];
        pokemonRepartition[NEAR_IMPOSSIBLE_FACTOR] = [
            'Mew',
        ];

        generator = new EncounterGenerator(pokemonRepartition, 0.15);
    });

    describe('#setPokemonRepartitionList()', function() {
        it('should fail when argument is not an object', function() {
            (function() {
                generator.setPokemonRepartitionList('test');
            }).should.throw('Repartition list must be an object.');
        });
        it('should fail when factors are not positive integers', function() {
            (function() {
                generator.setPokemonRepartitionList({0.5: ['test']});
            }).should.throw('Frequency factors must be positive integers.');
        });
    });

    describe('#setWantedEncounterRate()', function() {
        it('should have an upper limit of 1', function() {
            generator.setWantedEncounterRate(2);
            generator.getWantedEncounterRate().should.be.eql(1);
        });

        it('should have a lower limit of 0', function() {
            generator.setWantedEncounterRate(-1);
            generator.getWantedEncounterRate().should.be.eql(0);
        });

        it('should keep a value between 0 and 1', function() {
            generator.setWantedEncounterRate(0.5);
            generator.getWantedEncounterRate().should.be.eql(0.5);
        });
    });

    describe('#getPokemonRatio()', function() {
        it('should get the correct ratio for each pokemon', function() {
            // Compte le nombre de pokémons pour calculer le ratio manuellement.
            var pokemonCount = 0;
            _(pokemonRepartition).forEach(function(pokemonIds, frequencyFactor) {
                pokemonCount += frequencyFactor * pokemonIds.length;
            });

            // Vérifie le ratio de chaque Pokémon.
            _(pokemonRepartition).forEach(function(pokemonIds, frequencyFactor) {
                // Si le taux de rencontre est nul, le ratio est nul, lui-aussi.
                if (generator.getWantedEncounterRate() === 0) {
                    var expectedRatio = 0;
                } else {
                    var expectedRatio = frequencyFactor / pokemonCount;
                }
                pokemonIds.forEach(function(pokemonId) {
                    generator.getPokemonRatio(pokemonId).should.be.eql(expectedRatio);
                });
            });
        });
    });

    describe('#getPokemonEncounterRate()', function() {
        it('should get the right encounter rate for each pokemon', function() {
            // Compte le nombre de pokémons pour calculer le taux de rencontre manuellement.
            var pokemonCount = 0;
            _(pokemonRepartition).forEach(function(pokemonIds, frequencyFactor) {
                pokemonCount += frequencyFactor * pokemonIds.length;
            });

            // Vérifie le taux de rencontre de chaque Pokémon.
            _(pokemonRepartition).forEach(function(pokemonIds, frequencyFactor) {
                var ratio = frequencyFactor / pokemonCount;
                var expectedRate = ratio * generator.getActualEncounterRate();
                pokemonIds.forEach(function(pokemonId) {
                    generator.getPokemonEncounterRate(pokemonId).should.be.eql(expectedRate);
                });
            });
        });
    });

    /**
     * Vérifie que le taux de rencontre des pokémons de chaque groupe soit bon.
     */
    describe('encounter proportions', function() {
        it('should be right for each pokemon group', function() {
            var DELTA = 0.0000001;
            var encounters = simulateEncounters();
            _(pokemonRepartition).forEach(function(pokemonIds, frequencyFactor) {
                pokemonIds.forEach(function(pokemonId) {
                    var expectedRate = generator.getPokemonEncounterRate(pokemonId);
                    encounters[pokemonId].encounterRate.should.be.approximately(expectedRate, DELTA);
                });
            });
        });
    });
});
