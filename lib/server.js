'use strict';

var WebSocketServer = require('websocket').server;
var http = require('http');

//var cookie = "536835E470C88B4C";

var count = 1;
function server(room, port) {
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
        // console.log(request.cookies);
        room.clients.set(count++, connection);

        connection.on('message', function(message) {
            var data = '';
            if (message.type === 'utf8') {
                console.log('Received Message: ' + message.utf8Data);
                data = message.utf8Data;
            }
            else if (message.type === 'binary') {
                console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
                data = message.binaryData;
            }

            room.pull(data);
        });
        connection.on('close', function(reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        });
    });
    return wsServer;
}

module.exports = server;
