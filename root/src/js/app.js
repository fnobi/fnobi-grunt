(function () {
    var config  = {
        baseUrl: 'js',
        paths: {
            jquery: 'lib/jquery-1.9.0.min'
        },
        shim: {
            main: {
                deps: [ 'jquery', 'sub' ],
                route: '/'
            }
        }
    };

    var path = location.pathname, modules = [], route, name;

    for (name in config.shim) {
        route = config.shim[name].route;
        if (!route) {
            continue;
        }
        if (path.match(new RegExp('^' + route + '$'))) {
            modules.push(name);
        }
    };

    requirejs.config(config);
    require(modules);
})();
