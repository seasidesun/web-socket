'use strict';

var App = require('../');

var app = new App('Chatroom', 'app01', 8080, false);
var room = app.createRoom('friends', 'room01', []);

var receiveHandler = function (msg) {
    var data = {
        content: msg.info.content,
        name: msg.info.name
    }
    this.state.push(data);
    return data;
}
room.setReceiveHandler(receiveHandler);
