var Post = require('../Post');
var UserUtil = require('./UserUtil');

var PageUtil = {

    /**
     * Retourne le Post qui vient d'être posté par l'utilisateur courant.
     *
     * Un post est retourné si :
     * - Le post est le dernier de la page
     * - L'ancre vers ce post est présente dans l'URL
     * - L'auteur du post est l'utilisateur courant
     * - Le post a été posté récemment
     *
     * @param {int} postMaxAgeMs Age à partir duquel un post n'est plus
     *        considéré comme "récent".
     * @return {Post|null} dernier post de la page,
     *         null s'il n'y a pas de nouveau post valable sur la page.
     */
    getNewlySentPost: function(postMaxAgeMs) {
        var targetedPost;

        try {
            if (!PageUtil.onLastTopicPage()) {
                throw new Error('Not on a last topic page.');
            }

            targetedPost = PageUtil.getTargetedPost();

            if (targetedPost === null) {
                throw new Error('No targeted post on page.');
            }

            if (!targetedPost.isLastOnPage()) {
                throw new Error('The post is not the last one.');
            }

            if (targetedPost.authorAlias !== UserUtil.getAlias()) {
                throw new Error('Not the author of the post.');
            }

            if (new Date() - targetedPost.getDate() > postMaxAgeMs) {
                throw new Error('The post is too old.');
            }
        }
        catch (err) {
            targetedPost = null;
        }

        return targetedPost;
    },

    /**
     * @return {int|null} ID de l'éventuel post ciblé dans l'URL (ancre).
     */
    _getTargetedPostId: function() {
        // https://regex101.com/r/gW0pX7/1
        var matches = location.hash.match(/^#post_(\d+)$/);

        if (matches === null) {
            return null;
        }

        return parseInt(matches[1], 10);
    },

    /**
     * @return {Post|null} Post ciblé dans l'URL (ancre) ou null si pas de post
     *         ciblé trouvé.
     */
    getTargetedPost: function() {

        var targetedPostId = PageUtil._getTargetedPostId();
        var targetedPost;

        try {
            if (targetedPostId === null) {
                throw new Error('No targeted post.');
            }

            targetedPost = Post.getOnPage(targetedPostId);

            if (targetedPost === null) {
                throw new Error('Targeted post does not exist');
            }
        }
        catch (err) {
            targetedPost = null;
        }

        return targetedPost;
    },

    /**
     * @return {boolean} true si l'utilisateur est sur un topic
     */
    inTopic: function() {
        return location.pathname.match(/forums\/(1|42)/);
    },

    /**
     * @return {boolean} true si la page courante est la dernière du topic.
     */
    onLastTopicPage: function() {
        return PageUtil.inTopic() && document.querySelector('.pagi-fin-actif') === null;
    },
};

module.exports = PageUtil;
