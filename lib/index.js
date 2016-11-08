'use strict';

var Server = require('./server');
var Room = require('./room');

var Game = function (name, Id, port) {
    var _this = this;

    if (!name || !Id || !port) callback(new Error('name, Id, port cannot be null'));
    _this.server  = new Server(_this, (port || 8080));

    _this.Id = Id;
    _this.name = name;
    _this.port = port;

    _this.RoomMap = new Map();

    _this.createRoom = function (roomName, roomId) {
        var roomIns = new Room(roomName, roomId);
        _this.RoomMap.set(roomId, roomIns);
        return roomIns;
    }

    _this.removeRoom = function (roomId) {
        _this.RoomMap.get(roomId).clearRoom();
        _this.RoomMap.delete(roomId);
        return;
    }

    _this.clearGame = function () {
        _this.RoomMap.forEach(function (roomIns) {
            roomIns.clearRoom();
        });
        return;
    }

    _this.reciveMsg = function (roomId, msg) {
        var roomIns = RoomMap.get(roomId);
        roomIns.reciveMsg(msg);
        return;
    }

    return _this;
}

module.exports = Game;
