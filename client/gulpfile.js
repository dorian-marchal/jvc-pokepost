var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var mocha = require('gulp-mocha');
var eslint = require('gulp-eslint');
var prepend = require('gulp-insert').prepend;
var webpack = require('webpack-stream');
var webpackConfig = require('./webpack.config.js');

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

gulp.task('build', function() {

    var userscriptHeaderPath = path.join(__dirname, 'src', 'userscript', 'header.js');

    /* eslint-disable no-sync */
    var userscriptHeader = fs.readFileSync(userscriptHeaderPath, 'utf8');

    return gulp.src(['./src/index.js'])
        .pipe(webpack(webpackConfig))
        .pipe(prepend(userscriptHeader))
        .pipe(gulp.dest('./dist'))
    ;
});
