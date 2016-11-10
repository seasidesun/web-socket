'use strict';

var Room = function (name, Id, initData) {
    var _this = this;

    if (!name || !Id || !initData) return;
    _this.name = name;
    _this.Id = Id;
    _this.state = JSON.parse(JSON.stringify(initData));

    _this.clients = new Map();

    _this.joinRoom = function (clientId, conn) {
        _this.joinHandler(conn);
        _this.clients.set(clientId, conn);
        return;
    }

    _this.leaveRoom = function (clientId) {
        var client = _this.clients.get(clientId);
        client && client.close && client.close();
        _this.clients.delete(clientId);
        return;
    }

    _this.clear = function () {
        _this.clients.forEach(function (conn, clientId) {
            conn && conn.close && conn.close();
            _this.clients.delete(clients);
        });
        return;
    }

    _this.syncData = function (clientId) {
        var client = _this.clients.get(clientId);
        _this.joinHandler(client);
        return;
    }

    _this.receiveMsg = function (msg) {
        if (!_this.clients.get(msg.clientId)) return;

        var data = _this.receiveHandler(msg);
        _this.distributeData(data);
        return;
    }

    _this.distributeData = function (data) {
        _this.clients.forEach(function (conn, clientId) {
            _this.sendHandler(conn, 'info', data)
        });
        return;
    }

    _this.joinHandler = function (conn) {
        return _this.sendHandler(conn, 'join');
    }

    _this.receiveHandler = function (msg) {
        _this.state.push(msg.info);
        return msg.info;
    }

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
