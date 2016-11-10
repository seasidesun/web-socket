'use strict';

var SocketSrv = require('./socket_srv');
var Room = require('./room');

var App = function (name, Id, port) {
    var _this = this;

    if (!name || !Id || !port) return;
    _this.server  = new SocketSrv(_this, (port || 8080));

    _this.Id = Id;
    _this.name = name;
    _this.port = port;

    _this.Rooms = new Map();

    _this.createRoom = function (roomName, roomId, initData) {
        var roomIns = new Room(roomName, roomId, initData);
        _this.Rooms.set(roomId, roomIns);
        return roomIns;
    }

    _this.removeRoom = function (roomId) {
        var roomIns = _this.Rooms.get(roomId);
        if (!roomIns) return;

        roomIns.clearRoom();
        _this.Rooms.delete(roomId);
        return;
    }

    _this.clear = function () {
        _this.Rooms.forEach(function (roomIns, roomId) {
            roomIns.clear();
            _this.Rooms.delete(roomId);
        });
        return;
    }

    _this.receiveMsg = function (msg, conn) {
        if (!msg.gameId || !msg.roomId || !msg.clientId || !msg.info || !msg.type) return;

        var roomIns = _this.Rooms.get(msg.roomId);
        if (!roomIns) return;

        switch (msg.type) {
            case 'join':
                roomIns.joinRoom(msg.clientId, conn);
                break;
            case 'info':
                roomIns.receiveMsg(msg);
                break;
            default:
        }
        return;
    }

    return _this;
}

module.exports = App;
