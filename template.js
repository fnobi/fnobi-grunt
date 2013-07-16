exports.description = 'web page template (compass + auto deps + mocha + koko)';

// Template-specific notes to be displayed before question prompts.
exports.notes = '';

// Template-specific notes to be displayed after question prompts.
exports.after = '';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function (grunt, init, done) {
    // custom methods
    require('./customMethods')(grunt, init);

    init.process( {}, [
        init.prompt('name'),
        init.prompt('description'),
        init.boolPrompt('with_test', 'With mocha test?'),
        init.boolPrompt('with_ejs', 'With ejs template?')
    ], function(err, props) {
        // Files to copy (and process).
        var files = init.filesToCopy(props);

        init.boolProps(props);

        var pkg = {
            name: props.name,
            description: props.description,
            version: '0.0.0',
            scripts: { },
            engines: {
                node: '>=0.8.0 <0.9.1'
            },
            devDependencies: {
                'grunt': '~0.4.0',
                'grunt-contrib-watch': '~0.1.1',
                'grunt-contrib-compass': '0.3.0',
                'grunt-auto-deps': 'git://github.com/nobii/grunt-auto-deps.git',
                'grunt-koko': '~0.1.0',
                "grunt-simple-ejs": "git://github.com/nobii/grunt-simple-ejs.git",
                'grunt-mocha-html': '0.0.1',
                'grunt-mocha-phantomjs': '~0.2.8',
                'mocha': '~1.9.0',
                'chai': '~1.6.1'
            }
        };

        if (!props.with_test) {
            init.escapeFiles('test/*.*', files);
            delete pkg.devDependencies['grunt-mocha-html'];
            delete pkg.devDependencies['grunt-mocha-phantomjs'];
            delete pkg.devDependencies['chai'];
            delete pkg.devDependencies['mocha'];
        }

        if (!props.with_ejs) {
            init.escapeFiles('src/ejs/**/*.*', files);
            delete pkg.devDependencies['grunt-simple-ejs'];
        } else {
            init.escapeFiles('index.html', files);
        }

        // Actually copy (and process) files.
        init.copyAndProcess(files, props, {});

        // write package.json
        init.writePackageJSON('package.json', pkg);

        // All done!
        done();
    });
};

