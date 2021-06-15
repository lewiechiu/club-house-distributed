"use strict";

const { DynamoDBClient, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb"); // CommonJS import
const { makeid } = require("./utils");
const crypto = require('crypto');
const client = new DynamoDBClient({ region: "us-east-2" });

/**
 * Get a random image from unsplash
 *
 * @return {string} an url
 */
async function get_random_image(avatar_url) {
    const https = require('https');
    const options = {
        hostname: 'source.unsplash.com',
        port: 443,
        path: '/random/300x300',
        method: 'GET'
    };

    const req = https.request(options, res => {
        var image_url = res.headers.location;
        console.log(image_url);
        avatar_url = image_url;
    })

    req.end();



}


/**
 * create profile
 *
 * @param {Response} res The number to raise.
 * @param {string} username username
 * @param {string} password password
 * @param {string} url image url
 * @return {number} x raised to the n-th power.
 */
function create_profile(sock, username, password, url, token) {
    var params = {
        TableName: 'profile',
        Item: {
            username: { S: username },
            password: { S: password},
            avatar_url: { S: url},
            token: {S: token}
        }
    };

    const command = new PutItemCommand(params);
    client.send(command).then(
        (data) => {
            var response_map = {
                "message": "success",
                "username": username,
                "token": token
            };
            sock.emit('login_response', response_map);
        },
        (error) => {
            console.log(error);
            // error handling.
        }
    );
}

/**
 *  get profile by username, and check if password matches
 *
 * @param {number} x The number to raise.
 * @param {number} n The power, must be a natural number.
 * @return {number} x raised to the n-th power.
 */
async function profile_auth(sock, username, password) {

    var params = {
        TableName: 'profile',
        Key: {
            username: { S: username },
        }
    };

    const command = new GetItemCommand(params);
    client.send(command).then(
        (data) => {
            if ( typeof data.Item !== 'undefined' && data.Item.password.S === password) {
                // user logins successfully
                var response_map = {
                    "message": "success",
                    "token": data.Item.token.S
                };
                sock.emit('login_response', response_map);
            }
            else if (typeof data.Item !== 'undefined' && Object.keys(data.Item).length !== 0) {
                var response_map = {
                    "message": "password incorrect"
                };
                sock.emit('login_response', response_map);
            }
            else {
                // create the username and password
                // TODO fetch the image url
                // var avatar_url = "";
                // await get_random_image(avatar_url);
                var url = "https://images.unsplash.com/photo-1622036408974-2f323d15edb1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixlib=rb-1.2.1&q=80&w=300";
                var token = makeid(16);
                create_profile(sock, username, password, url, token);
            }
        },
        (error) => {
            console.log(error);
            var response_map = {
                "message": error,
            };
            sock.emit('login_response', response_map);
            // error handling.
        }
    );

}

function token_auth(username, token){
    var params = {
        TableName: 'profile',
        Key: {
            username: { S: username },
        }
    };

    const command = new GetItemCommand(params);
    return client.send(command)
    .then((data) => {
        if (data.Item.token.S !== token) throw new Error('token invalid');
    });

}

exports.profile_auth = profile_auth;
exports.token_auth = token_auth;
