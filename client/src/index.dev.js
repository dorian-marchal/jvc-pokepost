// Expose certains modules pour faciliter les tests.
window.Post = require('./Post');
window.PageUtil = require('./PageUtil');
window.UserUtil = require('./UserUtil');
window.Pokepost = require('./Pokepost');

// Charge le fichier principal.
require('./index.js');
