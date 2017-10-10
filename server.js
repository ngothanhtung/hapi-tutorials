'use strict';

const Hapi = require('hapi');
var path = require('path');
var db = require('./helpers/MongoDbHelper');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 9000
});

const data = [{
        id: 1,
        name: 'Samsung Galaxy S8',
        price: 900
    },
    {
        id: 2,
        name: 'Samsung Galaxy S8+',
        price: 1000
    }
];

// Static files
server.route({
    method: 'GET',
    path: '/public/{filename*}',
    handler: function (request, reply) {
        reply.file("./public/" + request.params.filename);
    }
});


// Get
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

// Add the route
server.route({
    method: 'GET',
    path: '/data',
    handler: function (request, reply) {
        reply(data);
    }
});

//Path
server.route({
    method: 'GET',
    path: '/hello/{user}',
    handler: function (request, reply) {
        reply('Hello ' + encodeURIComponent(request.params.user) + '!');
    }
});


// Optional parameters
// server.route({
//     method: 'GET',
//     path: '/hello/{user?}',
//     handler: function (request, reply) {
//         const user = request.params.user ? encodeURIComponent(request.params.user) : 'stranger';
//         reply('Hello ' + user + '!');
//     }
// });

// Multi-segment parameters
server.route({
    method: 'GET',
    path: '/hello/{user}/{deparmemnt}',
    handler: function (request, reply) {
        const user = request.params.user ? encodeURIComponent(request.params.user) : 'stranger';
        const deparmemnt = request.params.deparmemnt ? encodeURIComponent(request.params.deparmemnt) : 'unknown';
        reply('Hello ' + user + ' @ ' + deparmemnt + '!');
    }
});

// Static entry
server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/react',
        handler: function (request, reply) {
            reply.file('./public/index.html');
        }
    });
});


// MongoDB
// GET ALL
server.route({
    method: ['GET'],
    path: '/product/all',
    handler: function (request, reply) {        
        var collectionName = 'products';
        db.findDocuments({}, collectionName, function (result) {
            reply(result);
        });
    }
});


// GET BY ID => DETAILS
server.route({
    method: ['GET'],
    path: '/product/{id}',
    handler: function (request, reply) {
        var id = request.params.id;
        var collectionName = 'products';
        db.findDocument(id, collectionName, function (result) {            
            reply(result);
        });
    }
});

// POST => INSERT
server.route({
    method: ['POST'],
    path: '/product',
    handler: function (request, reply) {
        var product = request.payload;
        var collectionName = 'products';
        db.insertDocument(product, collectionName, function (result) {
            reply(result);
        });

    }
});

// POST => EDIT
server.route({
    method: ['PUT'],
    path: '/product/{id}',
    handler: function (request, reply) {
        var id = request.params.id;
        console.log(id);
        var product = request.payload;
        console.log(product);
        var collectionName = 'products';
        db.updateDocument(id, product, collectionName, function (result) {
            reply(result);
        });
    }
});

// POST => DELETE
server.route({
    method: ['DELETE'],
    path: '/product/{id}',
    handler: function (request, reply) {
        var id = request.params.id;
        var collectionName = 'products';
        db.removeDocument(id, collectionName, function (result) {
            reply(result);
        });
    }
});

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});