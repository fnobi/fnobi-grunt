requirejs.config({
        paths: {
                'jquery': 'lib/jquery-1.9.0.min'
        },
        shim: {
                'jquery': {
                        exports: 'jQuery'
                },
                main: {
                        deps: [ 'jquery', 'sub' ]
                },
                sub: {
                        exports: 'hogehoge'
                }
        },
        modules: [
                {
                        name: 'main'
                }
        ]
});