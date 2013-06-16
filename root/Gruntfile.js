module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            js: {
                files: 'src/js/**/*.js',
                tasks: ['embed_require:dev', 'mocha_html']
            },
            css: {
                files: 'src/sass/**/*.scss',
                tasks: ['compass:dev']
            }
        },
        compass: {
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
        },
        embed_require: {
            dev: {
                src: 'src/js',
                dest: 'js'
            }
        },
        mocha_html: {
            all: {
                src   : [ 'js/sub.js' ],
                test  : [ 'test/*-test.js' ],
                assert : 'chai'
            }
        },
        mocha_phantomjs: {
            all: [ 'test/*.html' ]
        },
        koko: {
            dev: {
                openPath: '/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-embed-require');
    grunt.loadNpmTasks('grunt-mocha-html');
    grunt.loadNpmTasks('grunt-mocha-phantomjs');
    grunt.loadNpmTasks('grunt-koko');

    grunt.registerTask('build', ['compass:dev', 'embed_require:dev', 'mocha_html']);
    grunt.registerTask('server', ['koko:dev']);
    grunt.registerTask('test', ['mocha_phantomjs']);

    grunt.registerTask('default', ['build']);
};