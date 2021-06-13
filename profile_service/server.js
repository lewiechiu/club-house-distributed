"use strict";

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const redisAdapter = require('socket.io-redis');

const profile = require('./profile');
const channel = require('./channel');
const message = require('./message');
const config = require('./config');
const { error } = require('console');
const path = require('path');

// Constants
const HOST = "0.0.0.0";

// App
const app = express();
app.use(compression());
const http = require('http').createServer(app);
const io = require("socket.io")(http);
io.adapter(redisAdapter({host: config.REDIS_ENDPOINT, port: 6379}));


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
    var token = params['token'];
    var username = params['username'];
    var avatar_url = params['avatar_url']
    var channel_id = params['channel_id'];
    var channel_name = params['channel_name'];

    profile.token_auth(username, token)
      .then(() => {
        
        if (action === "create") {
          return channel.create_channel(socket, channel_name, username, avatar_url);
        }
        else if (action === "enter") {
          return channel.enter_channel(socket, channel_id, username, avatar_url);
        }
        else if (action === "leave") {
          return channel.leave_channel(socket, channel_id, username);
        }
        else if (action === "get_all") {
          var limit = params['limit'];
          channel.get_all_channels(socket, limit);
        }
        else if (action === "get_all_message") {
          channel.get_all_messages(res, req.body);
        }
      })
      .then((data) => {
        console.log(data);
        var response_map = {
          action: action,
          data: data
        };
        socket.broadcast.emit('receive_channel', response_map)
      })
      .catch((error) => {
        console.log(error);
        socket.emit('channel_response', { 'message': 'token invalid' });
      });
    
  });

  socket.on('message', (params) => {
    var action = params['action'];
    var token = params['token'];
    var username = params['username'];
    var channel_id = params['channel_id'];
    profile.token_auth(username, token)
      .then((data) => {
        if (action === 'send'){
          return message.send_message();
        }
        else if (action === 'get_all'){
          return message.get_all_message();
        }
      })
      .then((message) => {
        var response_map = {
          action: action,
          data: message
        };
        socket.broadcast.emit('receive_message', response_map)
      })
      .catch((error) => {
        socket.emit('message_response', {'message': 'token invalid'})
      });



  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
  
});


http.listen(config.PORT, () => {
  console.log('listening on ' + config.PORT);
});
// app.listen(PORT, HOST);
// messages

