import React from 'react';
import ChannelItem from './ChannelItem'
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
import indigo from '@material-ui/core/colors/indigo'



const useStyles = makeStyles((theme) => ({
    list: {
    //   width: '100%',
    //   maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    white: {
        backgroundColor: "#fff"
    },
    purple: {
        backgroundColor: indigo[600],
        color: "#fff"
    }
}));

export default function ChannelList(props) {
    const {data} = props;
    const classes = useStyles();
    console.log(data)
    return(

        <List className={classes.list}>
            <ListItem alignItems="center" className={classes.purple}>
                <ListItemAvatar>
                    <Avatar className={classes.white} alt='Johnnnyy K.'> 
                        <Identicon string="Johnnnyy K." size="25"/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary="Johnnnyy K."
                />
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <AddCircleOutlineIcon color="primary" fontSize="large"/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            {data.map((channelData) => (
                <ChannelItem key={channelData.channel_id} data={channelData} />
            ))}
        </List>
        
    )
}