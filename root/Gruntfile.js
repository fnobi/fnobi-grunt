module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            javascripts: {
                files: 'src/js/**/*.js',
                tasks: ['jstask:dev']
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
        copy: {
            dev: {
                files: [
                    { expand: true, cwd: 'src/js/', src: ['**'], dest: 'js/' }
                ]
            }
        },
        jstask: {
            dev: { type: 'copy' },
            dist: { type: 'requirejs' }
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

    // targetによって、jsの処理を切り替えるためのtask
    grunt.registerMultiTask('jstask', 'process js files.', function () {
        var target = this.target;
        var config = grunt.config('jstask')[target];
        grunt.task.run([ config.type + ':' + (config.target || target)]);
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-koko');
    grunt.loadNpmTasks('grunt-mocha-phantomjs');

    grunt.registerTask('init', ['compass:dev', 'jstask:dev']);
    grunt.registerTask('server', ['koko:dev']);
    grunt.registerTask('test', ['mocha_phantomjs']);

    grunt.registerTask('default', ['init']);
};