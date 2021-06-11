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
async function get_random_image() {
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
        return image_url;
    })

    req.end();



}


/**
 * create profile
 *
 * @param {Response} res The number to raise.
 * @param {string} user_name username
 * @param {string} password password
 * @param {string} url image url
 * @return {number} x raised to the n-th power.
 */
function create_profile(sock, user_name, password, url) {
    var params = {
        TableName: 'profile',
        Item: {
            username: { S: user_name },
            password: { S: password},
            avatar_url: { S: url}
        }
    };

    const command = new PutItemCommand(params);
    client.send(command).then(
        (data) => {
            var response_map = {
                "username": user_name,
                "uid": makeid(16)
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
function profile_auth(sock, user_name, password) {

    var params = {
        TableName: 'profile',
        Key: {
            username: { S: user_name },
        }
    };

    const command = new GetItemCommand(params);
    client.send(command).then(
        (data) => {
            if ( typeof data.Item !== 'undefined' && data.Item.password.S === password) {
                // user logins successfully
                var response_map = {
                    "message": "success",
                };
                sock.emit('login_response', response_map);
            }
            else if (typeof data.Item !== 'undefined' && Object.keys(data.Item).length !== 0) {
                var response_map = {
                    "message": "password incorrect",
                };
                sock.emit('login_response', response_map);
            }
            else {
                // create the username and password
                // TODO fetch the image url
                // url = await get_random_image();
                var url = "https://images.unsplash.com/photo-1622036408974-2f323d15edb1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixlib=rb-1.2.1&q=80&w=300";
                create_profile(sock, user_name, password, url);
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


exports.profile_auth = profile_auth;
