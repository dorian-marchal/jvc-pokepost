/**
 * Représente un post sur les forums de jeuxvideo.com.
 */
var Post = function() {};

/**
 * @param {int} postId
 * @return {Post|null} Post d'ID passé en paramètre s'il est présent sur la page.
 *         null si le post n'existe pas sur la page
 */
Post.getOnPage = function(postId) {
    var postAnchorId = 'post_' + postId;
    var postAnchor = document.getElementById(postAnchorId);
    var post;

    try {
        if (postAnchor === null) {
            throw new Error('Anchor does not exist.');
        }

        var postEl = postAnchor.nextElementSibling;
        if (postEl === null) {
            throw new Error('Post element does not exist.');
        }

        post = Post.getFromDomElement(postEl);
    }
    catch (err) {
        post = null;
    }

    return post;
};

/**
 * @param {HTMLElement} postEl Element .bloc-message-forum correspondant au post.
 * @return {Post} Post correspondant à un élément.
 */
Post.getFromDomElement = function(postEl) {
    var post = new Post();
    post.el = postEl;
    post.id = parseInt(post.el.dataset.id, 10);
    post.authorAliasWithCase = post.el.querySelector('.bloc-pseudo-msg').textContent.trim();
    post.authorAlias = post.authorAliasWithCase.toLowerCase();
    post.frenchDate = post.el.querySelector('.bloc-date-msg').textContent.trim();

    return post;
};

Post.prototype = {
    constructor: Post,

    /**
     * @return {Date} date du post
     * @throws {Error} Si le poste n'a pas de date.
     */
    getDate: function() {
        if (typeof this.frenchDate === 'undefined') {
            throw new Error('Post has no date.');
        }

        var monthNumbers = { 'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3,
            'mai': 4, 'juin': 5, 'juillet': 6, 'août': 7, 'septembre': 8,
            'octobre': 9, 'novembre': 10, 'décembre': 11 };

        // https://regex101.com/r/dA3mK7/1
        var matches = this.frenchDate.match(/^[\s]*(\d{1,2})(?:er)? ([^\s]*) (\d{4}) à (\d{2}):(\d{2}):(\d{2})$/);
        if (matches === null) {
            throw new Error('Cannot parse date.');
        }
        return new Date(matches[3], monthNumbers[matches[2]], matches[1], matches[4], matches[5], matches[6]);
    },

    /**
     * @return {boolean} true si le post est le dernier de la page courante.
     */
    isLastOnPage: function() {
        return this.el && !this.el.nextElementSibling.classList.contains('bloc-message-forum-anchor');
    },
};

module.exports = Post;
