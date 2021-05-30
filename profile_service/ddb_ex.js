// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({ region: 'us-east-2' });

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB().DocumentClient();

var params = {
    TableName: 'profile',
    Item: {
        'username': { S: '123' },
        'CUSTOMER_NAME': { S: 'Richard Roe' }
    }
};

// Call DynamoDB to add the item to the table
ddb.putItem(params, function (err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data);
    }
});