import React, { useState, useEffect } from 'react';
import Box from "@material-ui/core/Box";
import 'react-chat-elements/dist/main.css';
import '../styles/channel.css';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import indigo from '@material-ui/core/colors/indigo';
import blueGrey from '@material-ui/core/colors/blueGrey'




import {
  Button,
  MessageList,
  Input,
} from 'react-chat-elements';

import MsgService from '../services/msg.service';
import AuthService from '../services/auth.service';

const useStyles = makeStyles((theme) => ({
    bgGrey: {
      backgroundColor: indigo[600]
    },
    purple: {
      backgroundColor: indigo[600],
      color: "#fff"
    },
    blueGrey: {
      backgroundColor: blueGrey[50]
    }
}));


function Channel(props) {
  const classes = useStyles();
  var { channel_id } = props || '2';
  var [messageList, setMessageList] = useState([]);
  var [inputRef, setInputRef] = useState(React.createRef());
  // const currentUser = AuthService.getCurrentUser();
  const currentUser = { username: 'Nick', user_id: 'b05502058' };
  const currentUserName = currentUser ? currentUser.username : 'NotFoundName';

  const sender_id = AuthService.getCurrentUser() || '1';
  const sender_avatar = '';

  const addMessage = async () => {
    setMessageList([
      ...messageList,
      {
        title: 'john',
        position: 'right',
        type: 'text',
        text: inputRef.input.value,
        date: new Date(),
        dateString: new Date().toLocaleString().split(',')[1],
      },
    ]);

    await MsgService.sendMsg(
      channel_id,
      'text',
      inputRef.input.value,
      '',
      sender_id,
      sender_avatar
    );

    inputRef.clear();
    setInputRef(inputRef);
  };

  const preprocess = (msgs) => {
    return msgs.map((msg) => {
      return {
        title:
          msg.sender_id === currentUser.user_id ? currentUserName : 'Others',
        position: msg.sender_id === currentUser.user_id ? 'right' : 'left',
        type: msg.type,
        text: msg.text,
        data: { uri: msg.data },
        date: msg.datetime,
        avatar: msg.sender_avatar,
        dateString: msg.datetime.toLocaleString().split(',')[1],
      };
    });
  };

  const getMessageList = async () => {
    // let data = await MsgService.getAllMsgs(channel_id);
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
    setMessageList(data);
  };

  const onChange = async (e) => {
    console.log(inputRef);
    if (!e.shiftKey && e.charCode === 13 && e.target.value !== '') {
      addMessage();
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (!messageList.length) getMessageList();
  });

  return (
      <Grid item xs={10} md={8} className={classes.blueGrey}>
        <Box height="95vh" display="flex" flexDirection="column">
          <Box className={classes.purple}>
            <Typography inline variant="h5" align="left" width="50%">Channel Title(Online: 5)</Typography>
          </Box>
          <Box flex={1} overflow="auto">
              <MessageList
                lockable={true}
                toBottomHeight={'100%'}
                dataSource={messageList}
              />
            </Box>
            <Box>
              <Input
                className={classes.bgGrey}
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
      </Grid>
  );
}
export default Channel;
