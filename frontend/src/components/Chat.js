import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Channel from './Channel';
import ChannelList from "./ChannelList"
import '../styles/channel.css';
import Grid from '@material-ui/core/Grid';
// import AuthService from "../services/auth.service";
// import UserService from "../services/user.service";


const channelListData = [
  {
    "channel_id": Math.random().toString(),
    "people_count": 100,
    "channel_name": "Singing channel",
    "users":[
      {"username": "John", "avatar_url": "logo192.png"},
      {"username": "Mary", "avatar_url": ""},
      {"username": "Coco", "avatar_url": "logo192.png"},
      {"username": "Kan", "avatar_url": ""},
      {"username": "Kelly", "avatar_url": ""},
      {"username": "Kan", "avatar_url": ""},
      {"username": "Kelly", "avatar_url": ""},
    ],
  },
  {
    "channel_id": Math.random().toString(),
    "people_count": 50,
    "channel_name": "NTU channel",
    "users":[
      {"username": "John", "avatar_url": ""},
      {"username": "Mary", "avatar_url": ""},
      {"username": "Coco", "avatar_url": "logo192.png"},
      {"username": "Kan", "avatar_url": "logo192.png"},
      {"username": "Kelly", "avatar_url": ""},
    ],
  }
]

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  messageArea: {
    height: '70vh',
    overflowY: 'auto',
  },
}));

function Chat() {
  const classes = useStyles();
  // const currentUser = AuthService.getCurrentUser();
  // const currentUserName = currentUser ? currentUser.username : 'NotFoundName';
  const [textInput, setTextInput] = useState('');
  const [comments, setComments] = useState(
    /** @type {{_id: string, name: string, msg: string, time: string}[]} */ ([])
  );
  var channelId = 1;

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}><ChannelList className="chat-list" data={channelListData}/ ></Grid>
      <Grid item xs={8}><Channel channelId={channelId}></Channel></Grid>
    </Grid>
  );
}
export default Chat;
