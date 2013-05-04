requirejs.config({
    paths: {
        jquery: 'lib/jquery-1.9.0.min'
    },
    shim: {
        main: {
            deps: [ 'jquery', 'sub' ]
        }
    },
    modules: [
        { name: 'main' }
    ]
});

require(['main']);