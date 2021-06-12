import React, { useState, useEffect } from 'react';
import ChannelItem from './ChannelItem'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Grid from '@material-ui/core/Grid';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Identicon from 'react-identicons';
import indigo from '@material-ui/core/colors/indigo'
import blueGrey from '@material-ui/core/colors/blueGrey'

// Fake data
const currentUser = { username: 'Nick', token: 'b05502058', avatar_url:""};
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

// css
const useStyles = makeStyles((theme) => ({
    list: {
    //   width: '100%',
    //   maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        paddingTop: "0",
        paddingBottom: "0",
        maxHeight: '100vh',
        overflow: 'auto',
    },
    white: {
        backgroundColor: "#fff"
    },
    purple: {
        backgroundColor: blueGrey[400],
        color: "#fff"
    },
    blueGrey: {
        backgroundColor: blueGrey[600]
    }
}));

export default function ChannelList() {
    const classes = useStyles();
    const [curChannelId, setCurChannelId] = useState("");
    const [channelList, setChannelList] = useState(channelListData);

    // click "join room"
    const handleJoin = (channel_id) => {
        if (curChannelId == ""){
            //S: Enter room
            setCurChannelId(channel_id);
        }else{
            //S: Leave room and enter another room
            setCurChannelId(channel_id);
        }
    }

    //click "create room"
    const handleCreate = () => {
        if (curChannelId == ""){
            //S: Create room and get cid
            // setCurChannelId(cid);
        }else{
            //S: Leave room, create one room and get cid
            // setCurChannelId(cid);
        }
    }

    //update channel list??? get channel list in first render???
    useEffect(() => {
        //S: Receive channel
    });

    return(
        <Grid item xs={2} md={4} className={classes.blueGrey}>
            <List className={classes.list}>
                <ListItem alignItems="center" className={classes.purple}>
                    <ListItemAvatar>
                        <Avatar className={classes.white} alt={currentUser.username}> 
                            <Identicon string={currentUser.username} size="25"/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={currentUser.username}
                    />
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete">
                            <AddCircleOutlineIcon color="primary" fontSize="large"/>
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
                {channelListData.map((channelData) => (
                    <ChannelItem key={channelData.channel_id} data={channelData} />
                ))}
            </List>
        </Grid>   
    )
}