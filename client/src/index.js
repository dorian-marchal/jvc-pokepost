require('./css/style.css');

var Pokepost = require('./Pokepost');

document.addEventListener('DOMContentLoaded', function() {
    new Pokepost().init();
});
