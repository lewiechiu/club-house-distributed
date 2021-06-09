import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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

  return (
    <div>
      <form classname={classes.form}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          name="message"
          label="Message"
          id="message"
          value={textInput}
        />
        <Button
          type="submit"
          variant="contained"
          margin="normal"
          color="primary"
          className={classes.submit}
        >
          Enter
        </Button>
      </form>
      <div></div>
      <div>Hi</div>
    </div>
  );
}
export default Chat;
