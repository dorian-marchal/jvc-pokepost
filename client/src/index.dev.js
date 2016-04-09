// Expose certains modules pour faciliter les tests.
window.Post = require('./Post');
window.PageUtil = require('./util/PageUtil');
window.UserUtil = require('./util/UserUtil');
window.Pokepost = require('./Pokepost');

// Charge le fichier principal.
require('./index.js');
