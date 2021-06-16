import React, { useState, useEffect } from 'react';
import ChannelItem from './ChannelItem';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Identicon from 'react-identicons';
import blueGrey from '@material-ui/core/colors/blueGrey';

import AuthService from '../services/auth.service';
import useChannel from '../services/channel.service';

// css
const useStyles = makeStyles((theme) => ({
    list: {
        //   width: '100%',
        //   maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        paddingTop: '0',
        paddingBottom: '0',
        maxHeight: '100vh',
        overflow: 'auto',
    },
    white: {
        backgroundColor: '#fff',
    },
    selfHeader: {
        backgroundColor: blueGrey[400],
        color: '#fff',
    },
    logoutBtn: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        marginLeft: theme.spacing(2),
        justify: 'flex-end',
    },
    secondaryAction: {
        paddingRight: 30,
    },
}));

export default function ChannelList(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [newChannelTitle, setNewChannelTitle] = useState('');
    const currentUser = AuthService.getCurrentUser();

    const {
        channelList,
        getAllChannels,
        createChannel,
        enterChannel,
        leaveChannel,
        reloadChannel,
    } = useChannel();

    let {
        curChannelId,
        setCurChannelId,
        curChannelName,
        setCurChannelName,
        curChannelCnt,
        setCurChannelCnt,
    } = props;

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleInput = (evt) => {
        const title = evt.target.value;
        setNewChannelTitle(title);
    };

    const handleLogout = () => {
        if (curChannelId !== '') {
            leaveChannel(curChannelId);
        }
        AuthService.logout();
    };

    //create channel
    const handleCreate = (evt) => {
        evt.preventDefault();
        createChannel(newChannelTitle, (err, data) => {
            if (err) {
                console.log('Create Channel Fail!');
                return;
            }
            if (curChannelId !== '') {
                leaveChannel(curChannelId);
            }
            setCurChannelId(data);
            setCurChannelName(newChannelTitle);
            setCurChannelCnt(1);
        });
    };

    // Enter channel
    const handleJoin = (cid) => {
        if (curChannelId !== '') {
            console.log(`frontend leaving ${curChannelId}`);
            leaveChannel(curChannelId);
        }
        enterChannel(cid);
        setCurChannelId(cid);
        const curChannelData = channelList.find(
            (cdata) => cdata.channel_id === cid
        );
        setCurChannelName(curChannelData.channel_name);
        setCurChannelCnt(parseInt(curChannelData.people_count) + 1);
    };

    //Get channel list in first render
    useEffect(() => {
        getAllChannels('');
    }, []);

    return (
        <List className={classes.list}>
            <ListItem
                key={'selfheader'}
                alignItems="center"
                className={classes.selfHeader}
            >
                <ListItemAvatar>
                    <Avatar
                        className={classes.white}
                        alt={currentUser.username}
                    >
                        <Identicon string={currentUser.username} size="25" />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={currentUser.username} />
                <ListItemSecondaryAction
                    onClick={handleLogout}
                    className={classes.secondaryAction}
                >
                    <IconButton aria-label="delete">
                        <ExitToAppIcon color="primary" fontSize="large" />
                    </IconButton>
                </ListItemSecondaryAction>
                <ListItemSecondaryAction onClick={handleOpen}>
                    <IconButton edge="end" aria-label="delete">
                        <AddCircleOutlineIcon
                            color="primary"
                            fontSize="large"
                        />
                    </IconButton>
                </ListItemSecondaryAction>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <form onSubmit={handleCreate}>
                        <DialogTitle id="form-dialog-title">
                            New Channel Title
                        </DialogTitle>
                        <DialogContent>
                            <TextField
                                onChange={handleInput}
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Name"
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                onClick={handleClose}
                                color="primary"
                            >
                                Create
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </ListItem>
            {channelList.map((channelData) => (
                <ChannelItem
                    key={channelData.channel_id}
                    data={channelData}
                    onJoin={handleJoin}
                />
            ))}
        </List>
    );
}
