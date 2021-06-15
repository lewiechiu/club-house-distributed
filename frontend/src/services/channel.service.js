import socket from './SocketClient';
import { useEffect, useState } from 'react';
import AuthService from './auth.service';

const useChannel = () => {
    const currentUser = AuthService.getCurrentUser();
    const [channelList, setChannelList] = useState([]);
    useEffect(() => {
        socket.on('receive_channel', (response) => {
            //TODO
        });
    });
    const getAllChannels = async (channel_id) => {
        let data = {
            username: currentUser.username,
            token: currentUser.token,
            action: 'get_all',
            channel_id: channel_id,
        };
        try {
            socket.emit('channel', data);
            let response = await new Promise((resolve) => {
                socket.on('channel_response', (response) => {
                    // console.log(response);
                    resolve(response);
                });
            });
            setChannelList([...channelList, ...response]);
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    const createChannel = async (channel_name) => {
        let data = {
            username: currentUser.username,
            token: currentUser.token,
            action: 'create',
            channel_name: channel_name,
            avatar_url: currentUser.avatar_url,
        };
        try {
            socket.emit('channel', data);
            return new Promise((resolve) => {
                socket.on('channel_response', (response) => {
                    console.log(response);
                    resolve(response);
                });
            });
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    const enterChannel = async (channel_id) => {
        let data = {
            username: currentUser.username,
            token: currentUser.token,
            action: 'enter',
            channel_id: channel_id,
            avatar_url: currentUser.avatar_url,
        };
        try {
            socket.emit('channel', data);
            return new Promise((resolve) => {
                socket.on('channel_response', (response) => {
                    console.log(response);
                    resolve(response);
                });
            });
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    const leaveChannel = async (channel_id) => {
        let data = {
            username: currentUser.username,
            token: currentUser.token,
            action: 'leave',
            channel_id: channel_id,
        };
        try {
            socket.emit('channel', data);
            return new Promise((resolve) => {
                socket.on('channel_response', (response) => {
                    console.log(response);
                    resolve(response);
                });
            });
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    const reloadChannel = async () => {
        try {
            socket.on('receive_channel', (response) => {
                console.log(response);
                return response;
            });
        } catch (err) {
            console.error(err);
            return null;
        }
    };
    return {
        channelList,
        getAllChannels,
        createChannel,
        enterChannel,
        leaveChannel,
        reloadChannel,
    };
};

export default useChannel;
