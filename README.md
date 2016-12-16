## web-socket

##### Version 2.0

A `node server` for `websocket`, can `customize function` to handler the server or client data.

##### Install

```
npm install git://github.com/seasidesun/web-socket --save

```

##### Usage

```
var app  = new App(appName, appId, portOfWebSocket);
var room = app.createRoom(rooName, roomId, initState);
```

##### Eg:

You can find the eg under the file [test](./test), just like :

```
cd ./test && node app.js
open the ./test/index.html
...
```

Below is some detail

###### server

```
var App = require('web-socket');

var app = new App('Chatroom', 'app01', 8080);
var room = app.createRoom('friends', 'room01', []);
```
Create a App as `Chatroom`, the App is listen at port: `8080`, and then add a room named friends, the email as your id. The `[]` Array is used to init the `state` which will save the chat content that sended by the clients.

###### client

```
var client = new WebSocket('ws://127.0.0.1:8080', 'echo-protocol');
	client.onmessage = function (ret) {
		console.log("MSG: %s", ret.data);
	}
```

In the browser, build a `WebSocket` to connect the `server`,  we can send word to the server, and the server will `distribut` to every client which will use `onmessage` to receieve data form server.

Before send msg, must send the `join` info to server, this step will send your clientId :

```
var msg = {
	type: 'join',
	appId: 'app01',
	roomId: 'room01',
	clientId: '3E30J3S8TJXXXXXXXX',
	info: 'Hello'
}
client.send(JSON.stringify(msg));
```

When the server get the join info, it will send `Chatroom data(the state)` to the client, this data include all the chat info sended by other client before

Now you can chat with others like this :

```
var msg = {
	type: 'info',
	appId: 'app01',
	roomId: 'room01',
	clientId: '3E30J3S8TJXXXXXXXX',
	info: 'Hi, long time no see'
}
client.send(JSON.stringify(msg));
```

##### Feature: Handler function

The chat info that be `distribut` to clients perhaps include ont only the word, you could need show user's name when chat. So we can send also :

```
var msg = {
	...
	clientId: '3E30J3S8TJXXXXXXXX',
	info: {
		content: 'Hi, long time no see',
		name: 'Mr.Trump'
	}
}
```

In the server, you need add the `Handler function` to handler the diffrent kinds info :

```
var receiveHandler = function (msg) {
    var data = {
        content: msg.info.content,
        name: msg.info.name
    }
    this.state.push(data);
    return data;
}
room.setReceiveHandler(receiveHandler);
```

Params:`msg` is just data you send to server from brower, and you need `push the data to state` so that the info can be saved for new client.In addition to, this `data` be returned will be `distribut to other clients`, so you can send data just as you need. For example, perhaps you want return `this.state` to client in a `game-app` for render the game view.

###### Other handler function

```
room.setJoinHandler(fn)  // handler when client join the room
room.setReceiveHandler(fn) // handler when server receive msg from client
```

#### Version-2.1-Todo

- [x] custom state struct
- [x] log switch
- [ ] error handler
- [ ] client check
