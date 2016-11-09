'use strict';

var Room = function (name, Id, initData) {
    var _this = this;

    _this.name = name;
    _this.Id = Id;
    _this.info = JSON.parse(JSON.stringify(initData));

    _this.clients = new Map();

    _this.joinRoom = function (clientId, conn) {
        _this.joinHandler(conn)
        return _this.clients.set(clientId, conn);
    }

    _this.leaveRoom = function (clientId) {
        var client = _this.clients.get(clientId);
        client && client.close && client.close();
        return _this.clients.delete(clientId);
    }

    _this.clear = function () {
        _this.clients.forEach(function (item) {
            item && item.close && item.close();
        });
        return;
    }

    _this.syncData = function (clientId) {
        var client = _this.clients.get(clientId);
        _this.joinHandler(client);
    }

    _this.receiveMsg = function (msg) {
        var data = _this.receiveHandler(msg);
        _this.distributeData(data);
    }

    _this.distributeData = function (data) {
        _this.clients.forEach(function (conn, clientId) {
            _this.sendHadnler(conn, 'info', data)
        });
        return;
    }

    _this.joinHandler = function (conn) {
        return _this.sendHadnler(conn, 'init');
    }

    _this.receiveHandler = function (msg) {
        _this.info.push(msg.info);
        return msg.info;
    }

    _this.setJoinHandler = function (fn) {
        _this.joinHandler = fn;
    }

    _this.setReceiveHandler = function (fn) {
        _this.receiveHandler = fn;
    }

    _this.sendHadnler = function (conn, type, info) {
        return conn.send(JSON.stringify({
            type: type,
            info: info || _this.info
            time: Date.now()
        }));
    }

    return _this;
}

module.exports = Room;
