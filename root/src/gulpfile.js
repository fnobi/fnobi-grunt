var path = require('path');
var gulp = require('gulp');

var source = require('vinyl-source-stream');
var sass = require('gulp-ruby-sass');/*[ if (js_builder == 'varline') { ]*/
var varline = require('varline').gulp;/*[ } else if (js_builder == 'webpack') { ]*/
var webpack = require('gulp-webpack');/*[ } else if (js_builder == 'browserify') { ]*/
var browserify = require('browserify');/*[ } ]*/
var jade = require('gulp-jade');
var Koko = require('koko');

var util = require('./task-util');


/* ========================================= *
 * const
 * ========================================= */
var SRC = '.';
var SRC_SASS = [ SRC, 'sass' ].join('/');
var SRC_JS = [ SRC, 'js' ].join('/');
var SRC_JS_LIB = [ SRC_JS, 'lib' ].join('/');
var SRC_JADE = [ SRC, 'jade' ].join('/');
var SRC_JADE_HELPER = [ SRC_JADE, 'helper' ].join('/');
var SRC_DATA = [ SRC, 'data' ].join('/');

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

gulp.task('compile-js', function () {/*[ if (js_builder == 'browserify') { ]*/

    return browserify(SRC_JS + '//*[= camelCasedName ]*/.js')
        .bundle()
        .pipe(source('/*[= camelCasedName ]*/.js'))
        .pipe(gulp.dest(DEST_JS));/*[ } else { ]*/

    gulp.src(SRC_JS + '//*[= camelCasedName ]*/.js')/*[ if (js_builder == 'varline') { ]*/
        .pipe(varline({
            wrap: true,
            loadPath: [
                SRC_JS + '/*.js',
                SRC_JS_LIB + '/*.js'
            ],
            alias: {
                $: 'jquery',
                _: 'underscore'
            }
        }))/*[ } else if (js_builder == 'webpack') { ]*/
        .pipe(webpack({
            output: {
                filename: '/*[= camelCasedName ]*/.js'
            },
            resolve: {
                extensions: ['', '.js']
            }
        }))/*[ } ]*/
        .pipe(gulp.dest(DEST_JS));/*[ } ]*/
});

gulp.task('js', ['copy-lib', 'compile-js']);


// html
gulp.task('jade', ['css', 'js'], function () {
    var locals = loadLocals();
    locals.SNSHelper = require(SRC_JADE_HELPER + '/SNSHelper');
    locals.TumblrTagHelper = require(SRC_JADE_HELPER + '/TumblrTagHelper');
    locals.TumblrTagHelper.data = {
        available: true,
        blog: util.readConfig('data/blog.json'),
        posts: util.readConfig('data/posts.json'),
        custom: util.readConfig('data/custom.yaml')
    };

    gulp.src(SRC_JADE + '/*.jade')
        .pipe(jade({
            locals: locals,
            pretty: true
        }))
        .pipe(gulp.dest(DEST_JADE));
});

gulp.task('html', ['jade']);


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

// tumblr templateでは、jadeがぜんぶに依存持ってるので、
// defaultで呼ぶのはhtmlだけでおk
gulp.task('default', ['html']);
