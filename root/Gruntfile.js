module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            js: {
                files: 'src/js/**/*.js',
                tasks: ['copy:js']
            },
            css: {
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
        copy: {
            js: {
                files: [
                    { expand: true, cwd: 'src/js/', src: ['**'], dest: 'js/' }
                ]
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

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-mocha-phantomjs');
    grunt.loadNpmTasks('grunt-koko');

    grunt.registerTask('init', ['compass:dev', 'copy:js']);
    grunt.registerTask('server', ['koko:dev']);
    grunt.registerTask('test', ['mocha_phantomjs']);

    grunt.registerTask('default', ['init']);
};