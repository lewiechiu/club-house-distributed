import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Channel from './Channel';
import ChannelList from './ChannelList';
import '../styles/channel.css';
import Grid from '@material-ui/core/Grid';
import blueGrey from '@material-ui/core/colors/blueGrey';

const useStyles = makeStyles((theme) => ({
    blueGreyRight: {
        backgroundColor: blueGrey[50],
    },
    blueGreyLeft: {
        backgroundColor: blueGrey[600],
    },
}));

function Chat() {
    const classes = useStyles();
    const [curChannelId, setCurChannelId] = useState('');
    const [curChannelName, setCurChannelName] = useState('');
    const [curChannelCnt, setCurChannelCnt] = useState(0);
    var channelId = 1;

    return (
        <Grid container spacing={5}>
            <Grid item xs={2} md={4} className={classes.blueGreyLeft}>
                <ChannelList
                    curChannelId={curChannelId}
                    setCurChannelId={setCurChannelId}
                    curChannelName={curChannelName}
                    setCurChannelName={setCurChannelName}
                    curChannelCnt={curChannelCnt}
                    setCurChannelCnt={setCurChannelCnt}
                />
            </Grid>
            <Grid item xs={10} md={8} className={classes.blueGreyRight}>
                {curChannelId === '' ? null : (
                    <Channel
                        channelId={curChannelId}
                        channelName={curChannelName}
                        channelCnt={curChannelCnt}
                    />
                )}
            </Grid>
        </Grid>
    );
}
export default Chat;
