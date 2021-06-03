"use strict";

const { DynamoDBClient, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb"); // CommonJS import
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

function enter_channel(res, channel_id){
    var params = {
        TableName: 'channel',
        Item: {
            channel_id: { S: channel_id },

        }
    };
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

function get_all_channels(res){
    
}

function get_all_messages(res, channel_id){

}

exports.create_channel = create_channel;
exports.get_all_channels = get_all_channels;
exports.get_all_messages = get_all_messages;
