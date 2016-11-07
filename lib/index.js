'use strict';

var Server = require('./server');

var app = function (port) {
    var _this = this;

    _this.clients = new Map(); // save the clients
    _this.content  = []; //data that haved sended
    _this.forward  = []; //data that need to send to other client

    _this.server  = new Server(_this, (port || 8080)); //server
    _this.push = function (msg) {
        _this.clients.forEach(function (conn, id) {
            conn.send(msg);
        });
    }

    _this.pull = function (msg) {
        _this.content.push(msg);
        _this.push(msg);
    }
}

module.exports = app;
