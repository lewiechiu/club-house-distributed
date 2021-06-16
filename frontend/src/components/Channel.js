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
                if (res?.message === 'Success') {
                    // console.log('Log in success.');
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

    const timeFormatter = (datetime) => {
        let datestr = datetime.toLocaleString();
        let time =
            datestr.split(',')[0].slice(0, -5) +
            ' ' +
            datestr.split(',')[1].slice(0, -6) +
            ' ' +
            datestr.split(',')[1].slice(-2);
        return time;
    };

    const preprocess = (msgs) => {
        return msgs.map((msg) => {
            return {
                title: msg.username,
                position:
                    msg.username === currentUser.username ? 'right' : 'left',
                type: msg.type,
                text: msg.text,
                data: { uri: msg.data },
                date: new Date(msg.datetime),
                avatar: msg.sender_avatar,
                dateString: timeFormatter(new Date(msg.datetime)),
            };
        });
    };

    const onChange = async (e) => {
        if (!e.shiftKey && e.charCode === 13 && e.target.value !== '') {
            addMessage();
            e.preventDefault();
        }
    };

    const isScrollTop = (e) => {
        console.log(e.target.scrollTop);
        if (e.target.scrollTop === 0) {
            // getAllMsgs(channelId, '')
            console.log('is top');
        }
    };

    const loadMore = () => {
        if (messageList) {
            getAllMsgs(channelId, messageList[0].message_id);
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
                <Button text="LoadMore Down" onClick={loadMore}></Button>
            </Box>

            <Box flex={1} overflow="auto">
                <MessageList
                    className="message-list"
                    lockable={true}
                    toBottomHeight={'100%'}
                    dataSource={preprocess(messageList)}
                    onScroll={isScrollTop}
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
