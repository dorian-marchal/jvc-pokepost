var FrequencyFactor = {
    VeryCommon: 12,
    Common: 8,
    Medium: 6,
    Rare: 4,
    Legendary: 2,
    NearImpossible: 1,
};

module.exports = {

    /**
     * Âge maximum d'un post en millisecondes pour qu'il soit considéré comme
     * "récent" et donc être éligible pour une rencontre.
     * @type {Number}
     */
    postMaxAgeMs: 300000, // 5 * 60 * 1000 = 5 minutes

    /**
     * Probabilité de rencontrer un Pokémon à chaque post
     * (voir le constructeur d'EncounterGenerator ).
     * @type {Number}
     */
    globalEncounterRate: 0.35,

    /**
     * Liste des Pokémon capturables.
     * @type {object[]} Liste de Pokémon du type : {
     *     id: Identifiant unique du Pokémon
     *     name: Nom du Pokémon
     *     frequencyFactor: Entier positif représentant le coefficient de fréquence
     *         (voir EncounterGenerator#setPokemonRepartitionList)
     * }
     */
    pokemonList: [
        {
            id: 1,
            name: 'Bulbizarre',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 2,
            name: 'Herbizarre',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 3,
            name: 'Florizarre',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 4,
            name: 'Salamèche',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 5,
            name: 'Reptincel',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 6,
            name: 'Dracaufeu',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 7,
            name: 'Carapuce',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 8,
            name: 'Carabaffe',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 9,
            name: 'Tortank',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 10,
            name: 'Chenipan',
            frequencyFactor: FrequencyFactor.VeryCommon,
        },
        {
            id: 11,
            name: 'Chrysacier',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 12,
            name: 'Papilusion',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 13,
            name: 'Aspicot',
            frequencyFactor: FrequencyFactor.VeryCommon,
        },
        {
            id: 14,
            name: 'Coconfort',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 15,
            name: 'Dardargnan',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 16,
            name: 'Roucool',
            frequencyFactor: FrequencyFactor.VeryCommon,
        },
        {
            id: 17,
            name: 'Roucoups',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 18,
            name: 'Roucarnage',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 19,
            name: 'Rattata',
            frequencyFactor: FrequencyFactor.VeryCommon,
        },
        {
            id: 20,
            name: 'Rattatac',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 21,
            name: 'Piafabec',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 22,
            name: 'Rapasdepic',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 23,
            name: 'Abo',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 24,
            name: 'Arbok',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 25,
            name: 'Pikachu',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 26,
            name: 'Raichu',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 27,
            name: 'Sabelette',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 28,
            name: 'Sablaireau',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 29,
            name: 'Nidoran♀',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 30,
            name: 'Nidorina',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 31,
            name: 'Nidoqueen',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 32,
            name: 'Nidoran♂',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 33,
            name: 'Nidorino',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 34,
            name: 'Nidoking',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 35,
            name: 'Mélofée',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 36,
            name: 'Mélodelfe',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 37,
            name: 'Goupix',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 38,
            name: 'Feunard',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 39,
            name: 'Rondoudou',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 40,
            name: 'Grodoudou',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 41,
            name: 'Nosferapti',
            frequencyFactor: FrequencyFactor.VeryCommon,
        },
        {
            id: 42,
            name: 'Nosferalto',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 43,
            name: 'Mystherbe',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 44,
            name: 'Ortide',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 45,
            name: 'Rafflésia',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 46,
            name: 'Paras',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 47,
            name: 'Parasect',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 48,
            name: 'Mimitoss',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 49,
            name: 'Aéromite',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 50,
            name: 'Taupiqueur',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 51,
            name: 'Triopikeur',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 52,
            name: 'Miaouss',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 53,
            name: 'Persian',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 54,
            name: 'Psykokwak',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 55,
            name: 'Akwakwak',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 56,
            name: 'Férosinge',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 57,
            name: 'Colossinge',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 58,
            name: 'Caninos',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 59,
            name: 'Arcanin',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 60,
            name: 'Ptitard',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 61,
            name: 'Têtarte',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 62,
            name: 'Tartard',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 63,
            name: 'Abra',
            frequencyFactor: FrequencyFactor.VeryCommon,
        },
        {
            id: 64,
            name: 'Kadabra',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 65,
            name: 'Alakazam',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 66,
            name: 'Machoc',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 67,
            name: 'Machopeur',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 68,
            name: 'Mackogneur',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 69,
            name: 'Chétiflor',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 70,
            name: 'Boustiflor',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 71,
            name: 'Empiflor',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 72,
            name: 'Tentacool',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 73,
            name: 'Tentacruel',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 74,
            name: 'Racaillou',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 75,
            name: 'Gravalanch',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 76,
            name: 'Grolem',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 77,
            name: 'Ponyta',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 78,
            name: 'Galopa',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 79,
            name: 'Ramoloss',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 80,
            name: 'Flagadoss',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 81,
            name: 'Magnéti',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 82,
            name: 'Magnéton',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 83,
            name: 'Canarticho',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 84,
            name: 'Doduo',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 85,
            name: 'Dodrio',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 86,
            name: 'Otaria',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 87,
            name: 'Lamantine',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 88,
            name: 'Tadmorv',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 89,
            name: 'Grotadmorv',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 90,
            name: 'Kokiyas',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 91,
            name: 'Crustabri',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 92,
            name: 'Fantominus',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 93,
            name: 'Spectrum',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 94,
            name: 'Ectoplasma',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 95,
            name: 'Onix',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 96,
            name: 'Soporifik',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 97,
            name: 'Hypnomade',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 98,
            name: 'Krabby',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 99,
            name: 'Krabboss',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 100,
            name: 'Voltorbe',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 101,
            name: 'Électrode',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 102,
            name: 'Nœunœuf',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 103,
            name: 'Noadkoko',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 104,
            name: 'Osselait',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 105,
            name: 'Ossatueur',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 106,
            name: 'Kicklee',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 107,
            name: 'Tygnon',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 108,
            name: 'Excelangue',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 109,
            name: 'Smogo',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 110,
            name: 'Smogogo',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 111,
            name: 'Rhinocorne',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 112,
            name: 'Rhinoféros',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 113,
            name: 'Leveinard',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 114,
            name: 'Saquedeneu',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 115,
            name: 'Kangourex',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 116,
            name: 'Hypotrempe',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 117,
            name: 'Hypocéan',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 118,
            name: 'Poissirène',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 119,
            name: 'Poissoroy',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 120,
            name: 'Stari',
            frequencyFactor: FrequencyFactor.Common,
        },
        {
            id: 121,
            name: 'Staross',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 122,
            name: 'M. Mime',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 123,
            name: 'Insécateur',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 124,
            name: 'Lippoutou',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 125,
            name: 'Élektek',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 126,
            name: 'Magmar',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 127,
            name: 'Scarabrute',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 128,
            name: 'Tauros',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 129,
            name: 'Magicarpe',
            frequencyFactor: FrequencyFactor.VeryCommon,
        },
        {
            id: 130,
            name: 'Léviator',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 131,
            name: 'Lokhlass',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 132,
            name: 'Métamorph',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 133,
            name: 'Évoli',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 134,
            name: 'Aquali',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 135,
            name: 'Voltali',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 136,
            name: 'Pyroli',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 137,
            name: 'Porygon',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 138,
            name: 'Amonita',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 139,
            name: 'Amonistar',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 140,
            name: 'Kabuto',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 141,
            name: 'Kabutops',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 142,
            name: 'Ptéra',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 143,
            name: 'Ronflex',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 144,
            name: 'Artikodin',
            frequencyFactor: FrequencyFactor.Legendary,
        },
        {
            id: 145,
            name: 'Électhor',
            frequencyFactor: FrequencyFactor.Legendary,
        },
        {
            id: 146,
            name: 'Sulfura',
            frequencyFactor: FrequencyFactor.Legendary,
        },
        {
            id: 147,
            name: 'Minidraco',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 148,
            name: 'Draco',
            frequencyFactor: FrequencyFactor.Medium,
        },
        {
            id: 149,
            name: 'Dracolosse',
            frequencyFactor: FrequencyFactor.Rare,
        },
        {
            id: 150,
            name: 'Mewtwo',
            frequencyFactor: FrequencyFactor.NearImpossible,
        },
        {
            id: 151,
            name: 'Mew',
            frequencyFactor: FrequencyFactor.NearImpossible,
        },
    ],
};
