'use strict';

var Room = function (name, Id) {
    var _this = this;

    _this.name = name;
    _this.Id = Id;
    _this.content = [];

    _this.clients = new Map();

    _this.joinRoom = function (clientId, conn) {
        conn.send(JSON.stringify(_this.content));
        return _this.clients.set(clientId, conn);
    }

    _this.leaveRoom = function (clientId) {
        var client = _this.clients.get(clientId);
        client && client.close && client.close();
        return _this.clients.delete(clientId);
    }

    _this.clearRoom = function () {
        _this.clients.forEach(function (item) {
            item && item.close && item.close();
        });
        return;
    }

    _this.syncData = function (clientId) {
        var client = _this.clients.get(clientId);
        client.send(_this.content);
    }

    _this.receiveMsg = function (msg) {
        var data = _this.msgHandler(msg);
        _this.content.push(data);
        _this.distributeData(data);
    }

    _this.distributeData = function (data) {
        _this.clients.forEach(function (conn, clientId) {
            conn.send(data);
        });
        return;
    }

    _this.msgHandler = function (msg) {
        return msg;
    }

    _this.setMsgHandler = function (fn) {
        _this.msgHandler = fn;
    }

    return _this;
}

module.exports = Room;
