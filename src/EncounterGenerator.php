<?php

/**
 * Permet de générer des rencontres de pokémons à partir d'ID de posts sur les
 * forums de jeuxvideo.com.
 */
class EncounterGenerator {

    private $pokemonRepartitionList = [];
    private $encounterPossibilities = [];
    /**
     * @var float Probabilité de rencontrer n'importe quel pokémon à chaque
     *      post (entre 0 et 1).
     */
    private $encounterRate = 1;

    public function __construct($pokemonRepartitionList, $encounterRate) {
        $this->setPokemonRepartitionList($pokemonRepartitionList);
        $this->setEncounterRate($encounterRate);
        $this->update();
    }

    /**
     * Modifie la liste de répartition des pokémons.
     *
     * @param array $pokemonRepartitionList Liste des différents id de pokémons
     * classés par coefficient de fréquence, de la forme :
     * [
     *     1 => ['Mew', 'Mewtwo'], // coefficient 1, les plus rares
     *     4 => ['Pikachu'], // 4 fois plus fréquents que ceux du dessus
     *     10 => ['Rattata', 'Roucool'], // 10 fois plus fréquents que ceux du dessus
     * ]
     * Les coefficients doivent être des entiers positifs.
     *
     * @throws \Exception si la liste passée est mal formée.
     */
    public function setPokemonRepartitionList($pokemonRepartitionList) {
        $this->checkRepartitionList($pokemonRepartitionList);
        $this->pokemonRepartitionList = $pokemonRepartitionList;
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
     * Set le taux de rencontre. Le taux passé est contraint sur [0, 1].
     * @param int $encounterRate
     */
    public function setEncounterRate($encounterRate) {
        $this->encounterRate = max(min($encounterRate, 1), 0);
    }

    public function getEncounterRate() {
        return $this->encounterRate;
    }

    /**
     * Met à jour les données du générateur en fonction des attributs courants.
     * Cette méthode doit être appelée après la modification d'un attribut
     * pour que celui-ci soit pris en compte.
     */
    public function update() {
        $this->generateEncounterPossibilities();
    }

    /**
     * Génère la liste des rencontres potentielles.
     */
    private function generateEncounterPossibilities() {
        $this->encounterPossibilities = [];

        if ($this->encounterRate === 0) {
            return;
        }

        foreach ($this->pokemonRepartitionList as $frequencyFactor => $pokemonIds) {
            foreach ($pokemonIds as $pokemonId) {
                for ($i = 0; $i < $frequencyFactor; $i++) {
                    $this->encounterPossibilities[] = $pokemonId;
                }
            }
        }

        // Ajoute des éléments null à la liste de rencontre pour réduire le
        // taux de rencontre à $encounterRate.
        $this->encounterPossibilities = array_pad($this->encounterPossibilities,
            (int) (count($this->encounterPossibilities) / $this->encounterRate), null);

        // Mélange le tableau de rencontres pour éviter les cycles de rencontre
        // trop visibles.
        shuffle($this->encounterPossibilities);
    }

    /**
     * Retourne le pokémon rencontré pour un ID de post particulier.
     * @return string ID du pokémon rencontré ou null s'il n'y a pas de
     *         rencontre pour cet ID.
     */
    public function getEncounterForPost($postId) {
        // On divise l'ID du post par 8 pour résoudre les problèmes liés au fait
        // que l'écart minimum entre deux ID de message d'un même topic est de 8
        // sur les forums de jeuxvideo.com.
        $dividedId = floor($postId / 8);
        $encounterIndex = $dividedId % count($this->encounterPossibilities);

        return $this->encounterPossibilities[$encounterIndex];
    }

    /**
     * Retourne le taux de rencontre du pokémon d'id passé en paramètre.
     *
     * @param string $pokemonId
     * @return float Probabilité de rencontrer le Pokémon d'ID passé en paramètre
     *         À chaque post, entre 0 et 1.
     */
    public function getPokemonEncounterRate($pokemonId) {
        $pokemonRatio = $this->getPokemonRatio($pokemonId);
        return $pokemonRatio * $this->encounterRate;
    }

    /**
     * Retourne la proportion du Pokémon d'ID passé en paramètre par rapport
     * à la masse totale de tous les Pokémons.
     * @param string $pokemonId
     * @return float
     */
    public function getPokemonRatio($pokemonId) {
        $pokemonCount = $this->getPokemonCount();

        if ($pokemonCount > 0) {
            $numberOfOccurences = $this->getNumberOfOccurences($pokemonId);
            return $numberOfOccurences / $pokemonCount;
        }
        return 0;
    }

    /**
     * @return int Retourne le nombre total de pokémons dans la liste des
     * possibilités de rencontre.
     */
    private function getPokemonCount() {
        return count(array_filter($this->encounterPossibilities));
    }

    /**
     * @return int Nombre d'occurences d'un Pokémon dans la liste des rencontres
     * potentielles.
     */
    private function getNumberOfOccurences($pokemonId) {

        $incrementNumberOfOccurences = function ($occurences, $possibility) use ($pokemonId) {
            if ($possibility === $pokemonId) {
                $occurences++;
            }
            return $occurences;
        };

        return array_reduce($this->encounterPossibilities, $incrementNumberOfOccurences, 0);
    }
}
