exports.description = 'web page template (compass + auto deps + mocha + koko)';

// Template-specific notes to be displayed before question prompts.
exports.notes = '';

// Template-specific notes to be displayed after question prompts.
exports.after = [
    '',
    'initialize project: source tools/init.sh',
    'reset project:      source tools/reset.sh'
].join('\n');

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function (grunt, init, done) {
    // custom methods
    require('./customMethods')(grunt, init);

    init.process( {}, [
        init.prompt('name'),
        init.prompt('description'),
        init.prompt('version'),
        init.prompt('repository'),
        // init.prompt('homepage'),
        // init.prompt('bugs'),
        init.prompt('licenses'),
        init.prompt('author_name'),
        init.prompt('author_email'),
        // init.prompt('author_url'),
        // init.prompt('jquery_version'),
        {
            name: 'options',
            message: 'choose using options from [test,ejs] or "none".',
            default: 'test,ejs',
            validator: /^((none|test|ejs),?)*$/
        },
        {
            name: 'project_type',
            message: 'choose project type from [production,library].',
            default: 'production',
            validator: /^(production|library)$/
        }
    ], function(err, props) {
        // package setting
        var pkg = {
            name: props.name,
            description: props.description,
            version: props.version,
            scripts: { },
            engines: {
                node: '>=0.8.0 <0.9.1'
            },
            devDependencies: {
                'grunt': '~0.4.0',
                'grunt-contrib-watch': '~0.1.1',
                'grunt-contrib-compass': '0.3.0',
                'grunt-auto-deps': '0.0.5',
                'grunt-koko': '0.1.1',
                'grunt-simple-ejs': '0.1.1',
                'grunt-mocha-html': '0.0.1',
                'grunt-mocha-phantomjs': '~0.2.8',
                'grunt-release': '~0.5.1',
                'mocha': '~1.9.0',
                'chai': '~1.6.1'
            }
        };

        // bower setting
        var bower = {
            'name': props.name,
            'version': props.version,
            'main': 'index.html',
            'dependencies': {
                'ejs-head-modules': '~0.1.0',
                'ejs-sns-modules': '~0.1.1',
                'jquery': '~2.0.3'
            }
        };


        // add template info to props.
        props.template_name = 'me';

        props.project_path = process.cwd();

        props.with_test = props.options.indexOf('test') >= 0;
        props.with_ejs = props.options.indexOf('ejs') >= 0;

        props.pkg = pkg;
        props.bower = bower;


        // Files to copy (and process).
        var files = init.filesToCopy(props);

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
            delete bower.dependencies['ejs-head-modules'];
            delete bower.dependencies['ejs-sns-modules'];
        } else {
            init.escapeFiles('index.html', files);
        }

        if (props.project_type == 'production') {
            init.escapeFiles('README.md', files);
        }

        // Actually copy (and process) files.
        init.copyAndProcess(files, props, {});

        // write package.json
        init.writePackageJSON('package.json', pkg);

        // write bower.json
        init.writePackageJSON('bower.json', bower);

        // All done!
        done();
    });
};

