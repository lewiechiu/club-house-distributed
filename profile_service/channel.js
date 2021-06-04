"use strict";

const { DynamoDBClient, PutItemCommand, GetItemCommand, QueryCommand, UpdateItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb"); // CommonJS import
const client = new DynamoDBClient({ region: "us-east-2" });

/**
 * create room
 *
 * @param {Response} res The number to raise.
 * @param {string} user_name username
 * @param {string} password password
 * @param {string} url image url
 * @return {number} x raised to the n-th power.
 */


function makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}

function create_channel(res, channel_name) {
    var channel_id = makeid(16);
    var params = {
        TableName: 'channel',
        Item: {
            channel_id: { S: channel_id },
            channel_name: { S: channel_name },
            people_count: { N: "1" },

        }
    };
    // console.log(params);

    const command = new PutItemCommand(params);
    client.send(command).then(
        (data) => {
            console.log(data);
            // process data.

            res.send({
                "channel_id": channel_id,
                "channel_name": channel_name
            });
        },
        (error) => {
            console.log(error);
            // error handling.
        }
    );
}


function enter_channel(res, channel_id, uid){
    var params = {
        TableName: 'channel',
        Key: {
            "channel_id": {S: channel_id} 
        },
        UpdateExpression: "ADD people :people  SET people_count = people_count + :incr",  
        ExpressionAttributeValues: {
            ":incr": {N: "1"},
            ':people': {'SS': [uid] },
        },   
        "ReturnValues": "ALL_NEW",
    };

    var command = new UpdateItemCommand(params);
    client.send(command).then(
        (data) => {
            console.log(data);
            // process data
            var user_count = Object.values(data['Attributes']['people_count'])[0];
            var users = Object.values(data['Attributes']['people'])[0];
            
            res.send({
                "channel_id": channel_id,
                "users": users,
                "user_count": user_count,
            });
        },
        (error) => {
			console.log(error);
            res.status(500).send( {"message": error} ); 
        }
    );
}


function leave_channel(res, channel_id, uid){
    // delete the user from userset
    var params = {
        TableName: 'channel',
        Key: {
            "channel_id": {S: channel_id} 
        },
        UpdateExpression: "DELETE people :people  SET people_count = people_count - :incr",  
        ExpressionAttributeValues: {
            ":incr": {N: "1"},
            ":people": {'SS': [uid] },
        },   
        "ReturnValues": "ALL_NEW",
    };

    var command = new UpdateItemCommand(params);
    client.send(command).then(
        (data) => {
            // delete the channel if no one in it
            var user_count = Object.values(data['Attributes']['people_count'])[0];
            if (user_count === '0'){                            
                var params = {
                    TableName: 'channel',
                    Key: {"channel_id": {S: channel_id}},
                };
                
                var command = new DeleteItemCommand(params);
                client.send(command).then(
                    (data) => {},
                    (error) => {
						console.log(error);
						res.status(500).send( {"message": error} ); 
                    }
                );
            }
            res.send({"message": "Success"});
        },
        (error) => {
			console.log(error);
            res.status(500).send( {"message": error} ); 
        }
    );
}


function get_all_channels(res){
    
}

function get_all_messages(res, channel_id){

    const params = {
        FilterExpression: "channel_id = :cid",
        ExpressionAttributeValues: {
            ":cid": { S: channel_id }
        },
        TableName: "messages",
    };

    const command = new QueryCommand(params);
    client.send(command).then(
        (data) => {
            console.log(data);
            // process data.

            res.send(data);
        },
        (error) => {
            console.log(error);
            // error handling.
        }
    );

}

exports.create_channel = create_channel;
exports.enter_channel = enter_channel;
exports.leave_channel = leave_channel;
exports.get_all_channels = get_all_channels;
exports.get_all_messages = get_all_messages;
