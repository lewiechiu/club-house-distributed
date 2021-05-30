"use strict";

const { DynamoDBClient, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb"); // CommonJS import
const express = require('express');
const client = new DynamoDBClient({ region: "us-east-2" });


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

app.get("/profile/:user_id", (req, res) => {
  /**
   * get user profile by user_id
   * user_id is a auto generated random string
   */

  
});

// POST
app.post("/profile/", (req, res) => {
  // input type and format
  // https://stackoverflow.com/questions/66591418/aws-nodejs-sdk-v3-dynamodb-updateitem-typeerror-cannot-read-property-0-of-u
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/index.html
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#putItem-property
  // Specifies how to formulate the params object

  var user_info = req.body;
  var params = {
    TableName : 'profile',
    Item: {
       username: {S: user_info['uuid']},
       name: {S: user_info['name']},
       birthday: {S: user_info['birthday']},
       description: {S: 'blah blah blah'},
       image: {S: ""}
    },
    ReturnValues: 'ALL_OLD'
  };

  const command = new PutItemCommand(params);
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
  
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
