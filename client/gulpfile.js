/* eslint-disable no-sync, global-require */

var argv = require('yargs').argv;
var eslint = require('gulp-eslint');
var exec = require('child_process').exec;
var fs = require('fs');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var mocha = require('gulp-mocha');
var os = require('os');
var path = require('path');
var plumber = require('gulp-plumber');
var prepend = require('gulp-insert').prepend;
var uglify = require('gulp-uglify');
var UserscriptHeader = require('userscript-header');
var webpack = require('webpack-stream');
var webpackConfig = require('./webpack.config.js');

var packagePath = path.join(__dirname, 'package.json');

gulp.task('lint', function() {
    return gulp.src(['./*.js', './src/**/*.js', './test/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(eslint.results(function(results) {
            if (results.warningCount > 0) {
                throw new Error('You must fix eslint warnings');
            }
        }))
    ;
});

gulp.task('test', function() {
    return gulp.src(['./test/**/*.js'])
        .pipe(mocha())
    ;
});

/**
 * Build userscript file. Run it with --dev option to prevent minification.
 */
gulp.task('build', ['build-config'], function() {

    if (argv.dev) {
        webpackConfig.entry = './src/index.dev.js';
    }
    else {
        // Strip out console.log in production.
        webpackConfig.module.loaders.push({
            test: /\.js$/,
            loader: 'strip?strip[]=console.log',
        });
    }

    return gulp.src(webpackConfig.entry)
        .pipe(plumber())
        .pipe(webpack(webpackConfig))
        .pipe(gulpif(!argv.dev, (uglify())))
        .pipe(prepend(UserscriptHeader.fromPackage(packagePath).toString()))
        .pipe(gulp.dest('./dist'))
    ;
});

/**
 * Build JSON config file from JS config source.
 */
gulp.task('build-config', function() {
    var configSrcPath = './src/config/pokemon-data.js';
    var configDestPath = './src/config/pokemon-data.json';

    delete require.cache[require.resolve(configSrcPath)];
    var config = require(configSrcPath);

    var jsonSpaceIndent = argv.dev ? '    ' : '';
    var configJson = JSON.stringify(config, null, jsonSpaceIndent);

    fs.writeFileSync(configDestPath, configJson);
});

gulp.task('watch', function() {
    gulp.watch([
        './src/**/*',
        './test/**/*',
        './package.json',
        '!./src/config/pokemon-data.json',
    ], ['build']);
});

/*
 * Permet de tester un userscript sans le réinstaller à chaque modification.
 * Génère un userscript vide qui importe le fichier principal de l'userscript
 * courant. De cette façon, le fichier principal n'est pas caché et ses
 * modifications sont prises en compte.
 *
 * Prérequis :
 * -----------
 * - Droits d'écriture sur /tmp
 * - Google Chrome installé avec l'extension Tampermonkey
 * - Droits d'ouvrir des urls locales à Tampermonkey
 * - Possibilité de lancer Chrome via la commande "google-chrome" dans le terminal
 * - Chrome déjà ouvert (important !)
 */
gulp.task('dev-on-chrome', function() {

    // Charge l'header de l'userscript courant.
    var userscriptHeader = UserscriptHeader.fromPackage(packagePath);
    var userscriptData = userscriptHeader.getData();

    // Ajoute le fichier principal aux dépendances.
    userscriptData.require = userscriptData.require || [];
    userscriptData.require.unshift('file://' + path.join(webpackConfig.output.path, webpackConfig.output.filename));
    userscriptHeader.setData(userscriptData);

    // Crée l'userscript vide dans un fichier temporaire.
    var tempDir = 'dev-on-chrome';
    try {
        fs.mkdirSync(path.join(os.tmpdir(), tempDir));
    }
    catch (err) { void 0; }

    var tempUserscriptPath = path.join(os.tmpdir(), tempDir, webpackConfig.output.filename);
    fs.writeFileSync(tempUserscriptPath, userscriptHeader.toString());

    // Charge l'userscript dans Chrome.
    exec('google-chrome file://' + tempUserscriptPath);
});

gulp.task('watch-on-chrome', ['dev-on-chrome', 'watch']);
