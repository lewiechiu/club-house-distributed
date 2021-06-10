import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Channel from './Channel';
// import AuthService from "../services/auth.service";
// import UserService from "../services/user.service";

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
    <div>
      <Channel channelId={channelId}></Channel>
    </div>
  );
}
export default Chat;
