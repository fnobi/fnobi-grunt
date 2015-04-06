var fs = require('fs');
var yaml = require('js-yaml');

module.exports = {
    readConfig: function (configs) {
        var result = {};
        configs.forEach(function (conf) {
            var obj = {};
            if (typeof conf == 'string') {
                if (/\.yaml/.test(conf)) {
                    obj = this.readYAML(conf);
                }
            } else if (typeof conf == 'object') {
                obj = conf;
            }

            for (var key in obj) {
                result[key] = obj[key];
            }
        }.bind(this));
        return result;
    },
    readYAML: function (src) {
        var obj = null;
        try {
            obj = yaml.safeLoad(fs.readFileSync(src, 'utf8'));
        } catch (e) { /* do nothing */ }
        return obj;
    }
};







