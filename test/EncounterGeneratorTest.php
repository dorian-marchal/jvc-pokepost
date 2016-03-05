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
        $this->generator = new EncounterGenerator();
        $this->generator->setPokemonRepartitionList($this->pokemonRepartition);
        $this->generator->setEncounterRate(0.1);
        $this->generator->update();
    }

    public function testSetEncounterRate() {
        // Vérifie la limite haute (1).
        $this->generator->setEncounterRate(2);
        $this->assertEquals(1, $this->generator->getEncounterRate());

        // Vérifie la limite basse (0).
        $this->generator->setEncounterRate(-1);
        $this->assertEquals(0, $this->generator->getEncounterRate());

        // Vérifie la conservation du taux quand il est dans les bornes.
        $this->generator->setEncounterRate(0.5);
        $this->assertEquals(0.5, $this->generator->getEncounterRate());
    }

    public function testGetPokemonRatio() {

        // Compte le nombre de pokémons pour calculer le ratio manuellement.
        $pokemonCount = 0;
        foreach ($this->pokemonRepartition as $frequencyFactor => $pokemonIds) {
            $pokemonCount += $frequencyFactor * count($pokemonIds);
        }

        // Vérifie le ratio de chaque Pokémon.
        foreach ($this->pokemonRepartition as $frequencyFactor => $pokemonIds) {
            // Si le taux de rencontre est nul, le ratio est nul, lui-aussi.
            if ($this->generator->getEncounterRate() === 0) {
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
        // Compte le nombre de pokémons pour calculer le taux de rencontre manuellement.
        $pokemonCount = 0;
        foreach ($this->pokemonRepartition as $frequencyFactor => $pokemonIds) {
            $pokemonCount += $frequencyFactor * count($pokemonIds);
        }

        // Vérifie le taux de rencontre de chaque Pokémon.
        foreach ($this->pokemonRepartition as $frequencyFactor => $pokemonIds) {
            $ratio = $frequencyFactor / $pokemonCount;
            $expectedRate = $ratio * $this->generator->getEncounterRate();
            foreach ($pokemonIds as $pokemonId) {
                $this->assertEquals($expectedRate, $this->generator->getPokemonEncounterRate($pokemonId));
            }
        }
    }

    /**
     * Vérifie que le taux de rencontre des pokémons de chaque groupe par rapport
     * à celui d'un étalon (un pokémon de coefficient de fréquence 1) soit bon.
     */
    public function tesstEncounterProportion() {

        $encounters = $this->simulateEncounters();

        // Taux de différence autorisé par rapport aux proportions attendues.
        $DELTA = 0.01;

        foreach (array_keys($this->pokemonRepartition) as $frequencyFactor) {
            foreach ($this->pokemonRepartition[$frequencyFactor] as $pokemonId) {

                $expectedRate = $this->generator->getPokemonEncounterRate($pokemonId);
                $this->assertEquals(
                    $expectedRate,
                    $encounters[$pokemonId]['encounterRate'],
                    '',
                    $DELTA * $expectedRate
                );
            }
        }
    }

    /**
     * Simule un grand nombre de rencontres et retourne le résultat.
     */
    private function simulateEncounters() {

        $INITIAL_POST_MIN_ID = 0;
        $INITIAL_POST_MAX_ID = 100000;
        $NUMBER_OF_POST_TO_TEST = 100000;

        // Tente $NUMBER_OF_POST_TO_TEST rencontres et stocke les résultats.
        $encounters = [];
        $encounterCount = 0;

        $firstPostId = mt_rand($INITIAL_POST_MIN_ID, $INITIAL_POST_MAX_ID);
        for ($postId = $firstPostId; $postId < ($firstPostId + $NUMBER_OF_POST_TO_TEST); $postId++) {
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

        // Calcule le taux de rencontre de chaque pokémon rencontré.
        foreach ($encounters as $pokemonId => &$currentEncounter) {
            $currentEncounter['encounterRate'] = $currentEncounter['count'] / $encounterCount;
        }
        unset($currentEncounter);

        return $encounters;
    }
}
