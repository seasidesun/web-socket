'use strict';

// create room for app
// the initData is used to initialize the room data
var Room = function (name, Id, initData) {
    var _this = this;

    if (!name || !Id || !initData) return;
    _this.name = name;
    _this.Id = Id;
    _this.state = JSON.parse(JSON.stringify(initData));

    _this.clients = new Map();

    // join room
    _this.joinRoom = function (clientId, conn) {
        _this.joinHandler(conn);
        _this.clients.set(clientId, conn);
        return;
    }

    // leave room
    _this.leaveRoom = function (clientId) {
        var client = _this.clients.get(clientId);
        client && client.close && client.close();
        _this.clients.delete(clientId);
        return;
    }

    // clear all the clients of the room
    _this.clear = function () {
        _this.clients.forEach(function (conn, clientId) {
            conn && conn.close && conn.close();
            _this.clients.delete(clients);
        });
        return;
    }

    // sync data from server to client,
    // default, will run the joinHandler which send all the state to the client for sync
    _this.syncData = function (clientId) {
        var client = _this.clients.get(clientId);
        _this.joinHandler(client);
        return;
    }

    // run when the client send data, call by the app when data in
    _this.receiveMsg = function (msg) {
        if (!_this.clients.get(msg.clientId)) return; // client check

        // handle the msg, and send the data to other clients
        var data = _this.receiveHandler(msg);
        _this.distributeData(data);
        return;
    }

    // default, the data from client will be pushed to the state directly
    // and return the msg.info which will be sent to other clients
    // u can custom the handler, and set the initData at the same time by yourself is a good idea
    _this.receiveHandler = function (msg) {
        _this.state.push(msg.info);
        return msg.info;
    }

    // call when the data have been handle
    _this.distributeData = function (data) {
        _this.clients.forEach(function (conn, clientId) {
            _this.sendHandler(conn, 'info', data)
        });
        return;
    }

    // default, the room state will be sent
    // u can set this handler by yourself
    _this.joinHandler = function (conn) {
        return _this.sendHandler(conn, 'join');
    }

    // the setXXX fun is to custom the handler
    _this.setJoinHandler = function (fn) {
        return _this.joinHandler = fn.bind(_this);
    }

    _this.setReceiveHandler = function (fn) {
        return _this.receiveHandler = fn.bind(_this);
    }

    _this.sendHandler = function (conn, type, info) {
        var needSended = {
            type: type,
            info: info || _this.state,
            time: Date.now()
        };

        return conn.send(JSON.stringify(needSended));
    }

    return _this;
}

module.exports = Room;
