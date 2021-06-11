"use strict";

const { DynamoDBClient, PutItemCommand, GetItemCommand, QueryCommand } = require("@aws-sdk/client-dynamodb"); // CommonJS import
const {makeid} = require('./utils')
const client = new DynamoDBClient({ region: "us-east-2" });

function send_message(res, message_param){

    var channel_id = message_param['channel_id'];
    var message = message_param['text'];
    var is_text = message_param['is_text'];
    var image_url = message_param['image_url'];
    var sender_id = message_param['sender_id'];
    var sender_avatar = message_param['sender_avatar'];
    var datetime = message_param['datetime'];
    var message_id = makeid(16);
    var params = {
        TableName: 'messages',
        Item: {
            message_id: { S: message_id},
            message: { S: message},
            channel_id: { S: channel_id },
            is_text: { BOOL: is_text},
            image_url: { S: image_url},
            sender_id: { S: sender_id},
            sender_avatar: { S: sender_avatar},
            datetime: { S: datetime}
        }
    };
    console.log(params)

    const command = new PutItemCommand(params);
    client.send(command).then(
        (data) => {
            console.log(data);
            // process data.

            res.send(params);
        },
        (error) => {
            console.log(error);
            // error handling.
        }
    );
}

exports.send_message = send_message;