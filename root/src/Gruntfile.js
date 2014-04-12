module.exports = function (grunt) {
    var path = require('path');
    var config = {};

    // js library alias
    var alias = {
        $: 'jquery',
        _: 'underscore'
    };

    //[ if (with_ejs) { ]//
    var useEjs = true;//[ } ]////[ if (with_test) { ]//
    var useTest = true;//[ } ]//

    // dev config
    var DEV = 'dev';
    var devTasks = [];
    var devSitePath = '../';
    var devHttpPath = '/';


    // prod config
    var PROD = 'PROD';


    // basic
    {
        config.pkg =  grunt.file.readJSON('package.json');

        grunt.loadNpmTasks('grunt-este-watch');
        grunt.loadNpmTasks('grunt-contrib-copy');

        grunt.registerTask('watch', 'esteWatch');

        config.esteWatch = {
            options: {
                dirs: [],
                livereload: { enabled: false }
            }
        };
        config.copy = {};
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
    
        config.auto_deps[DEV] = {
            scripts: ['//[= camelCasedName ]//'],
            dest: path.resolve(devSitePath, 'js'),
            loadPath: ['js/*.js', 'js/lib/*.js'],
            ignore: [],
            forced: [],
            wrap: true,
            alias: alias
        };
    
        config.esteWatch.options.dirs.push('js/*.js');
        config.esteWatch['js'] = function () { return 'auto_deps:' + DEV; };
    
        devTasks.push('auto_deps:' + DEV);
    }
    
    
    // js lib copy
    (function () {
        var libs = [
            'bower_components/html5shiv/src/html5shiv.js'
        ];
    
        var libDir = path.resolve(devSitePath, 'js') + '/lib/';
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
                sassDir                 : 'sass',
                cssDir                  : path.resolve(devSitePath, 'css'),
                javascriptsDir          : path.resolve(devSitePath, 'js'),
                imagesDir               : path.resolve(devSitePath, 'img'),
                generatedImagesPath     : path.resolve(devSitePath, 'img'),
                httpImagesPath          : path.resolve(devHttpPath, 'img'),
                httpGeneratedImagesPath : path.resolve(devHttpPath, 'img'),
                environment             : 'production',
                outputStyle             : 'compressed'
            }
        };
        
        config.esteWatch.options.dirs.push('sass/*.scss');
        config.esteWatch.options.dirs.push('sass/**/*.scss');
        config.esteWatch['scss'] = function () { return 'compass:' + DEV; };
    
        devTasks.push('compass:' + DEV);
    }//[ if (with_ejs) { ]//
    
    
    // ejs
    if (useEjs) {
        grunt.loadNpmTasks('grunt-simple-ejs');
    
        config.ejs = config.ejs || {};
        config.ejs[DEV] = {
            templateRoot: 'ejs',
            template: ['*.ejs'],
            dest: devSitePath,
            include: [
                'bower_components/ejs-head-modules/*.ejs',
                'bower_components/ejs-sns-modules/*.ejs',
                'ejs/layout/*.ejs'
            ],
            silentInclude: true,
            options: [
                {
                    http_path : devHttpPath,
                    css_path  : path.resolve(devHttpPath, 'css'),
                    js_path   : path.resolve(devHttpPath, 'js' ),
                    img_path  : path.resolve(devHttpPath, 'img')
                },
                'options.yaml'
            ]
        };
        devTasks.push('ejs:' + DEV);
        
        config.esteWatch.options.dirs.push('ejs/*.ejs');
        config.esteWatch.options.dirs.push('ejs/**/*.ejs');
        config.esteWatch['ejs'] = function () { return 'ejs:' + DEV; };
    
    }//[ } ]////[ if (with_test) { ]//
    
    
    // test
    if (useTest) {
        grunt.loadNpmTasks('grunt-mocha-html');
        grunt.loadNpmTasks('grunt-mocha-phantomjs');
    
        config.mocha_html = config.mocha_html || {};
        config.mocha_html[DEV] = {
            src   : [ path.resolve(devSitePath, 'js', '//[= camelCasedName ]//.js') ],
            test  : [ 'test/*-test.js' ],
            assert : 'chai'
        };
        devTasks.push('mocha_html');
    
        config.mocha_phantomjs =  {
            all: [ 'test/*.html' ]
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


    // init
    grunt.initConfig(config);
    grunt.registerTask('default', ['dev']);
};
