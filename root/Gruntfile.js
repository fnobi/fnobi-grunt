module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            javascripts: {
                files: 'src/js/**/*.js',
                tasks: []
            },
            stylesheets: {
                files: 'src/sass/*.scss',
                tasks: ['compass:dev']
            }
        },
        compass: {
            dist: {
                options: {
                    config: 'config/compass.config.dist.rb',
                    environment: 'production'
                }
            },
            dev: {
                options: {
                    config: 'config/compass.config.dev.rb',
                    environment: 'development'
                }
            }
        },
        mocha_phantomjs: {
            all: ['test/*.html']
        },
        koko: {
            dev: {
                openPath: '/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-koko');
    grunt.loadNpmTasks('grunt-mocha-phantomjs');

    grunt.registerTask('init', ['compass:dev']);
    grunt.registerTask('server', ['koko:dev']);
    grunt.registerTask('test', ['mocha_phantomjs']);

    grunt.registerTask('default', ['init']);
};