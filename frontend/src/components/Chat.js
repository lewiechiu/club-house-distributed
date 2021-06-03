import  {useState, useEffect}  from 'react'
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";




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
    overflowY: 'auto'
  }
}));



function Chat() {
  const classes = useStyles();
  const currentUser = AuthService.getCurrentUser();
  const currentUserName = currentUser ? currentUser.username : 'NotFoundName';  
  const [textInput, setTextInput] = useState('')
  const [comments, setComments] = useState(
    /** @type {{_id: string, name: string, msg: string, time: string}[]} */([])
  )

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  const handleTextInputChange = ({ target: { name, value } }) => {
    // const { name, value } = event.target
    setTextInput(value)
  }

  const handleFormSubmit = (event) => {
    let msgID = '';
    UserService.addMsg(currentUserName, textInput).then(
        (response) => {
            console.log(response);            
            msgID = response.data._id;
            const currentTime = new Date();
            const newRow = {'_id': msgID, 'name':currentUserName, 'msg': textInput, 'time': currentTime.toLocaleString()};
            setComments(prev => [newRow, ...prev])
            setTextInput('')
        },
        (error) => {
            setTextInput("Message stored fail!");
            console.log(error);
        }
    );

    event.preventDefault();
    
  }
  
  const handleDelete = (name, _id, e) => {
    console.log(_id);
    UserService.deleteMsg(name, _id).then(
        (res) => {
            console.log(res.data.message);
            setComments(comments.filter(item => item._id !== _id));
        },
        (err) => {
            console.log(err);
        }
    )
  }

  useEffect(() => {
    UserService.getAllMsg().then(
        (res) => {
            let newArr = [];
            res.data.data.forEach(obj => {
                newArr.push({
                    "_id": obj._id,
                    "name": obj.username,
                    "msg": obj.msg,
                    "time": new Date(obj.time).toLocaleString()
                })
            });
            console.log(newArr);
            setComments(prev => [...prev, ...newArr]);
        },
        (err) => {
            console.log(err);
        }
    )
  }, [])

  return (
    <div>
        {currentUser===null && (<Redirect to="/login"/>)}
      <form classname={classes.form} onSubmit={handleFormSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            name="message"
            label="Message"
            id="message"
            onChange={handleTextInputChange}
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
      <div>
            <List className={classes.messageArea}>
              {comments.map((comment, index) =>
                  <ListItem key={index}>
                    <Grid container>
                        <Grid item xs={6}>
                            <ListItemText align="left" primary={comment.msg}></ListItemText>
                        </Grid>
                        <Grid item xs={2}>
                            <ListItemText align="left" secondary={comment.name}></ListItemText>
                        </Grid>
                        <Grid item xs={2}>
                            <ListItemText align="left" secondary={comment.time}></ListItemText>
                        </Grid>
                        {(comment.name===currentUserName) && 
                            <Grid item xs={2}>
                                <Button variant="contained" align="right" color="secondary" onClick={(e) => handleDelete(comment.name, comment._id, e)}> Delete </Button>
                            </Grid>
                        }
                    </Grid>
                </ListItem>
              )}
          </List>
      </div>
    </div>
  );
}
export default Chat;
