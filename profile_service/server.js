"use strict";

const express = require('express');
const cors = require('cors');  
const compression = require('compression'); 
const redisAdapter = require('socket.io-redis');  

const profile = require('./profile');
const channel = require('./channel');
const message = require('./message');
const { error } = require('console');  


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
    var token = params['token'];
    var username = params['username'];
    
    profile.token_auth(username, token)
      .then(() => {
        
        if (action === "create") {
          var avatar_url = params['avatar_url'];
          var channel_name = params['channel_name'];
          channel.create_channel(socket, channel_name, username, avatar_url);
        }
        else if (action === "enter") {
          var avatar_url = params['avatar_url'];
          var channel_id = params['channel_id'];
          channel.enter_channel(socket, channel_id, username, avatar_url);
        }
        else if (action === "leave") {
          var channel_id = params['channel_id'];
          channel.leave_channel(socket, channel_id, username);
        }
        else if (action === "get_all") {
          var channel_id = params['channel_id'];
          channel.get_all_channels(socket, channel_id);
        }
        //else if (action === "get_all_message") {
        //  channel.get_all_messages(res, req.body);
        //}
      })
      .catch((error) => {
        socket.emit('channel_response', { 'message': 'token invalid' });
      });
    
  });

  socket.on('message', (params) => {
    var action = params['action'];
    var token = params['token'];
    var username = params['username'];
    //var channel_id = params['channel_id'];
    profile.token_auth(username, token)
      .then((data) => {
        if (action === 'send'){
          message.send_message(socket, params);
        }
        else if (action === 'get_all'){
          channel.get_all_messages(socket, params);
        }
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
  res.sendFile('/home/louiechiu/club-house-distributed/profile_service/index.html');
});


http.listen(PORT, () => {
  console.log('listening on ' + PORT);
});
// app.listen(PORT, HOST);
// messages

