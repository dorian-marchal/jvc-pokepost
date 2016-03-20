<?php

/**
 * Permet de générer des rencontres de pokémons à partir d'ID de posts sur les
 * forums de jeuxvideo.com.
 */
class EncounterGenerator {

    /**
     * Écart minimum entre deux ID de post sur un même topic de jeuxvideo.com.
     * @var int
     */
    const MIN_GAP_BETWEEN_POST_IDS = 8;

    private $pokemonRepartitionList = [];
    private $encounterPossibilities = [];

    /**
     * @var float Probabilité de rencontrer n'importe quel pokémon à chaque
     *      post (entre 0 et 1).
     */
    private $wantedEncounterRate = 1;

    /**
     * @param array pokemonRepartitionList Liste de répartition des pokémons.
     *        Voir #setPokemonRepartitionList() pour plus d'informations.
     * @param float wantedEncounterRate Taux de rencontre global souhaité.
     */
    public function __construct($pokemonRepartitionList, $wantedEncounterRate) {
        $this->setPokemonRepartitionList($pokemonRepartitionList);
        $this->setWantedEncounterRate($wantedEncounterRate);
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
            throw new \InvalidArgumentException('Repartition list must be an array.');
        }

        foreach (array_keys($pokemonRepartitionList) as $frequencyFactor) {
            if (!is_int($frequencyFactor) || $frequencyFactor < 1) {
                throw new \InvalidArgumentException('Frequency factors must be positive integers.');
            }
        }
    }

    /**
     * Set le taux de rencontre global. Le taux passé est contraint sur [0, 1], il
     * représente la probabilité de rencontrer un pokémon (quel qu'il soit) à chaque
     * post.
     * Ce taux est approximatif. Pour obtenir le taux de rencontre effectif, il
     * faut appeler la méthode #getActualEncounterRate().
     * @param int $wantedEncounterRate
     */
    public function setWantedEncounterRate($wantedEncounterRate) {
        $this->wantedEncounterRate = max(min($wantedEncounterRate, 1), 0);
    }

    /**
     * @return float
     */
    public function getWantedEncounterRate() {
        return $this->wantedEncounterRate;
    }

    /**
     * @return float Taux de rencontre global réel.
     */
    public function getActualEncounterRate() {
        return $this->getPokemonCount() / count($this->encounterPossibilities);
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

        if ($this->wantedEncounterRate === 0) {
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
        // taux de rencontre à $wantedEncounterRate.
        $this->encounterPossibilities = array_pad($this->encounterPossibilities,
            (int) (count($this->encounterPossibilities) / $this->wantedEncounterRate), null);

        // Mélange le tableau de rencontres pour éviter les cycles de rencontre
        // trop visibles.
        shuffle($this->encounterPossibilities);
    }

    /**
     * Retourne le pokémon rencontré pour un ID de post particulier.
     * @param int postId ID du post
     * @return string ID du pokémon rencontré ou null s'il n'y a pas de
     *         rencontre pour cet ID.
     */
    public function getEncounterForPost($postId) {
        // On divise l'ID du post par MIN_GAP_BETWEEN_POST_IDS pour résoudre les
        // problèmes liés au fait que l'écart minimum entre deux ID de message
        // d'un même topic n'est pas de 1 sur les forums de jeuxvideo.com.
        $dividedId = floor($postId / self::MIN_GAP_BETWEEN_POST_IDS);
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
        return $pokemonRatio * $this->getActualEncounterRate();
    }

    /**
     * Retourne le nombre de posts consécutifs minimum pour que tous les
     * pokémons soient rencontrés au moins une fois.
     * @return int
     */
    public function getCycleLength() {
        return count($this->encounterPossibilities) * self::MIN_GAP_BETWEEN_POST_IDS;
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
        $countOccurences = function ($occurences, $currentId) use ($pokemonId) {
            if ($currentId === $pokemonId) {
                $occurences++;
            }
            return $occurences;
        };

        return array_reduce($this->encounterPossibilities, $countOccurences, 0);
    }
}
