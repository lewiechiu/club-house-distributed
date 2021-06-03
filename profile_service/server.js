"use strict";

const express = require('express');

const profile = require('./profile');



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

// GET


// POST
app.post("/channel", (req, res) => {
  var action = req.body['action'];
  var channel_id = req.body['channel_id'];
  var uid = req.body['uid'];
  res.send({'action': action});
  if (action === "create"){

  }
  else if (condition === "enter"){

  }
  else if (condition === "leave"){

  }
  else if (condition === "reload"){

  }
});

app.post("/login", (req, res) => {
    var username = req.body['username'];
    var password = req.body['password'];
    // Check if username and password matches a existing user
    // if it matches
    // Look up if username exists
    profile.profile_auth(res, username, password);

});


app.get("/all_channels", (req, res) => {
  res.send();
});

app.get("/all_messages", (req, res) => {
  var channel_id = req.body['channel_id'];

  var params = {
    TableName : 'message',
    FilterExpression: "contains (Subtitle, :topic)",
    ReturnValues: 'ALL_OLD'
  };

  const command = new GetItemCommand(params);
  client.send(command).then(
    (data) => {
      console.log(data);
      // process data.
    },
    (error) => {
      console.log(error);
      // error handling.
    }
  );
  res.send(req.body);
  
  res.send();
});



app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
