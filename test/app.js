'use strict';

var Game = require('../');

var game = new Game('chat', '0001', 8080);
var room = game.createRoom('100包', '1001', []);

room.setReceiveHandler(function (msg) {
    var data = {
        content: msg.info,
        clientId: msg.clientId
    }
    this.info.push(data);
    return data;
})
