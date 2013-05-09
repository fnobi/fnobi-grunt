exports.description = 'web page template (compass + requirejs + mocha + koko)';

// Template-specific notes to be displayed before question prompts.
exports.notes = '';

// Template-specific notes to be displayed after question prompts.
exports.after = '';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function (grunt, init, done) {
    init.process( {}, [
        init.prompt('name'),
        init.prompt('description')
    ], function(err, props) {
        // Files to copy (and process).
        var files = init.filesToCopy(props);

        // Actually copy (and process) files.
        init.copyAndProcess(files, props, {});

        // Generate package.json file, used by npm and grunt.
        init.writePackageJSON('package.json', {
            name            : props.name,
            description     : props.description,
            version         : '0.1.0',
            npm_test        : 'grunt test',
            node_version    : '>=0.8.0 <0.9.1',
            devDependencies : {
                'grunt'                   : '~0.4.0',
                'grunt-contrib-watch'     : '~0.1.1',
                'grunt-contrib-compass'   : '~0.1.3',
                'grunt-mocha-html'        : '~0.0.1',
                'grunt-mocha-phantomjs'   : '~0.2.7',
                'grunt-contrib-copy'      : '~0.4.1',
                'grunt-koko'              : '~0.1.0',
                'chai'                    : '~1.6.0',
                'mocha'                   : '~1.9.0'
            }
        });

        // All done!
        done();
    });
};
