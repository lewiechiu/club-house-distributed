import socket from './SocketClient';
import { useEffect, useState } from 'react';
import AuthService from './auth.service';
const channelListData = [
    // {
    //     channel_id: Math.random().toString(),
    //     people_count: 100,
    //     channel_name: 'Singing channel',
    //     users: [
    //         { username: 'John', avatar_url: 'logo192.png' },
    //         { username: 'Mary', avatar_url: '' },
    //         { username: 'Coco', avatar_url: 'logo192.png' },
    //         { username: 'Kan', avatar_url: '' },
    //         { username: 'Kelly', avatar_url: '' },
    //         { username: 'Kan', avatar_url: '' },
    //         { username: 'Kelly', avatar_url: '' },
    //     ],
    // },
    // {
    //     channel_id: Math.random().toString(),
    //     people_count: 50,
    //     channel_name: 'NTU channel',
    //     users: [
    //         { username: 'John', avatar_url: '' },
    //         { username: 'Mary', avatar_url: '' },
    //         { username: 'Coco', avatar_url: 'logo192.png' },
    //         { username: 'Kan', avatar_url: 'logo192.png' },
    //         { username: 'Kelly', avatar_url: '' },
    //     ],
    // },
];


const useChannel = () => {
    const [channelList, setChannelList] = useState(channelListData);
    const currentUser = AuthService.getCurrentUser();

    const reloadList = (data) => {
        let idx = channelList.findIndex(x => x.channel_id == data.channel_id);
        if (idx == -1){
            setChannelList([...channelList, data])
        }else{
            setChannelList([
                ...channelList.slice(0, idx),
                data,
                ...channelList.slice(idx+1),
            ])
        }
        //resort
        // let newList = channelList
        // let newSortList = newList.sort((a, b) => (a.people_count > b.people_count ? 1 : -1));
        // setChannelList(newSortList.slice(0, -1));
    }

    useEffect(() => {
        socket.on('receive_channel', (response) => {
            const { action, data } = response;
            switch(action) {
                case 'enter': 
                    console.log(`Sombody enter channel ${data.channel_name}.`);
                    // reloadList(data);
                    break;
                case 'leave': 
                    console.log(`Sombody leave channel ${data.channel_name}.`);
                    break;
                case 'create': 
                    console.log(`Sombody create channel ${data.channel_name}.`);
                    break;
            }
            console.log("res", response);
        });
    });

    const getAllChannels = async(channel_id) => {
        if (!socket) return("Scoket connect fail!!!");

        let data = {
            username: currentUser.username,
            token: currentUser.token,
            action: 'get_all',
            channel_id: channel_id,
        };
    
        try {
            socket.emit('channel', data);
            socket.on('channel_response', (response) => {
                if (Array.isArray(response)){ //should be "action" === "get_all"
                    setChannelList(response)
                    // console.log(channelList);
                }
            });
        } catch (err) {
            console.error(err);
        }
    }

    const createChannel = async(channel_name, cb) => {
        let data = {
            username: currentUser.username,
            token: currentUser.token,
            action: 'create',
            channel_name: channel_name,
            avatar_url: currentUser.avatar_url,
        };

        try {
            socket.emit('channel', data);
            // console.log(`[Create_send]User ${currentUser.username} create channel channel_name(${channel_id})!`)
            socket.on('channel_response', (response) => {
                if(response.constructor === Object && "channel_id" in response){ //should be "action" === "create"
                    const {message, channel_id} = response;
                    // console.log(`[Create_res]User ${currentUser.username} create channel channel_name(${channel_id})!`)
                    const newChannelData = {
                        channel_id: channel_id,
                        channel_name: channel_name,
                        people_count: 1,
                        users: [{username: currentUser.username, avatar_url: ""}]
                    }
                    setChannelList([...channelList, newChannelData]);
                    return cb(null, channel_id);
                }
            });
        } catch (err) {
            console.error(err);
            return cb(err, null);
        }
        
    }

    const leaveChannel = async(channel_id) => {
        let data = {
            username: currentUser.username,
            token: currentUser.token,
            action: 'leave',
            channel_id: channel_id
        };

        try {
            socket.emit('channel', data);
            // console.log(`[Leave_send]User ${currentUser.username} leave channel ${channel_id}!`)
            socket.on('channel_response', (response) => {
                if(response.constructor === Object && Object.keys(response).length===1){ //should be "action" === "leave"
                    const {message} = response;
                    // if (message === "Success"){
                        // console.log(`[Leave_res]User ${currentUser.username} leave channel ${channel_id}!`)
                        //// update channelList state(user_cnt-1)
                        // let idx = channelList.findIndex(x => x.channel_id == channel_id);
                        // if(idx !== -1){
                        //     let updateChannelData = channelList[idx];
                        //     updateChannelData.people_count = parseInt(updateChannelData.people_count) - 1;
                        //     if(updateChannelData.people_count == 0){
                        //         setChannelList([
                        //             ...channelList.slice(0, idx),
                        //             ...channelList.slice(idx+1),
                        //         ])
                        //     }else{
                        //         setChannelList([
                        //             ...channelList.slice(0, idx),
                        //             updateChannelData,
                        //             ...channelList.slice(idx+1),
                        //         ])
                        //     }
                        // } 
                    // }
                }
            });
        } catch (err) {
            console.error(err);
        }
    }

    const enterChannel = (channel_id) => {
        let data = {
            username: currentUser.username,
            token: currentUser.token,
            channel_id: channel_id,
            action: 'enter',
            avatar_url: ""
        };

        try {
            socket.emit('channel', data);
            // console.log(`[Enter_send]User ${currentUser.username} enter channel ${channel_id}!`)
            socket.on('channel_response', (response) => {
                if(response.constructor === Object && "user_count" in response){ //should be "action" === "enter"
                    const {people_count, message} = response;
                    // if (message === "Success"){
                        // console.log(`[Enter_res]User ${currentUser.username} enter channel ${channel_id}!`)
                        // // update channelList state(user_cnt+1)
                        // let idx = channelList.findIndex(x => x.channel_id == channel_id);
                        // let updateChannelData = channelList[idx];
                        // updateChannelData.people_count = parseInt(updateChannelData.people_count) + 1;
                        // setChannelList([
                        //     ...channelList.slice(0, idx),
                        //     updateChannelData,
                        //     ...channelList.slice(idx+1),
                        // ])
                    // }
                }
            });
        } catch (err) {
            console.error(err);
        }
    }

    return {
        channelList,
        getAllChannels,
        createChannel,
        enterChannel,
        leaveChannel,
    };
}

export default useChannel;
