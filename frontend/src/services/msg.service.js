import socket from './SocketClient';
import { useEffect, useState } from 'react';
import AuthService from './auth.service';
const currentUser = AuthService.getCurrentUser();

const useChat = () => {
    const [messageList, setMessageList] = useState([]);
    useEffect(() => {
        console.log('trigger useEffect in middleware');
        socket.on('receive_message', (response) => {
            console.log(response);
            return response;
        });
        // setMessageList([...messageList, response]);
        console.log(messageList);
    }, [messageList]);

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
            socket.emit('message', data);
            let response = await new Promise((resolve) => {
                socket.on('message_response', (response) => {
                    resolve(response.data);
                });
            });
            //TODO: reverse response
            setMessageList([...response, ...messageList]);
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    // useEffect(() => {
    //     socket.on('receive_message', (response) => {
    //         setMessageList((messageList) => [...messageList, response]);
    //     });
    // });
    return {
        messageList,
        sendMsg,
        getAllMsgs,
        // subscribeMsg,
    };
};

//TODO: on receive_message

export default useChat;
