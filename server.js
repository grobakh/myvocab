var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: 8080 });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

var options = {
    opsInterval: 1000,
    reporters: [{
        reporter: require('good-console'),
        args:[{ log: '*', response: '*' }]
    }, {
        reporter: require('good-file'),
        args: ['server.log', { ops: '*' }]
    }]
};

server.register({
    register: require('good'),
    options: options
}, function (err) {

    if (err) {
        server.log('error', err);
    }
    else {
        server.start(function () {
            server.log('info', 'Server started at ' + server.info.uri);
        });
    }
});