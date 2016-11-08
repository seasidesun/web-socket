'use strict';

var WebSocketServer = require('websocket').server;
var http = require('http');

// var cookie_pre = "536835E470C88B4C";

function server(gameSrv, port) {
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

    wsServer.on('request', function(request) {
        var connection = request.accept('echo-protocol', request.origin);
        console.log((new Date()) + ' Connection accepted.');

        connection.on('message', function(message) {
            var data = getDataFromSo(message);
            gameSrv.receiveMsg(data, connection);
        });

        connection.on('close', function(reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        });
    });

    function getDataFromSo(message) {
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

    return wsServer;
}

module.exports = server;
