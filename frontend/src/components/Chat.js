import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Channel from './Channel';
import ChannelList from "./ChannelList"
import '../styles/channel.css';
import Grid from '@material-ui/core/Grid';
import blueGrey from '@material-ui/core/colors/blueGrey'
// import AuthService from "../services/auth.service";
// import UserService from "../services/user.service";




const useStyles = makeStyles((theme) => ({
  blueGrey: {
    backgroundColor: blueGrey[900]
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
    <Grid container spacing={5} className={classes.blueGrey}>
      <ChannelList/ >
      <Channel channelId={channelId}></Channel>
    </Grid>
  );
}
export default Chat;
