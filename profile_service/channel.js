"use strict";

const { DynamoDBClient, PutItemCommand, GetItemCommand, QueryCommand, UpdateItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb"); // CommonJS import
const client = new DynamoDBClient({ region: "us-east-2" });
const { makeid } = require('./utils');
/**
 * create room
 *
 * @param {Response} res The number to raise.
 * @param {string} user_name username
 * @param {string} password password
 * @param {string} url image url
 * @return {number} x raised to the n-th power.
 */

function create_channel(socket, channel_name, uid) {
    var channel_id = makeid(16);
    var params = {
        TableName: 'channel',
        Item: {
            channel_id: { S: channel_id },
            channel_name: { S: channel_name },
            people_count: { N: "1" },
            people: { SS: [uid] },
        }
    };
    // console.log(params);

    const command = new PutItemCommand(params);
    client.send(command).then(
        (data) => {
            // process data.
            var response_map = {
                "channel_id": channel_id,
                "channel_name": channel_name
            };
            socket.emit('channel_response', response_map);
        },
        (error) => {
            socket.emit('channel_response', { "message": error })
        }
    );
}


function enter_channel(socket, channel_id, uid) {
    var params = {
        TableName: 'channel',
        Key: {
            "channel_id": { S: channel_id }
        },
        UpdateExpression: "ADD people :people  SET people_count = people_count + :incr",
        ExpressionAttributeValues: {
            ":incr": { N: "1" },
            ':people': { SS: [uid] },
        },
        "ReturnValues": "ALL_NEW",
    };

    var command = new UpdateItemCommand(params);
    client.send(command).then(
        (data) => {
            // process data
            var user_count = parseInt(data.Attributes.people_count.S);
            var users = data.Attributes.people.SS;
            var response_map = {
                "channel_id": channel_id,
                // TODO 
                // fix the users
                // It should be list of objects.
                "users": users,
                "user_count": user_count,
            };
            socket.emit('channel_response', response_map);
        },
        (error) => {
            socket.emit('channel_response', { "message": error });
        }
    );
}

function delete_channel(channel_id) {
    var params = {
        TableName: 'channel',
        Key: { "channel_id": { S: channel_id } },
    };
    var command = new DeleteItemCommand(params);
    client.send(command).then(
        (data) => { }, (error) => { }
    );
}

function leave_channel(socket, channel_id, uid) {
    // delete the user from userset
    var params = {
        TableName: 'channel',
        Key: {
            "channel_id": { S: channel_id }
        },
        UpdateExpression: "DELETE people :people  SET people_count = people_count - :incr",
        ExpressionAttributeValues: {
            ":incr": { N: "1" },
            ":people": { 'SS': [uid] },
        },
        "ReturnValues": "ALL_NEW",
    };

    var command = new UpdateItemCommand(params);
    client.send(command).then(
        (data) => {
            // delete the channel if no one in it
            var user_count = parseInt(data.Attributes.people_count.N);
            if (user_count === 0) delete_channel(channel_id);

            socket.emit('channel_response', { "message": "Success" });
        },
        (error) => {
            socket.emit('channel_response', { "message": error });
        }
    );
}


function get_all_channels(res) {

}

function get_all_messages(res, channel_id) {

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
