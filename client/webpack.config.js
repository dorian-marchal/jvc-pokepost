var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'jvc-pokepost.user.js',
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'simple-css' },
        ],
    },
};
