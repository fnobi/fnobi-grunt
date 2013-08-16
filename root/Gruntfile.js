module.exports = function (grunt) {
    var config = {}, build = [];

    var httpPath = '';

    var path = {
        src: {
            js:   'src/js',
            sass: 'src/sass',
            ejs:  'src/ejs'
        },
        dist: {
            js:   'js',
            css:  'css',
            html: '',
            img:  'img'
        },
        examples: {
            js:   'examples/js',
            css:  'examples/css',
            html: 'examples',
            img:  'examples/img'
        },
        test: 'test',
        namespaces: {
            $: 'bower_components/jquery/jquery.js'
        }
    };

    // basic
    {
        config.pkg =  grunt.file.readJSON('package.json');

        grunt.loadNpmTasks('grunt-contrib-watch');
        config.watch = {};
    }


    // js
    {
        grunt.loadNpmTasks('grunt-auto-deps');
        config.auto_deps = {
            dist: {
                scripts: ['{%= name %}'],
                dest: path.dist.js,
                loadPath: [path.src.js + '/*.js'],
                locate: path.namespaces
            },
            examples: {
                scripts: ['{%= name %}-demo'],
                dest: path.examples.js,
                loadPath: [path.src.js + '/*.js'],
                locate: path.namespaces
            }
        };

        config.watch.js = {
            files: [path.src.js + '/*.js'],
            tasks: ['auto_deps:{%= grunt_build_env %}']
        };

        build.push('auto_deps:{%= grunt_build_env %}');
    }


    // css
    {
        grunt.loadNpmTasks('grunt-contrib-compass');

        config.compass =  {
            dist: {
                options: {
                    sassDir: path.src.sass,
                    cssDir: path.dist.css,
                    javascriptsDir: path.dist.js,
                    imagesDir: path.dist.img,
                    httpImagesPath: httpPath + '/' + path.dist.img,
                    environment: 'development'
                }
            },
            examples: {
                options: {
                    sassDir: path.src.sass,
                    cssDir: path.examples.css,
                    javascriptsDir: path.examples.js,
                    imagesDir: path.examples.img,
                    httpImagesPath: httpPath + '/' + path.examples.img,
                    environment: 'development'
                }
            }
        };

        config.watch.css = {
            files: [path.src.sass + '/*.scss', path.src.sass + '/**/*.scss'],
            tasks: ['compass:{%= grunt_build_env %}']
        };

        build.push('compass:{%= grunt_build_env %}');
    }


    // ejs{% if (with_ejs) { %}
    {
        grunt.loadNpmTasks('grunt-simple-ejs');

        config.ejs = {
            dist: {
                template: [path.src.ejs + '/*.ejs'],
                dest: path.dist.html,
                options: [
                    {
                        http_path: httpPath,
                        css_path: [ httpPath, path.dist.css ].join('/'),
                        js_path: [ httpPath, path.dist.js ].join('/'),
                        script_main: '{%= name %}'
                    },
                    'src/options.yaml'
                ]
            },
            examples: {
                template: [path.src.ejs + '/*.ejs'],
                dest: path.examples.html,
                options: [
                    {
                        http_path: httpPath,
                        css_path: [ httpPath, path.examples.css ].join('/'),
                        js_path: [ httpPath, path.examples.js ].join('/'),
                        script_main: '{%= name %}-demo'
                    },
                    'src/options.yaml'
                ]
            }
        };
        build.push('ejs:{%= grunt_build_env %}');

        config.watch.ejs = {
            files: [
                path.src.ejs + '/*.ejs',
                path.src.ejs + '/**/*.ejs',
                'src/options.yaml'
            ],
            tasks: ['ejs:{%= grunt_build_env %}']
        };
    }
    // {% } %}


    // test{% if (with_test) { %}
    {
        grunt.loadNpmTasks('grunt-mocha-html');
        grunt.loadNpmTasks('grunt-mocha-phantomjs');

        config.mocha_html =  {
            all: {
                src   : [ path.dist.js + '/{%= name %}.js' ],
                test  : [ path.test + '/*-test.js' ],
                assert : 'chai'
            }
        };
        build.push('mocha_html');

        config.watch.test = {
            files: [path.test + '/*-test.js'],
            tasks: ['mocha_phantomjs']
        };
        config.watch.js.tasks.push('mocha_html');

        config.mocha_phantomjs =  {
            all: [ path.test + '/*.html' ]
        };

        grunt.registerTask('test', ['mocha_phantomjs']);

    }
    // {% } %}


    // server
    {
        grunt.loadNpmTasks('grunt-koko');
        config.koko = {
            dist: {
                openPath: httpPath + '/' + path.dist.html
            },
            examples: {
                openPath: httpPath + '/' + path.examples.html
            }
        };

        grunt.registerTask('server', ['koko:{%= grunt_build_env %}']);
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

    // init
    grunt.initConfig(config);
    grunt.registerTask('build', build);
    grunt.registerTask('default', ['build']);
};