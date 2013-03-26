module.exports = function(grunt) {
        grunt.initConfig({
                pkg: grunt.file.readJSON('package.json'),
                watch: {
                        javascripts: {
                                files: 'src/**/*.js',
                                tasks: ['requirejs', 'jasmine']
                        },
                        stylesheets: {
                                files: 'sass/*.scss',
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
                requirejs: {
                        compile: {
                                options: {
                                        baseUrl: "src",
                                        mainConfigFile: 'config/requirejs.main.js',
                                        dir: 'javascripts',

                                        wrap: {
                                                start: '(function () {',
                                                end: '}());'
                                        },

                                        keepBuildDir: true,
                                        generateSourceMaps: true,
                                        preserveLicenseComments: false,
                                        optimize: 'uglify2'
                                }
                        }
                },
                jasmine: {
                        src: 'src/**/*.js',
                        options: {
                                specs:   'spec/*Spec.js',
                                helpers: 'spec/*Helper.js'
                        }
                }
        });

        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-contrib-compass');
        grunt.loadNpmTasks('grunt-contrib-requirejs');
        grunt.loadNpmTasks('grunt-contrib-jasmine');

        grunt.registerTask('default', ['watch']);
        grunt.registerTask('test', ['jasmine']);
};