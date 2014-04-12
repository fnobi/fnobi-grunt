module.exports = function (grunt) {
    var path = require('path');
    var config = {};

    // dirs
    var JS = 'js';
    var JS_LIB = 'js/lib';
    var CSS = 'css';
    var SASS = 'sass';
    var IMG = 'img';
    var EJS = 'ejs';
    var TEST = 'test';
    //[ if (with_ejs) { ]//
    var useEjs = true;//[ } ]////[ if (with_test) { ]//
    var useTest = true;//[ } ]//

    // js library alias
    var alias = {
        $: 'jquery',
        _: 'underscore'
    };


    // dev config
    var DEV = 'dev';
    var devTasks = [];
    var devSitePath = '../';
    var devHttpPath = '/';

    // prod config
    var PROD = 'prod';
    var prodTasks = [];
    var prodSitePath = path.join(process.env.HOME, 'Desktop', '//[= name ]//');


    // basic
    {
        config.pkg =  grunt.file.readJSON('package.json');

        grunt.loadNpmTasks('grunt-contrib-copy');
        config.copy = {};
    }

    // este watch
    {
        grunt.loadNpmTasks('grunt-este-watch');
        grunt.registerTask('watch', 'esteWatch');

        config.esteWatch = {
            options: {
                dirs: [],
                livereload: { enabled: false }
            }
        };
    }

    // release
    {
        grunt.loadNpmTasks('grunt-release');

        config.release = {
            options: {
                file: 'bower.json',
                npm: false
            }
        };
    }

    // js
    {
        grunt.loadNpmTasks('grunt-auto-deps');
        config.auto_deps = config.auto_deps || {};
    
        var autoDepsDefaultConfig = {
            scripts: ['//[= camelCasedName ]//'],
            loadPath: [JS + '/*.js', JS_LIB + '/*.js'],
            ignore: [],
            forced: [],
            wrap: true,
            alias: alias
        };

        // dev
        config.auto_deps[DEV] = autoDepsDefaultConfig;
        config.auto_deps[DEV].dest = path.resolve(devSitePath, JS);
        devTasks.push('auto_deps:' + DEV);

        // prod
        config.auto_deps[PROD] = autoDepsDefaultConfig;
        config.auto_deps[PROD].dest = path.resolve(prodSitePath, JS);
        prodTasks.push('auto_deps:' + PROD);
    
        // watch
        config.esteWatch.options.dirs.push(JS + '/*.js');
        config.esteWatch['js'] = function () { return 'auto_deps:' + DEV; };
    }
    
    
    // js lib copy
    (function () {
        var libs = [
            'bower_components/html5shiv/src/html5shiv.js'
        ];
    
        var libDir = path.resolve(devSitePath, JS_LIB);
        var files = [];
        libs.forEach(function (lib) {
            files.push({
                expand: true,
                flatten: true,
                src: lib,
                dest: libDir
                });
        });
        config.copy[DEV] = { files: files };
        devTasks.push('copy:' + DEV);
    })();
    
    
    // css
    {
        grunt.loadNpmTasks('grunt-contrib-compass');
    
        config.compass = config.compass || {};
        config.compass[DEV] = {
            options: {
                sassDir                 : SASS,
                cssDir                  : path.resolve(devSitePath, CSS),
                javascriptsDir          : path.resolve(devSitePath, JS),
                imagesDir               : path.resolve(devSitePath, IMG),
                generatedImagesPath     : path.resolve(devSitePath, IMG),
                httpImagesPath          : path.resolve(devHttpPath, IMG),
                httpGeneratedImagesPath : path.resolve(devHttpPath, IMG),
                environment             : 'production',
                outputStyle             : 'compressed'
            }
        };
        
        config.esteWatch.options.dirs.push(SASS + '/*.scss');
        config.esteWatch.options.dirs.push(SASS + '/**/*.scss');
        config.esteWatch['scss'] = function () { return 'compass:' + DEV; };
    
        devTasks.push('compass:' + DEV);
    }//[ if (with_ejs) { ]//
    
    
    // ejs
    if (useEjs) {
        grunt.loadNpmTasks('grunt-simple-ejs');
    
        config.ejs = config.ejs || {};
        config.ejs[DEV] = {
            templateRoot: EJS,
            template: ['*.ejs'],
            dest: devSitePath,
            include: [
                'bower_components/ejs-head-modules/*.ejs',
                'bower_components/ejs-sns-modules/*.ejs',
                EJS + '/layout/*.ejs'
            ],
            silentInclude: true,
            options: [
                {
                    http_path : devHttpPath,
                    css_path  : path.resolve(devHttpPath, CSS),
                    js_path   : path.resolve(devHttpPath, JS ),
                    img_path  : path.resolve(devHttpPath, IMG)
                },
                'options.yaml'
            ]
        };
        devTasks.push('ejs:' + DEV);
        
        config.esteWatch.options.dirs.push(EJS + '/*.ejs');
        config.esteWatch.options.dirs.push(EJS + '/**/*.ejs');
        config.esteWatch['ejs'] = function () { return 'ejs:' + DEV; };
    
    }//[ } ]////[ if (with_test) { ]//
    
    
    // test
    if (useTest) {
        grunt.loadNpmTasks('grunt-mocha-html');
        grunt.loadNpmTasks('grunt-mocha-phantomjs');
    
        config.mocha_html = config.mocha_html || {};
        config.mocha_html[DEV] = {
            src   : [ path.resolve(devSitePath, JS, '//[= camelCasedName ]//.js') ],
            test  : [ TEST + '/*-test.js' ],
            assert : 'chai'
        };
        devTasks.push('mocha_html');
    
        config.mocha_phantomjs =  {
            all: [ TEST + '/*.html' ]
        };
    
        grunt.registerTask('test', ['mocha_phantomjs']);
    
    }//[ } ]//
    
    
    // server
    {
        grunt.loadNpmTasks('grunt-koko');
    
        config.koko = config.koko || {};
        config.koko[DEV] = {
            root: path.resolve(devSitePath, path.relative(devHttpPath, '/')),
            openPath: devHttpPath
        };
    
        grunt.registerTask('server', ['koko:' + DEV]);
    }
    
    // set as task
    grunt.registerTask(DEV, devTasks);
    grunt.registerTask(PROD, prodTasks);


    // init
    grunt.initConfig(config);
    grunt.registerTask('default', [DEV]);
};
