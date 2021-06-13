"use strict";

const { DynamoDBClient, PutItemCommand, GetItemCommand, QueryCommand } = require("@aws-sdk/client-dynamodb"); // CommonJS import
const {makeid} = require('./utils')
const client = new DynamoDBClient({ region: "us-east-2" });


function send_message(res, message_param){

    var channel_id = message_param['channel_id'];
    var text = message_param['text'];
    var type = message_param['type'];
    var image_url = message_param['image_url'];
    var sender_id = message_param['sender_id'];
    var sender_avatar = message_param['sender_avatar'];
    var datetime = message_param['datetime'];  //new Date().toISOString(); 
    var message_id = makeid(16);
    var params = {
        TableName: 'messages',
        Item: {
            message_id: { S: message_id},
            text: { S: text},
            channel_id: { S: channel_id },
            type: { S: type},
            image_url: { S: image_url},
            sender_id: { S: sender_id},
            sender_avatar: { S: sender_avatar},
            datetime: { S: datetime}  
        }
    };

    var message_object = {
        message_id: message_id,
        username: sender_id,
        type: type,
        text: text,
        image_url: image_url,
        sender_avatar: sender_avatar,
        datetime: datetime
    };

    const command = new PutItemCommand(params);
    return client.send(command).then(
        (data) => {
            res.send({"message": "Success"});
            return message_object;
        },
        (error) => {
			res.status(500).send( {"message": error} ); 
        }
    );
}

exports.send_message = send_message;