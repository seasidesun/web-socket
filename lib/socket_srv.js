'use strict';

var WebSocketServer = require('websocket').server;
var http = require('http');

function server(appSrv, port) {
    newWsServer(port, function (err, wsServer) {
        wsServer.on('request', function(request) {
            var connection = request.accept('echo-protocol', request.origin);
            console.log((new Date()) + ' Connection accepted.');

            connection.on('message', function(message) {
                var data = getDataFromWs(message);
                appSrv.receiveMsg(data, connection);
            });

            connection.on('close', function(reasonCode, description) {
                console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
            });
        });
        return wsServer;
    });

}

function newWsServer(port, callback) {
    var server = http.createServer(function(request, response) {
        console.log((new Date()) + ' Received request for ' + request.url);
        response.writeHead(404);
        response.end();
    });

    server.listen(port || 8080, function() {
        console.log((new Date()) + ' Server is listening on port ' + port || 8080);
    });

    var wsServer = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: false
    });

    callback(null, wsServer);
}


function getDataFromWs(message) {
    var data = '';
    if (message.type === 'utf8') {
        console.log('Received Message: ' + message.utf8Data);
        data = message.utf8Data;
    }
    else if (message.type === 'binary') {
        console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        data = message.binaryData;
    }
    try {
        data = JSON.parse(data);
        return data;
    } catch (e) {
        console.error('JSON parse error');
    }
}

module.exports = server;
