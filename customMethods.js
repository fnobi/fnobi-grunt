module.exports = function (grunt, init) {
    init.escapeFiles = function (pattern, files) {
        for (var i in files) {
            var mtch = grunt.file.isMatch({ matchBase: true }, pattern, i);
            if (mtch) { delete files[i]; }
        }
    };

    var boolNames = [],
        trueChar = 'y',
        falseChar = 'N';

    init.boolPrompt = function (name, message, defaultTrue) {

        if (!name) {
            // nameが無い場合、grunt-init 側のerrorで警告してもらう
            return {};
        }

        boolNames.push(name);

        return {
            name: name,
            message: [(message || name), ' (', trueChar, '|', falseChar, ')'].join(''),
            default: defaultTrue ? trueChar : falseChar,
            validator: new RegExp('^[' + trueChar + falseChar + ']'),
            warning: 'Must be "' + trueChar + '" or "' + falseChar + '".'
        };
    };

    init.boolProps = function (props) {
        boolNames.forEach(function (name) {
            props[name] = props[name].indexOf(falseChar) < 0 ? true : false;
        });
    };
};


