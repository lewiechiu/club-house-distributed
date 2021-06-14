import React, { useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import 'react-chat-elements/dist/main.css';
import '../styles/channel.css';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import indigo from '@material-ui/core/colors/indigo';

import { Button, MessageList, Input } from 'react-chat-elements';

import useChat from '../services/msg.service';
import AuthService from '../services/auth.service';

const useStyles = makeStyles((theme) => ({
    bgGrey: {
        backgroundColor: indigo[600],
    },
    purple: {
        backgroundColor: indigo[600],
        color: '#fff',
    },
}));

function Channel(props) {
    const classes = useStyles();
    var { channelId, channelName, channelCnt } = props;
    var [inputRef, setInputRef] = useState(React.createRef());
    const { messageList, sendMsg, getAllMsgs } = useChat();
    const currentUser = AuthService.getCurrentUser();

    const addMessage = async () => {
        await sendMsg(
            channelId,
            'text',
            inputRef.input.value,
            '',
            currentUser.avatar_url,
            new Date().toISOString()
        ).then(
            (res) => {
                console.log(res);
                if (res?.message === 'success') {
                    console.log('Log in success.');
                } else {
                    const errorMsg = res?.errorMsg;
                    console.log(errorMsg);
                }
            },
            (error) => {
                console.log('Unexpected Error', error);
            }
        );

        inputRef.clear();
        setInputRef(inputRef);
    };

    const preprocess = (msgs) => {
        return msgs.map((msg) => {
            return {
                title:
                    msg.username === currentUser.username
                        ? currentUser.username
                        : 'Others',
                position:
                    msg.username === currentUser.username ? 'right' : 'left',
                type: msg.type,
                text: msg.text,
                data: { uri: msg.data },
                date: new Date(msg.datetime),
                avatar: msg.sender_avatar,
                dateString: new Date(msg.datetime)
                    .toLocaleString()
                    .split(',')[1],
            };
        });
    };

    const getMessageList = async () => {
        // let data = await MsgService.getAllMsgs(channelId);
        let get_data = [
            {
                message_id: '',
                type: 'text',
                text: 'lalallalala',
                image_url: '',
                sender_id: 'b05303124',
                sender_avatar: 'https://randomuser.me/api/portraits/men/50.jpg',
                datetime: new Date(),
            },
            {
                message_id: '',
                type: 'text',
                text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
                image_url: '',
                sender_id: 'b05502058',
                sender_avatar: 'https://randomuser.me/api/portraits/men/60.jpg',
                datetime: new Date(),
            },
            {
                message_id: '',
                type: 'photo',
                text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
                image_url: '',
                sender_id: 'b05502058',
                sender_avatar: 'https://randomuser.me/api/portraits/men/60.jpg',
                data: 'https://randomuser.me/api/portraits/men/60.jpg',
                datetime: new Date(),
            },
        ];
        const data = preprocess(get_data);
    };

    const onChange = async (e) => {
        if (!e.shiftKey && e.charCode === 13 && e.target.value !== '') {
            addMessage();
            e.preventDefault();
        }
    };

    useEffect(() => {
        getAllMsgs(channelId, '');
        // subscribeMsg();
    }, [channelId]);

    return (
        <Box height="95vh" display="flex" flexDirection="column">
            <Box className={classes.purple}>
                <Typography variant="h5" align="left">
                    {channelName}(Online: {channelCnt})
                </Typography>
            </Box>
            <Box flex={1} overflow="auto">
                <MessageList
                    lockable={true}
                    toBottomHeight={'100%'}
                    dataSource={preprocess(messageList)}
                />
            </Box>
            <Box>
                <Input
                    className={classes.purple}
                    ref={(el) => setInputRef(el)}
                    placeholder="Type here..."
                    multiline={true}
                    autofocus={true}
                    onKeyPress={onChange}
                    rightButtons={
                        <Button
                            color="white"
                            backgroundColor="black"
                            text="Send"
                            onClick={addMessage}
                        />
                    }
                />
            </Box>
        </Box>
    );
}
export default Channel;
