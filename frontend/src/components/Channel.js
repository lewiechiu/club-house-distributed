import React, { useState, useEffect } from 'react';
import 'react-chat-elements/dist/main.css';
import '../styles/channel.css';

import {
  Button,
  MessageList,
  Input,
} from 'react-chat-elements';

import MsgService from '../services/msg.service';
import AuthService from '../services/auth.service';

function Channel(props) {
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
    // let data = [
    //   {
    //     title: 'john',
    //     position: 'right',
    //     type: 'text',
    //     text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    //     date: new Date(),
    //     avatar: 'https://randomuser.me/api/portraits/men/60.jpg',
    //     dateString: new Date().toLocaleString().split(',')[1],
    //   },
    //   {
    //     title: 'john',
    //     position: 'left',
    //     type: 'text',
    //     text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    //     date: new Date(),
    //     avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    //     dateString: new Date().toLocaleString().split(',')[1],
    //   },
    //   {
    //     title: 'john',
    //     position: 'right',
    //     type: 'text',
    //     text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    //     date: new Date(),
    //     avatar: 'https://randomuser.me/api/portraits/women/67.jpg',
    //     dateString: new Date().toLocaleString().split(',')[1],
    //   },
    //   {
    //     title: 'john',
    //     position: 'right',
    //     type: 'text',
    //     text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    //     date: new Date(),
    //     avatar: 'https://randomuser.me/api/portraits/women/67.jpg',
    //     dateString: new Date().toLocaleString().split(',')[1],
    //   },
    // ];
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
      <div className="right-panel">
        <MessageList
          className="message-list"
          lockable={true}
          downButtonBadge={10}
          dataSource={messageList}
        />
        <Input
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
      </div>
  );
}
export default Channel;
