var escapeFiles = require('./lib/escapeFiles'),
    shellLines = require('./lib/shellLines');

exports.description = 'web page template (compass + auto deps + mocha + koko)';

// Template-specific notes to be displayed before question prompts.
exports.notes = '';

// Template-specific notes to be displayed after question prompts.
exports.after = '';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function (grunt, init, done) {

    // override template delimiter
    grunt.template.addDelimiters('init', '/*[', ']*/');

    init.process({}, [
        init.prompt('name'),
        init.prompt('description'),
        init.prompt('version'),
        init.prompt('repository'),
        init.prompt('homepage'),
        init.prompt('author_name'),
        init.prompt('author_email'),
        {
            name: 'template_engine',
            message: 'template engine',
            default: 'jade',
            validator: /^(jade|ejs)$/
        },
        {
            name: 'task_runner',
            message: 'task runner. [grunt|gulp]',
            default: 'gulp',
            validator: /^(grunt|gulp)$/
        },
        {
            name: 'with_test',
            message: 'use mocha test. [Y|n]',
            default: 'n',
            validator: /^(Y|n)$/
        }
    ], function(err, props) {
        // package setting
        var devDeps = {
            'grunt-release': '~0.5.1',
            'mocha': '~1.9.0',
            'chai': '~1.6.1'
        };

        var scripts = {
            preinstall: "npm -g install grunt-cli",
            start: "grunt server",
            build: "grunt dev",
            start: "gulp server",
            build: "gulp build",
            watch: "gulp watch"
        };

        switch(props.task_runner) {
        case 'gulp': 
            devDeps["gulp"] = "3.*";
            devDeps["gulp-ruby-sass"] = "1.*";
            devDeps["gulp-jade"] = "1.*";
            devDeps["js-yaml"] = "3.*";
            devDeps["koko"] = "0.*";
            devDeps["varline"] = "1.*";

            scripts["start"] = "gulp server";
            scripts["build"] = "gulp build";
            scripts["watch"] = "gulp watch";

            break;
        case 'grunt':
            devDeps['grunt'] = '~0.4.0';
            devDeps['grunt-este-watch'] = 'git://github.com/fnobi/grunt-este-watch.git';
            devDeps['grunt-contrib-copy'] = '0.5.0';
            devDeps['grunt-contrib-compass'] = '0.3.0';
            devDeps['grunt-contrib-jade'] = '0.12.0';
            devDeps["grunt-contrib-uglify"] = "^0.6.0";
            devDeps['grunt-auto-deps'] = '0.4.3';
            devDeps['grunt-koko'] = '0.1.1';
            devDeps['grunt-simple-ejs'] = '0.3.0';
            devDeps['grunt-mocha-html'] = '0.1.0';
            devDeps['grunt-mocha-phantomjs'] = '~0.2.8';
            devDeps["grunt-html-validation"] = "~0.1.18";

            scripts["preinstall"] = "npm -g install grunt-cli";
            scripts["start"] = "grunt server";
            scripts["build"] = "grunt dev";

            break;
        }

        var pkg = {
            name: props.name,
            description: props.description,
            version: props.version,
            scripts: scripts,
            engines: {
                node: '>=0.10.26'
            },
            devDependencies: devDeps
        };

        // bower setting
        var bower = {
            name: props.name,
            version: props.version,
            main: 'index.html',
            dependencies: {
                'html5shiv': '~3.7.2',
                'jquery': '~1.10.*'
            }
        };


        // add template info to props.
        props.template_name = 'me';

        props.project_path = process.cwd();

        props.camelCasedName = (function (name) {
            var parts = name.split(/-|_/);
            var camelCased = parts.shift();
            parts.forEach(function (part) {
                camelCased += [
                    part.substr(0, 1).toUpperCase(),
                    part.substr(1)
                ].join('');
            });
            return camelCased;
        })(props.name);

        props.with_test = props.with_test == 'Y';

        props.pkg = pkg;
        props.bower = bower;


        // Files to copy (and process).
        var files = init.filesToCopy(props);

        if (props.task_runner != 'gulp') {
            escapeFiles('src/gulpfile.js', files);
            escapeFiles('src/task-util.js', files);
        }
        if (props.task_runner != 'grunt') {
            escapeFiles('src/Gruntfile.js', files);
        }
        if (props.template_engine != 'jade') {
            escapeFiles('src/jade/*.*', files);
            escapeFiles('src/jade/**/*.*', files);
            delete pkg.devDependencies['grunt-contrib-jade'];
        }
        if (props.template_engine != 'ejs') {
            escapeFiles('src/ejs/*.*', files);
            escapeFiles('src/ejs/**/*.*', files);
            delete pkg.devDependencies['grunt-simple-ejs'];
        }
        if (!props.with_test) {
            escapeFiles('src/test/*.*', files);
            delete pkg.devDependencies['grunt-mocha-html'];
            delete pkg.devDependencies['grunt-mocha-phantomjs'];
            delete pkg.devDependencies['chai'];
            delete pkg.devDependencies['mocha'];
        }


        // Actually copy (and process) files.
        init.copyAndProcess(files, props, {});

        // write package.json
        init.writePackageJSON('src/package.json', pkg, function (pkg, props) {
            pkg.engines = props.engines;
            pkg.scripts = props.scripts;
            return pkg;
        });

        // write bower.json
        init.writePackageJSON('src/bower.json', bower);

        // npm install & bower install
        shellLines([{
            command: 'cd src; npm install',
            message: 'Installing npm dependencies'
        },{
            command: 'cd src; bower install',
            message: 'Installing bower dependencies'
        },{
            command: 'git init; git add .; git commit -m "scaffold."',
            message: 'Initialize git'
        }], done);
    });
};
