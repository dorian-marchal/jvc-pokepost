var gulp = require('gulp');
var mocha = require('gulp-mocha');
var eslint = require('gulp-eslint');

gulp.task('lint', function() {
    return gulp.src(['./scr/**/*.js', './test/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
    ;
});

gulp.task('test', function() {
    return gulp.src(['./test/**/*.js'])
        .pipe(mocha())
    ;
});
