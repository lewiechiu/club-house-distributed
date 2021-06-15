import React, { useState, useEffect } from 'react';
import ChannelItem from './ChannelItem';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Identicon from 'react-identicons';
import blueGrey from '@material-ui/core/colors/blueGrey';
import Button from '@material-ui/core/Button';

import AuthService from '../services/auth.service';
import useChannel from '../services/channel.service';
// Fake data
// const channelListData = [
//     {
//         channel_id: Math.random().toString(),
//         people_count: 100,
//         channel_name: 'Singing channel',
//         users: [
//             { username: 'John', avatar_url: 'logo192.png' },
//             { username: 'Mary', avatar_url: '' },
//             { username: 'Coco', avatar_url: 'logo192.png' },
//             { username: 'Kan', avatar_url: '' },
//             { username: 'Kelly', avatar_url: '' },
//             { username: 'Kan', avatar_url: '' },
//             { username: 'Kelly', avatar_url: '' },
//         ],
//     },
//     {
//         channel_id: Math.random().toString(),
//         people_count: 50,
//         channel_name: 'NTU channel',
//         users: [
//             { username: 'John', avatar_url: '' },
//             { username: 'Mary', avatar_url: '' },
//             { username: 'Coco', avatar_url: 'logo192.png' },
//             { username: 'Kan', avatar_url: 'logo192.png' },
//             { username: 'Kelly', avatar_url: '' },
//         ],
//     },
// ];

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
}));

export default function ChannelList(props) {
    const currentUser = AuthService.getCurrentUser();
    const classes = useStyles();
    // const [channelList, setChannelList] = useState(channelListData);
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

    // click "join channel"
    const handleJoin = (cid) => {
        console.log(`Join channel ${cid}!`);
        setCurChannelId(cid);
        const curChannelData = channelList.find(
            (cdata) => cdata.channel_id === cid
        );
        console.log('cur: ', curChannelData);
        setCurChannelName(curChannelData.channel_name);
        setCurChannelCnt(curChannelData.people_count);
        if (curChannelId === '') {
            //S: Enter channel
        } else {
            //S: Leave channel and enter another channel
        }
    };

    //click "create channel"
    const handleCreate = () => {
        console.log('Create channel!');
        if (curChannelId === '') {
            //S: Create channel and get cid
            // setCurChannelId(cid);
        } else {
            //S: Leave channel, create one channel and get cid
            // setCurChannelId(cid);
        }
    };

    const handleLogout = () => {
        AuthService.logout();
    };

    //Get channel list in first render
    useEffect(() => {
        console.log('Get channel list in first render!');
        getAllChannels('');
        //S: Get all channel
        // setChannelList(data)
    }, []);

    //Update channel list at all time
    useEffect(() => {
        console.log('Update channel list at all time...');
        //S: Receive updated channel and resort channel list
        // let newChannel = {};
        // let newList = [...channelList, newChannel];
        // let newSortList = newList.sort((a, b) => (a.user_count > b.user_count ? 1 : -1));
        // setChannelList(newSortList.slice(0, -1));
    });

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
                <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    className={classes.logoutBtn}
                    onClick={handleLogout}
                >
                    LOG OUT
                </Button>
                <ListItemSecondaryAction onClick={handleCreate}>
                    <IconButton edge="end" aria-label="delete">
                        <AddCircleOutlineIcon
                            color="primary"
                            fontSize="large"
                        />
                    </IconButton>
                </ListItemSecondaryAction>
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
