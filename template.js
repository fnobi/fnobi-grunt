exports.description = 'my Gruntfile (compass + jasmine + Requirejs)';

// Template-specific notes to be displayed before question prompts.
exports.notes = '';

// Template-specific notes to be displayed after question prompts.
exports.after = '';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function (grunt, init, done) {
    init.process( {}, [
        init.prompt('name')
    ], function(err, props) {
        // Files to copy (and process).
        var files = init.filesToCopy(props);

        // Actually copy (and process) files.
        init.copyAndProcess(files, props, {});

        // Generate package.json file, used by npm and grunt.
        init.writePackageJSON('package.json', {
            name            : props.name,
            version         : '0.1.0',
            npm_test        : 'grunt test',
            node_version    : '>=0.8.0 <0.9.1',
            devDependencies : {
                'grunt'                   : '~0.4.0',
                'grunt-contrib-watch'     : '~0.1.1',
                'grunt-contrib-compass'   : '~0.1.3',
                'grunt-contrib-requirejs' : '~0.4.0',
                'grunt-contrib-jasmine'   : '~0.4.1'
            }
        });

        // All done!
        done();
    });
};
