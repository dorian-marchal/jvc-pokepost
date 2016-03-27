<?php

class EncounterGeneratorTest extends PHPUnit_Framework_TestCase {

    const NEAR_IMPOSSIBLE_FACTOR = 1;
    const LEGENDARY_FACTOR = 2;
    const RARE_FACTOR = 4;
    const MEDIUM_FACTOR = 6;
    const COMMON_FACTOR = 8;

    private $pokemonRepartition = [
        self::COMMON_FACTOR => [
            'Rattata',
            'Roucool',
            'Chenipan',
        ],
        self::MEDIUM_FACTOR => [
            'Piafabec',
            'Pikachu',
        ],
        self::RARE_FACTOR => [
            'Tauros',
        ],
        self::LEGENDARY_FACTOR => [
            'Artikodin',
            'Sulfura',
            'Electhor',
        ],
        self::NEAR_IMPOSSIBLE_FACTOR => [
            'Mew',
        ],
    ];

    private $generator = null;

    public function __construct() {
        $this->generator = new EncounterGenerator($this->pokemonRepartition, 0.15);
    }

    public function testSetPokemonRepartitionListNotArray() {
        $this->setExpectedException('InvalidArgumentException');
        $this->generator->setPokemonRepartitionList('test');
    }

    public function testSetPokemonRepartitionListBadFactors() {
        $this->setExpectedException('InvalidArgumentException');
        $this->generator->setPokemonRepartitionList([
            0.5 => ['test'],
        ]);
    }

    public function testSetWantedEncounterRate() {
        // Vérifie la limite haute (1).
        $this->generator->setWantedEncounterRate(2);
        $this->assertEquals(1, $this->generator->getWantedEncounterRate());

        // Vérifie la limite basse (0).
        $this->generator->setWantedEncounterRate(-1);
        $this->assertEquals(0, $this->generator->getWantedEncounterRate());

        // Vérifie la conservation du taux quand il est dans les bornes.
        $this->generator->setWantedEncounterRate(0);
        $this->assertEquals(0, $this->generator->getWantedEncounterRate());

        $this->generator->setWantedEncounterRate(0.5);
        $this->assertEquals(0.5, $this->generator->getWantedEncounterRate());

        $this->generator->setWantedEncounterRate(1);
        $this->assertEquals(1, $this->generator->getWantedEncounterRate());
    }

    public function testGetPokemonRatio() {
        // Compte le nombre de Pokémon pour calculer le ratio manuellement.
        $pokemonCount = 0;
        foreach ($this->pokemonRepartition as $frequencyFactor => $pokemonIds) {
            $pokemonCount += $frequencyFactor * count($pokemonIds);
        }

        // Vérifie le ratio de chaque Pokémon.
        foreach ($this->pokemonRepartition as $frequencyFactor => $pokemonIds) {
            // Si le taux de rencontre est nul, le ratio est nul, lui-aussi.
            if ($this->generator->getWantedEncounterRate() === 0) {
                $expectedRatio = 0;
            } else {
                $expectedRatio = $frequencyFactor / $pokemonCount;
            }
            foreach ($pokemonIds as $pokemonId) {
                $this->assertEquals($expectedRatio, $this->generator->getPokemonRatio($pokemonId));
            }
        }
    }

    public function testGetPokemonEncounterRate() {
        // Compte le nombre de Pokémon pour calculer le taux de rencontre manuellement.
        $pokemonCount = 0;
        foreach ($this->pokemonRepartition as $frequencyFactor => $pokemonIds) {
            $pokemonCount += $frequencyFactor * count($pokemonIds);
        }

        // Vérifie le taux de rencontre de chaque Pokémon.
        foreach ($this->pokemonRepartition as $frequencyFactor => $pokemonIds) {
            $ratio = $frequencyFactor / $pokemonCount;
            $expectedRate = $ratio * $this->generator->getActualEncounterRate();
            foreach ($pokemonIds as $pokemonId) {
                $this->assertEquals($expectedRate, $this->generator->getPokemonEncounterRate($pokemonId));
            }
        }
    }

    /**
     * Vérifie que le taux de rencontre des Pokémon de chaque groupe soit bon.
     */
    public function testEncounterProportion() {
        $DELTA = 0.0000001;
        $encounters = $this->simulateEncounters();
        foreach ($this->pokemonRepartition as $frequencyFactor => $pokemonIds) {
            foreach ($pokemonIds as $pokemonId) {
                $expectedRate = $this->generator->getPokemonEncounterRate($pokemonId);
                $this->assertEquals(
                    $expectedRate,
                    $encounters[$pokemonId]['encounterRate'],
                    '',
                    $DELTA
                );
            }
        }
    }

    /**
     * Simule un grand nombre de rencontres et retourne le résultat.
     */
    private function simulateEncounters() {
        $NUMBER_OF_POST_TO_TEST = $this->generator->getCycleLength() * 2;

        // Tente $NUMBER_OF_POST_TO_TEST rencontres et stocke les résultats.
        $encounters = [];
        $encounterCount = 0;

        for ($postId = 0; $postId < $NUMBER_OF_POST_TO_TEST; $postId++) {
            $pokemonId = $this->generator->getEncounterForPost($postId);

            $encounterCount++;

            if (is_null($pokemonId)) {
                continue;
            }

            if (!isset($encounters[$pokemonId])) {
                $encounters[$pokemonId] = [
                    'count' => 0,
                ];
            }
            $encounters[$pokemonId]['count']++;
        }

        // Calcule le taux de rencontre de chaque Pokémon rencontré.
        foreach ($encounters as $pokemonId => &$currentEncounter) {
            $currentEncounter['encounterRate'] = $currentEncounter['count'] / $encounterCount;
        }
        unset($currentEncounter);

        return $encounters;
    }
}
