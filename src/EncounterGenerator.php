<?php

/**
 * Permet de générer des rencontres de pokémons à partir d'ID de posts sur les
 * forums de jeuxvideo.com.
 */
class EncounterGenerator {

    private $pokemonRepartitionList = [];
    private $encounterPossibilities = [];

    /**
     * @param array $pokemonRepartitionList Liste des différents id de pokémons
     * classés par coefficient de fréquence, de la forme :
     * [
     *     1 => ['Mew', 'Mewtwo'], // coefficient 1, les plus rares
     *     4 => ['Pikachu'], // 4 fois plus fréquents que ceux du dessus
     *     10 => ['Rattata', 'Roucool', 'Chenipan'], // 10 fois plus fréquents que ceux du dessus
     * ]
     *
     * Les coefficients doivent être des entiers positifs.
     */
    public function __construct($pokemonRepartitionList = []) {
        $this->checkRepartitionList($pokemonRepartitionList);
        $this->pokemonRepartitionList = $pokemonRepartitionList;
        $this->generateEncounterPossibilities();
        $this->pokemonShuffle();
    }

    /**
     * Vérifie que la répartition passée en paramètre est bien formée.
     * @throws \Exception
     */
    private function checkRepartitionList($pokemonRepartitionList) {
        if (!is_array($pokemonRepartitionList)) {
            throw new \Exception('Repartition list must be an array.');
        }

        foreach (array_keys($pokemonRepartitionList) as $frequencyFactor) {
            if (!is_int($frequencyFactor)) {
                throw new \Exception('Frequency factors must be positive integers.');
            }
        }
    }

    /**
     * Génère la liste des rencontres potentielles.
     */
    private function generateEncounterPossibilities() {
        $this->encounterPossibilities = [];

        foreach ($this->pokemonRepartitionList as $frequencyFactor => $pokemonIds) {
            foreach ($pokemonIds as $pokemonId) {
                for ($i = 0; $i < $frequencyFactor; $i++) {
                    $this->encounterPossibilities[] = $pokemonId;
                }
            }
        }

        $this->padEncounterPossibilitiesToPowerOfTwoElements();
    }

    /**
     * Mélange le tableau de rencontres potentielles.
     */
    private function pokemonShuffle() {
        shuffle($this->encounterPossibilities);
    }

    /**
     * Ajoute des éléments nulls à la liste des rencontres potentielles jusqu'à
     * ce qu'elle fasse une taille de 2^x éléments.
     */
    private function padEncounterPossibilitiesToPowerOfTwoElements() {
        $closestPowerOfTwo = self::closestPowerOfTwo(count($this->encounterPossibilities));
        $this->encounterPossibilities = array_pad(
            $this->encounterPossibilities, $closestPowerOfTwo, null
        );
    }

    /**
     * Retourne 2^n avec n valant la plus petite valeur entière qui vérifie
     * 2^n >= $number.
     */
    private static function closestPowerOfTwo($number) {
        return pow(2, ceil(log($number) / log(2)));
    }

    /**
     * Retourne le pokémon rencontré pour un ID de post particulier.
     * @return string ID du pokémon rencontré ou null s'il n'y a pas de
     *         rencontre pour cet ID.
     * @throws \Exception si la taille du tableau des rencontre potentielles
     *         n'est pas une puissance de deux.
     */
    public function getEncounterForPost($postId) {
        if (!self::isPowerOfTwo(count($this->encounterPossibilities))) {
            throw new \Exception(
                'count($this->encounterPossibilities) must be a power of two.'
            );
        }

        // Élimine les trois derniers bits de l'ID du post.
        // Résout les problèmes liés au fait que l'écart minimum entre deux ID
        // de messages d'un même topic est de 8 sur les forums de jeuxvideo.com.
        $bits = $postId >> 3;
        $index = $bits & (1 << log(count($this->encounterPossibilities), 2)) - 1;

        return $this->encounterPossibilities[$index];
    }

    private static function isPowerOfTwo($number) {
        return !($number & ($number - 1));
    }

    /**
     * Retourne le taux de rencontre du pokémon d'id passé en paramètre.
     *
     * @param string $pokemonId
     * @return float Taux de rencontre entre 0 et 1.
     */
    public function getEncounterRate($pokemonId) {

        $pokemonCount = count($this->encounterPossibilities);
        // On retire les éléments null pour pouvoir utiliser array_count_values.
        $pokemonOccurenceList = array_count_values(array_filter($this->encounterPossibilities));

        $rate = 0;
        if (isset($pokemonOccurenceList[$pokemonId]) && $pokemonCount > 0) {
            $rate = $pokemonOccurenceList[$pokemonId] / $pokemonCount;
        }

        return $rate;
    }
}
