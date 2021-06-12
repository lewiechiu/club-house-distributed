import { makeStyles, useTheme  } from '@material-ui/core/styles';
import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Identicon from 'react-identicons';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(1),
    },
    content: {
        marginLeft: theme.spacing(1)
    },
    white: {
        backgroundColor: "#fff"
    },
    joinBtn: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        marginLeft: theme.spacing(2),
        justify: "flex-end"
    }
}));

export default function ChannelList(props){
    const classes = useStyles();
    const { data } = props;

    return(
        <CardActionArea component="button">
            <Card className={classes.root}>
                <Grid className={classes.details} xs={8}>
                    <Typography component="h6" variant="h6" className={classes.content}>
                        {data.channel_name}({data.people_count})
                    </Typography>
                    <AvatarGroup max={5} >
                        {data.users.map((user) => (user.avatar_url == "") ?
                        <Avatar className={classes.white} alt={user.username}> 
                            <Identicon string={user.username} size="25"/>
                        </Avatar> :
                        <Avatar alt={user.username} src={user.avatar_url}/>)}
                    </AvatarGroup>
                </Grid>
                <Grid className={classes.details} xs={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.joinBtn}
                        endIcon={<QuestionAnswerIcon/>}
                    >
                        JOIN
                    </Button>
                </Grid>
            </Card>
        </CardActionArea>
    )
    
    

}
