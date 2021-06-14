import socket from './SocketClient';
import { useEffect, useState } from 'react';
import AuthService from './auth.service';
const currentUser = AuthService.getCurrentUser();

const useChat = () => {
    const [messageList, setMessageList] = useState([]);
    const [prevChannelId, setPrevChannelId] = useState('');
    useEffect(() => {
        socket.on('receive_message', (response) => {
            const { data } = response;
            setMessageList([...messageList, data]);
        });
    });
    const sendMsg = async (
        channel_id,
        type,
        text,
        image_url,
        sender_avatar,
        datetime
    ) => {
        let data = {
            username: currentUser.username,
            token: currentUser.token,
            action: 'send',
            channel_id: channel_id,
            type: type,
            text: text,
            image_url: image_url,
            sender_avatar: sender_avatar,
            datetime: datetime,
        };
        try {
            socket.emit('message', data);
            let response = await new Promise((resolve) => {
                socket.on('message_response', (response) => {
                    resolve(response);
                });
            });
            setMessageList([...messageList, data]);
            return response;
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    const getAllMsgs = async (channel_id, message_id) => {
        let data = {
            username: currentUser.username,
            token: currentUser.token,
            action: 'get_all',
            channel_id: channel_id,
            message_id: message_id,
        };
        try {
            let local_msgList = messageList;
            if (prevChannelId !== channel_id) {
                setMessageList([]);
                local_msgList = [];
            }
            socket.emit('message', data);
            let response = await new Promise((resolve) => {
                socket.on('message_response', (response) => {
                    resolve(response.data);
                });
            });
            setPrevChannelId(channel_id);
            setMessageList([...response.reverse(), ...local_msgList]);
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    return {
        messageList,
        sendMsg,
        getAllMsgs,
    };
};

export default useChat;
