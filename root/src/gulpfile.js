var path = require('path');
var gulp = require('gulp');

var sass = require('gulp-ruby-sass');
var varline = require('varline').gulp;
var jade = require('gulp-jade');
var Koko = require('koko');

var util = require('./task-util');


/* ========================================= *
 * const
 * ========================================= */
var SRC = '.';
var SRC_SASS = path.join(SRC, 'sass');
var SRC_JS = path.join(SRC, 'js');
var SRC_JS_LIB = path.join(SRC_JS, 'lib');
var SRC_JADE = path.join(SRC, 'jade');
var SRC_DATA = path.join(SRC, 'data');

var GLOB_SASS = path.join(SRC_SASS, '**/*.scss');
var GLOB_JS = path.join(SRC_JS, '**/*.js');
var GLOB_JADE = path.join(SRC_JADE, '**/*.jade');
var GLOB_DATA = path.join(SRC_DATA, '*');

var DEST = '..';
var DEST_CSS = path.join(DEST, 'css');
var DEST_JS = path.join(DEST, 'js');
var DEST_JS_LIB = path.join(DEST_JS, 'lib');
var DEST_JADE = DEST;

var HTTP_PATH = '/';
var HTTP_PATH_CSS = path.join(HTTP_PATH, 'css');
var HTTP_PATH_JS = path.join(HTTP_PATH, 'js');
var HTTP_PATH_IMG = path.join(HTTP_PATH, 'img');


var onError = function (err) {
    console.error('Error!', err.message);
};

var loadLocals = function () {
    var locals = util.readConfig([
        'data/config.yaml',
        {
            http_path: HTTP_PATH,
            css_path : HTTP_PATH_CSS,
            js_path  : HTTP_PATH_JS,
            img_path : HTTP_PATH_IMG
        }
    ]);
    locals.SNSHelper = require('./jade/helper/SNSHelper');
    return locals;
};


/* ========================================= *
 * tasks
 * ========================================= */

// css
gulp.task('sass', function () {
    return sass(SRC_SASS, { compass: true, style: 'compressed' })
        .on('error', onError)
        .pipe(gulp.dest(DEST_CSS));
});

gulp.task('css', ['sass']);


// js
gulp.task('copy-lib', function () {
    return gulp.src([
        'bower_components/html5shiv/dist/html5shiv.min.js'
    ]).pipe(gulp.dest(DEST_JS_LIB));
});

gulp.task('varline', function () {
    var opts = {
        wrap: true,
        loadPath: [
            SRC_JS + '/*.js',
            SRC_JS_LIB + '/*.js'
        ],
        alias: {
            $: 'jquery',
            _: 'underscore'
        }
    };

    gulp.src(SRC_JS + '//*[= camelCasedName ]*/.js')
        .pipe(varline(opts))
        .pipe(gulp.dest(DEST_JS));
});

gulp.task('js', ['copy-lib', 'varline']);


// html
gulp.task('jade', function () {
    gulp.src(SRC_JADE + '/*.jade')
        .pipe(jade({
            locals: loadLocals(),
            pretty: true
        }))
        .pipe(gulp.dest(DEST_JADE));
});

gulp.task('html', ['jade']);


// build
gulp.task('build', ['css', 'js', 'html']);


// server
gulp.task('server', function () {
    new Koko(path.resolve(DEST), {
        openPath: HTTP_PATH
    }).start();
});


// watch
gulp.task('watch', function () {
    gulp.watch(GLOB_SASS, ['sass']);
    gulp.watch(GLOB_JS, ['js']);
    gulp.watch(GLOB_JADE, ['jade']);
    gulp.watch(GLOB_DATA, ['html']);
});
