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

var GLOB_SASS = path.join(SRC_SASS, '**/*.scss');
var GLOB_JS = path.join(SRC_JS, '**/*.js');
var GLOB_JADE = path.join(SRC_JADE, '**/*.jade');

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
gulp.task('sass', function () {
    return sass(SRC_SASS, { compass: true, style: 'compressed' })
        .on('error', onError)
        .pipe(gulp.dest(DEST_CSS));
});

gulp.task('copy-lib', function () {
    return gulp.src([
        'bower_components/html5shiv/dist/html5shiv.min.js'
    ]).pipe(gulp.dest(DEST_JS_LIB));
});

gulp.task('js', function () {
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

    gulp.src([SRC_JS, '/*[= camelCasedName ]*/.js'].join('/'))
        .pipe(varline(opts))
        .pipe(gulp.dest(DEST_JS));
});

gulp.task('jade', function () {
    gulp.src(SRC_JADE + '/*.jade')
        .pipe(jade({
            locals: loadLocals(),
            pretty: true
        }))
        .pipe(gulp.dest(DEST_JADE));
});

gulp.task('server', function () {
    new Koko(path.resolve(DEST), {
        openPath: HTTP_PATH
    }).start();
});

gulp.task('watch', function () {
    gulp.watch(GLOB_SASS, ['sass']);
    gulp.watch(GLOB_JS, ['js']);
    gulp.watch(GLOB_JADE, ['jade']);
    gulp.watch('data/*', ['jade']);
});

gulp.task('build', ['sass', 'copy-lib', 'js', 'jade']);
