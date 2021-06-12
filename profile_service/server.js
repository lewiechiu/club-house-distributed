"use strict";

const express = require('express');
const cors = require('cors');

const profile = require('./profile');
const channel = require('./channel');
const message = require('./message');



// Constants
const PORT = 8080;
const HOST = "0.0.0.0";

// App
const app = express();

// Use json body
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello!!! World");
});

// POST
app.post("/channel", (req, res) => {
  var action = req.body['action'];
  var uid = req.body['uid'];
  if (action === "create"){
	var channel_name = req.body['channel_name'];
    channel.create_channel(res, channel_name, uid);
  }
  else if (action === "enter"){
	var channel_id = req.body['channel_id'];
    channel.enter_channel(res, channel_id, uid);
  }
  else if (action === "leave"){
	var channel_id = req.body['channel_id'];
    channel.leave_channel(res, channel_id, uid);
  }
  else if (action === "reload"){

  }
});

app.post("/login", (req, res) => {
    var username = req.body['username'];
    var password = req.body['password'];

    profile.profile_auth(res, username, password);

});

app.get("/all_channels", (req, res) => {
  var limit = req.body['limit'];
  channel.get_all_channels(res, limit);
});

// messages
app.post("/message", (req, res) => {
  message.send_message(res, req.body);
});

app.get("/all_messages", (req, res) => {
  channel.get_all_messages(res, req.body);
});


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
