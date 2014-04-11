module.exports = function (grunt) {
    var path = require('path');
    var config = {};

    var alias = {
        $: 'jquery',
        _: 'underscore'
    };

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

    var configureEnv = function (name, env) {
        // js
        {
            grunt.loadNpmTasks('grunt-auto-deps');
            config.auto_deps = config.auto_deps || {};

            config.auto_deps[name] = {
                scripts: ['{%= camelCasedName %}'],
                dest: path.resolve(env.sitePath, 'js'),
                loadPath: ['js/*.js', 'js/lib/*.js'],
                ignore: [],
                forced: [],
                wrap: true,
                alias: alias
            };

            config.esteWatch.options.dirs.push('js/*.js');
            config.esteWatch['js'] = function () { return 'auto_deps:' + name; };

            env.tasks.push('auto_deps:' + name);
        }


        // js lib copy
        (function () {
            var libs = [
                'bower_components/html5shiv/src/html5shiv.js'
            ];

            var libDir = path.resolve(env.sitePath, 'js') + '/lib/';
            var files = [];
            libs.forEach(function (lib) {
                files.push({
                    expand: true,
                    flatten: true,
                    src: lib,
                    dest: libDir
                    });
            });
            config.copy[name] = { files: files };
            env.tasks.push('copy:' + name);
        })();
    
    
        // css
        {
            grunt.loadNpmTasks('grunt-contrib-compass');
    
            config.compass = config.compass || {};
            config.compass[name] = {
                options: {
                    sassDir                 : 'sass',
                    cssDir                  : path.resolve(env.sitePath, 'css'),
                    javascriptsDir          : path.resolve(env.sitePath, 'js'),
                    imagesDir               : path.resolve(env.sitePath, 'img'),
                    generatedImagesPath     : path.resolve(env.sitePath, 'img'),
                    httpImagesPath          : path.resolve(env.httpPath, 'img'),
                    httpGeneratedImagesPath : path.resolve(env.httpPath, 'img'),
                    environment             : 'production',
                    outputStyle             : 'compressed'
                }
            };
            
            config.esteWatch.options.dirs.push('sass/*.scss');
            config.esteWatch.options.dirs.push('sass/**/*.scss');
            config.esteWatch['scss'] = function () { return 'compass:' + name; };
    
            env.tasks.push('compass:' + name);
        }{% if (with_ejs) { %}
    
    
        // ejs
        if (env.ejs) {
            grunt.loadNpmTasks('grunt-simple-ejs');
    
            config.ejs = config.ejs || {};
            config.ejs[name] = {
                templateRoot: 'ejs',
                template: ['*.ejs'],
                dest: env.sitePath,
                include: [
                    'bower_components/ejs-head-modules/*.ejs',
                    'bower_components/ejs-sns-modules/*.ejs',
                    'ejs/layout/*.ejs'
                ],
                silentInclude: true,
                options: [
                    {
                        http_path : env.httpPath,
                        css_path  : path.resolve(env.httpPath, 'css'),
                        js_path   : path.resolve(env.httpPath, 'js' ),
                        img_path  : path.resolve(env.httpPath, 'img')
                    },
                    'options.yaml'
                ]
            };
            env.tasks.push('ejs:' + name);
            
            config.esteWatch.options.dirs.push('ejs/*.ejs');
            config.esteWatch.options.dirs.push('ejs/**/*.ejs');
            config.esteWatch['ejs'] = function () { return 'ejs:' + name; };

        }{% } %}{% if (with_test) { %}

    
        // test
        if (env.test) {
            grunt.loadNpmTasks('grunt-mocha-html');
            grunt.loadNpmTasks('grunt-mocha-phantomjs');
    
            config.mocha_html = config.mocha_html || {};
            config.mocha_html[name] = {
                src   : [ path.resolve(env.sitePath, 'js', '{%= camelCasedName %}.js') ],
                test  : [ 'test/*-test.js' ],
                assert : 'chai'
            };
            env.tasks.push('mocha_html');
    
            config.mocha_phantomjs =  {
                all: [ 'test/*.html' ]
            };
    
            grunt.registerTask('test', ['mocha_phantomjs']);
    
        }{% } %}
    
    
        // server
        {
            grunt.loadNpmTasks('grunt-koko');
    
            config.koko = config.koko || {};
            config.koko[name] = {
                root: path.resolve(env.sitePath, path.relative(env.httpPath, '/')),
                openPath: env.httpPath
            };
    
            grunt.registerTask('server', ['koko:' + name]);
        }

        // set as task
        grunt.registerTask(name, env.tasks);
    };

    configureEnv('dev', {
        tasks: [],
        sitePath: '../',
        httpPath: '/',{% if (with_ejs) { %}
        ejs: true,{% } %}{% if (with_test) { %}
        test: true{% } %}
    });

    // init
    grunt.initConfig(config);
    grunt.registerTask('default', ['dev']);
};
