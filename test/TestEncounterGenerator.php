<?php

class TestEncounterGenerator extends PHPUnit_Framework_TestCase {

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

    /**
     * Vérifie que le ratio des pokémons de chaque groupe par rapport à
     * celui d'un étalon (un pokémon de coefficient de fréquence 1) soit bon.
     */
    public function testEncounterProportion() {

        $encounters = $this->simulateEncounters();

        // Taux de différence autorisé dans les proportions par rapport à celles demandées.
        $DELTA_PERCENT = 5;

        // Récupère le ratio du pokémon le plus rare pour le comparer avec celui
        // des autres groupes.
        $rarestId = current($this->pokemonRepartition[self::NEAR_IMPOSSIBLE_FACTOR]);
        $rarestRatio = $encounters[$rarestId]['ratio'];

        foreach (array_keys($this->pokemonRepartition) as $frequencyFactor) {
            foreach ($this->pokemonRepartition[$frequencyFactor] as $pokemonId) {
                $this->assertEquals(
                    $encounters[$pokemonId]['ratio'],
                    $rarestRatio * $frequencyFactor,
                    '',
                    $DELTA_PERCENT / 100 * ($rarestRatio * $frequencyFactor)
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

        $encounterGenerator = new EncounterGenerator($this->pokemonRepartition);

        // Tente $NUMBER_OF_POST_TO_TEST rencontres et stocke les résultats.
        $encounters = [];
        $encounterCount = 0;

        $firstPostId = mt_rand($INITIAL_POST_MIN_ID, $INITIAL_POST_MAX_ID);
        for ($postId = $firstPostId; $postId < ($firstPostId + $NUMBER_OF_POST_TO_TEST); $postId++) {
            $pokemonId = $encounterGenerator->getEncounterForPost($postId);

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

        // Calcule le ratio de recontre de chaque pokémon rencontré.
        foreach ($encounters as $pokemonId => &$currentEncounter) {
            $currentEncounter['ratio'] = $currentEncounter['count'] / $encounterCount;
        }
        unset($currentEncounter);

        return $encounters;
    }
}
