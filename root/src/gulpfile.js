var path = require('path');
var gulp = require('gulp');

var source = require('vinyl-source-stream');
var sass = require('gulp-ruby-sass');/*[ if (js_builder == 'varline') { ]*/
var varline = require('varline').gulp;/*[ } else if (js_builder == 'webpack') { ]*/
var webpack = require('gulp-webpack');/*[ } else if (js_builder == 'browserify') { ]*/
var browserify = require('browserify');/*[ } ]*/
var jade = require('gulp-jade');
var Koko = require('koko');
var awspublish = require('gulp-awspublish');
var rename = require('gulp-rename');

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


var onError = function (err) {
    console.error('Error!', err.message);
};

var loadLocals = function () {
    var locals = util.readConfig([
        'data/config.yaml',
        {
            http_path: HTTP_PATH
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
            }/*[ if (with_babel) { ]*/,
            module: {
                loaders: [{
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                }]
            }/*[ } ]*/
        }))/*[ } ]*/
        .pipe(gulp.dest(DEST_JS));/*[ } ]*/
});

gulp.task('js', ['copy-lib', 'compile-js']);


// html
gulp.task('jade', function () {
    var locals = loadLocals();
    locals.SNSHelper = require(SRC_JADE_HELPER + '/SNSHelper');

    gulp.src(SRC_JADE + '/*.jade')
        .pipe(jade({
            locals: locals,
            pretty: true
        }))
        .pipe(gulp.dest(DEST_JADE));
});

gulp.task('html', ['jade']);


// default
gulp.task('default', ['css', 'js', 'html']);


// server
gulp.task('server', function () {
    new Koko(path.resolve(DEST), {
        openPath: HTTP_PATH
    }).start();
});

// publish
gulp.task('publish', function () {
    var config = util.readConfig([ 'aws-credentials.json' ]);
    
    var publisher = awspublish.create(config);
    gulp.src([
        DEST + '/*.html',
        DEST + '/?(css|js|img)/**/*.*'
    ])
        .pipe(publisher.publish())
        .pipe(publisher.sync())
        .pipe(awspublish.reporter({
            states: ['create', 'update', 'delete']
        }));
});


// watch
gulp.task('watch', function () {
    gulp.watch(GLOB_SASS, ['sass']);
    gulp.watch(GLOB_JS, ['js']);
    gulp.watch(GLOB_JADE, ['jade']);
    gulp.watch(GLOB_DATA, ['html']);
});
