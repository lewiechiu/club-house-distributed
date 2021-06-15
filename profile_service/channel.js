"use strict";

const { DynamoDBClient, PutItemCommand, GetItemCommand, QueryCommand, UpdateItemCommand, DeleteItemCommand, ScanCommand, BatchGetItemCommand } = require("@aws-sdk/client-dynamodb"); // CommonJS import
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

function _unpack_people_map(people){
    var result = []
    for (const k in people) {
        result.push({username: k, avatar_url: people[k].M.avatar_url.S});
    }
    return result;
}


function create_channel(socket, channel_name, username, avatar_url) {
    var channel_id = makeid(16);
    var people_obj = {};
    // TODO fix the auto add user once create
    people_obj[username] = {
        M: {
            "avatar_url": {
                "S": avatar_url
            },
            "username": {
                "S": username
            }
        }
    };
    var params = {
        TableName: 'channel',
        Item: {
            channel_id: { S: channel_id },
            channel_name: { S: channel_name },
            people_count: { N: "1" },
            people: {
                M: people_obj
            },
        }
    };
    
    const command = new PutItemCommand(params);
    return client.send(command).then(
        (data) => {
            // process data.
            var response_map = {
                "action" : "create",
                "message": "Success",
                "channel_id": channel_id,
            };
            var created_channel = {
                "channel_id": channel_id,
                "channel_name": channel_name,
                "user_count": 1,
                "users": [{ "username": username, "avatar_url": avatar_url }]
            };
            socket.emit('channel_response', response_map);
            return created_channel;
        },
        (error) => {
            console.log(error);
            socket.emit('channel_response', { 
                "action" : "create",
                "message": error 
            })
        }
    );
}


function enter_channel(socket, channel_id, username, avatar_url) {
    var params = {
        TableName: 'channel',
        Key: {
            "channel_id": { S: channel_id }
        },
        UpdateExpression: "SET people.#user_name = :people, people_count = people_count + :incr",
        ExpressionAttributeValues: {
            ":incr": { N: "1" },
            ':people': {
                M: {
                    username: { S: username },
                    avatar_url: { S: avatar_url }
                }
            },
        },
        ExpressionAttributeNames: {
            "#user_name": username
        },
        "ReturnValues": "ALL_NEW",
    };

    var command = new UpdateItemCommand(params);
    return client.send(command).then(
        (data) => {
            
            var user_count = parseInt(data.Attributes.people_count.N);
            
            var response_map = {
                "action": "enter",
                "user_count": user_count,
                "message": "Success"
            }
			var people = _unpack_people_map(data.Attributes.people.M);
            var entered_channel = {
                'channel_id': data.Attributes.channel_id.S,
                'channel_name': data.Attributes.channel_name.S,
                'users': people,
                'user_count': parseInt(data.Attributes.people_count.N)
            };
            socket.emit('channel_response', response_map);
			return entered_channel;
        },
        (error) => {
            socket.emit('channel_response', { 
                "action": "enter", 
                "message": error
            });
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

function leave_channel(socket, channel_id, username) {
    // delete the user from userset
    var params = {
        TableName: 'channel',
        Key: {
            "channel_id": { S: channel_id }
        },
        UpdateExpression: "REMOVE people.#user_name  SET people_count = people_count - :incr",
        ExpressionAttributeValues: {
            ":incr": { N: "1" }
        },
        ExpressionAttributeNames: {
            "#user_name": username
        },
        "ReturnValues": "ALL_NEW",
    };

    var command = new UpdateItemCommand(params);
    return client.send(command).then(
        (data) => {
            // delete the channel if no one in it
            var user_count = parseInt(data.Attributes.people_count.N);
            if (user_count === 0) delete_channel(channel_id);

            socket.emit('channel_response', { "action": "leave", "message": "Success" });
			
			var people = _unpack_people_map(data.Attributes.people.M);
            var left_channel = {
                'channel_id': data.Attributes.channel_id.S,
                'channel_name': data.Attributes.channel_name.S,
                'users': people,
                'user_count': parseInt(data.Attributes.people_count.N)
            };
            return left_channel;
        },
        (error) => {
            console.log(error);
            socket.emit('channel_response', { "action": "leave","message": error });
        }
    );
}


function get_all_channels(socket, channel_id){
    const limit = 20;
    var params = {
        TableName: 'channel'
        // TODO
        // Add a limit
    }
    var command = new ScanCommand(params);
    client.send(command).then(
        (data) => {
            // sorted by people_count
            var sorted_channels =  data['Items'].sort((a, b) => Object.values(b['people_count'])[0] - Object.values(a['people_count']));
            var res_channels;

            if (channel_id === ""){
                // send top 20 channels
                res_channels = sorted_channels.slice(0, limit);
            }
            else if (channel_id !== ""){
                // find the index of the channel_id
                var channel_indx = sorted_channels.findIndex(function(item, i){
                    return item.channel_id.S === channel_id;
                });
                res_channels = sorted_channels.slice((channel_indx+1), (channel_indx+1+limit));
            }
            var res_data = [];
            console.log(res_channels);
            res_channels.forEach(function(x) {
                    res_data.push({
                        "users": _unpack_people_map(x.people.M),
                        "channel_name": x.channel_name.S,
                        "channel_id": x.channel_id.S, 
                        "user_count": x.people_count.N,
                    });
            });
            socket.emit('channel_response', {"action": "get_all", "data":res_data}); 
        },
        (error) => {
            console.log(error);
            socket.emit('channel_response', {"action": "get_all", "data": []} ); 
        }
    );   
}

function get_all_messages(socket, msg_params){

    var channel_id = msg_params['channel_id'];
    var message_id = msg_params['message_id'] || '';
    const message_count = 50;    //Number(msg_params['count']);

    if (message_id === ""){
        //最新的count筆messages
        var params = {
            KeyConditionExpression: "channel_id = :cid",
            ExpressionAttributeValues: {
                ":cid": { S: channel_id },
            },
            TableName: "messages",  
            Limit: message_count,
            ScanIndexForward: false,  
        };

        var command = new QueryCommand(params);
        client.send(command).then(
            (data) => {
                var res_data = [];
                data["Items"].forEach(function(x) {
                    res_data.push({
                        "message_id": x.message_id.S, 
                        "type": x.type.S, 
                        "text": x.text.S,  
                        "image_url": x.image_url.S,
                        "username": x.username.S,  
                        "sender_avatar": x.sender_avatar.S, 
                        "datetime": x.datetime.S,
                    });
                });
                socket.emit('message_response', {
                    "action": "get_all",
                    "data": res_data,
                });
            },
            (error) => {
                socket.emit('message_response', {
                    "action": "get_all",
                    "data": [],
                });
            }
        );      
    } 
    else if (message_id !== ""){
        //get the datetime of the message (msg_id)
        var params = {
            KeyConditionExpression: "channel_id = :cid",
            FilterExpression: "#message_id = :message_id", 
            ExpressionAttributeNames: { "#message_id" : "message_id" },
            ExpressionAttributeValues: {
                ":cid": { S: channel_id },
                ":message_id": { S: message_id },
            },
            TableName: "messages", 
        };

        var command = new QueryCommand(params);
        client.send(command).then(
            (data) => {

                //前count筆messages
                var msg_datetime = Object.values(data['Items'][0]['datetime'])[0];  
                var params = {
                    KeyConditionExpression: "channel_id = :cid AND #datetime < :datetime",
                    ExpressionAttributeNames: { "#datetime": "datetime" },
                    ExpressionAttributeValues: {
                        ":cid": { S: channel_id },
                        ":datetime": { S: msg_datetime },
                    },
                    TableName: "messages",  
                    Limit: message_count,
                    ScanIndexForward: false,  //descending
                };

                var command = new QueryCommand(params);
                client.send(command).then(
                    (data) => {
                        var res_data = [];
                        data["Items"].forEach(function(x) {
                            res_data.push({
                                "message_id": x.message_id.S, 
                                "type": x.type.S, 
                                "text": x.text.S,  
                                "image_url": x.image_url.S,
                                "username": x.username.S,  
                                "sender_avatar": x.sender_avatar.S, 
                                "datetime": x.datetime.S,
                            });
                        });
                        socket.emit('message_response', {
                            "action": "get_all",
                            "data": res_data,
                        });
                    },
                    (error) => {
                        console.log(error);
                        socket.emit('message_response', {
                            "action": "get_all",
                            "data": [],
                        });
                    }
                );  
            },
            (error) => {
                console.log(error);
                socket.emit('message_response', {
                    "action": "get_all",
                    "data": [],
                });
            }
        );
    }
}

exports.create_channel = create_channel;
exports.enter_channel = enter_channel;
exports.leave_channel = leave_channel;
exports.get_all_channels = get_all_channels;
exports.get_all_messages = get_all_messages;
