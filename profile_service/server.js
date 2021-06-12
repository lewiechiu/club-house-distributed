"use strict";

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const redisAdapter = require('socket.io-redis');

const profile = require('./profile');
const channel = require('./channel');
const message = require('./message');


// Constants
const PORT = 8080;
const HOST = "0.0.0.0";

// App
const app = express();
app.use(compression());
const http = require('http').createServer(app);
const io = require("socket.io")(http);
io.adapter(redisAdapter({host: 'localhost', port: 6379}));


io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('POST channel',(params) => {
    console.log(params);
  });

  socket.on('login',(params) => {
    
    var username = params['username'];
    var password = params['password'];
    socket.emit('login response', params);
    profile.profile_auth(socket, username, password);
  });

  socket.on('channel', (params) => {
    var action = params['action'];
    var uid = params['uid'];
    if (action === "create") {
      var channel_name = params['channel_name'];
      channel.create_channel(socket, channel_name, uid);
    }
    else if (action === "enter") {
      var channel_id = params['channel_id'];
      channel.enter_channel(socket, channel_id, uid);
    }
    else if (action === "leave") {
      var channel_id = params['channel_id'];
      channel.leave_channel(socket, channel_id, uid);
    }
    else if (action === "get_all"){
      
    }
  });

  socket.on('message', (params) => {
    var action = params['action'];
    var uid = params['uid'];
    var channel_id = params['channel_id'];
    if (action === 'send'){
      message.send_message()
    }
    else if (action === 'get_all'){

    }

  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

});

app.get("/", (req, res) => {
  res.sendFile('/home/louiechiu/club-house-distributed/profile_service/index.html');
});


http.listen(PORT, () => {
  console.log('listening on' + PORT);
});
// app.listen(PORT, HOST);
