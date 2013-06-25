module.exports = function (grunt) {
    var config = {}, build = [];


    // basic
    {
        config.pkg =  grunt.file.readJSON('package.json');

        grunt.loadNpmTasks('grunt-contrib-watch');
        config.watch = {};
    }


    // js
    {
        grunt.loadNpmTasks('grunt-embed-require');
        config.embed_require = {
            dev: {
                src: 'src/js',
                dest: 'js'
            }
        };
        config.watch.js = {
            files: 'src/js/**/*.js',
            tasks: ['embed_require:dev']
        };
    }


    // css
    {
        grunt.loadNpmTasks('grunt-contrib-compass');

        config.compass =  {
            dist: {
                options: {
                    config: 'src/config.rb',
                    environment: 'production'
                }
            },
            dev: {
                options: {
                    config: 'src/config.rb',
                    environment: 'development'
                }
            }
        };

        config.watch.css = {
            files: 'src/sass/**/*.scss',
            tasks: ['compass:dev']
        };

        build.push('compass:dev');
    }


    // ejs{% if (with_ejs) { %}
    {
        grunt.loadNpmTasks('grunt-simple-ejs');

        config.ejs = {
            dev: {
                template: ['src/ejs/*.ejs'],
                dest: './',
                options: 'src/options.dev.yaml'
            }
        };
        build.push('ejs:dev');

        config.watch.ejs = {
            files: ['src/ejs/*.ejs'],
            tasks: ['ejs:dev']
        };
    }
    // {% } %}


    // test{% if (with_test) { %}
    {
        grunt.loadNpmTasks('grunt-mocha-html');
        grunt.loadNpmTasks('grunt-mocha-phantomjs');

        config.mocha_html =  {
            all: {
                src   : [ 'js/sub.js' ],
                test  : [ 'test/*-test.js' ],
                assert : 'chai'
            }
        };
        build.push('mocha_html');
        config.watch.js.tasks.push('mocha_html');

        config.mocha_phantomjs =  {
            all: [ 'test/*.html' ]
        };

        grunt.registerTask('test', ['mocha_phantomjs']);

    }
    // {% } %}


    // server
    {
        grunt.loadNpmTasks('grunt-koko');
        config.koko = {
            dev: {
                openPath: '/'
            }
        };

        grunt.registerTask('server', ['koko:dev']);
    }


    // init
    grunt.initConfig(config);
    grunt.registerTask('build', build);
    grunt.registerTask('default', ['build']);
};