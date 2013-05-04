(function () {
    var config  = {
        paths: {
            jquery: 'lib/jquery-1.9.0.min'
        },
        shim: {
            main: {
                deps: [ 'jquery', 'sub' ]
            }
        },
        modules: [{
            name: 'main',
            route: '/'
        }]
    };

    var path = location.pathname;
    var modules = [];
    config.modules.forEach(function (module) {
        if (path.match(new RegExp('^' + module.route + '$'))) {
            modules.push(module.name);
        }
    });

    requirejs.config(config);
    require(modules);
})();
