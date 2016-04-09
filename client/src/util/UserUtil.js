var UserUtil = {

    /**
     * Retourne l'alias lowercased de l'utilisateur courant.
     *
     * @return {string} Alias de l'utilisateur courant.
     * @throws Error Si l'alias n'a pas pu être récupéré.
     */
    getAlias: function() {
        return document.querySelector('.account-pseudo').textContent.trim().toLowerCase();
    },
};

module.exports = UserUtil;
