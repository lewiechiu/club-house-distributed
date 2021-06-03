"use strict";

const express = require('express');

const profile = require('./profile');
const channel = require('./channel');



// Constants
const PORT = 8080;
const HOST = "0.0.0.0";

// App
const app = express();

// Use json body
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello!!! World");
});

// POST
app.post("/channel", (req, res) => {
  var action = req.body['action'];
  var channel_name = req.body['channel_name'];
  var uid = req.body['uid'];
  if (action === "create"){
    channel.create_channel(res, channel_name);
  }
  else if (condition === "enter"){
    // channel.enter_room(res, channel_name, uid);

  }
  else if (condition === "leave"){
    // channel.leave_room(res, channel_name, uid);
  }
  else if (condition === "reload"){

  }
});

app.post("/login", (req, res) => {
    var username = req.body['username'];
    var password = req.body['password'];

    profile.profile_auth(res, username, password);

});


app.get("/all_channels", (req, res) => {
    channel.get_all_channels(res);
});

app.get("/all_messages", (req, res) => {
  var channel_id = req.body['channel_id'];

  
  res.send();
});



app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
