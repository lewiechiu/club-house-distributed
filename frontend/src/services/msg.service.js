import httpClient from './httpClient';

const END_POINT = '/message';

const sendMsg = async (channel_id, type, text, image_url, sender_id, sender_avatar) => {
    const data = {
        channel_id: channel_id,
        type: type,
        text: text,
        image_url: image_url,
        sender_id: sender_id,
        sender_avatar: sender_avatar,
        datetime: new Date()
    };
    try {
        const response = await httpClient.post(
            END_POINT,
            data,
            { headers: { 'Content-Type': 'application/json' } },
        );
        return response.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const getAllMsgs = async (channel_id) => {
    const data = {
        channel_id: channel_id,
    }
    try {
        const response = await httpClient.post(
            '/all_messages',
            data,
            { headers: { 'Content-Type': 'application/json' } },
        );
        return response.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};


export default {
    sendMsg,
    getAllMsgs,
};