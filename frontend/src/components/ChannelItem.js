import { makeStyles, useTheme } from '@material-ui/core/styles';
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
import blueGrey from '@material-ui/core/colors/blueGrey';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        backgroundColor: blueGrey[50],
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(1),
    },
    content: {
        marginLeft: theme.spacing(1),
    },
    white: {
        backgroundColor: '#fff',
    },
    joinBtn: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        marginLeft: theme.spacing(2),
        justify: 'flex-end',
    },
}));

export default function ChannelList(props) {
    const classes = useStyles();
    const { data, onJoin } = props;

    return (
        <CardActionArea component="button">
            <Card className={classes.root}>
                <Grid container>
                    <Grid item className={classes.details} xs={8}>
                        <Typography
                            variant="subtitle1"
                            className={classes.content}
                        >
                            {data.channel_name}
                        </Typography>
                        <Typography
                            variant="subtitle2"
                            className={classes.content}
                        >
                            {data.channel_id}
                        </Typography>
                        <AvatarGroup max={5}>
                            {data.users.map((user) =>
                                user.avatar_url === '' ? (
                                    <Avatar
                                        className={classes.white}
                                        alt={user.username}
                                    >
                                        <Identicon
                                            string={user.username}
                                            size="25"
                                        />
                                    </Avatar>
                                ) : (
                                    <Avatar
                                        alt={user.username}
                                        src={user.avatar_url}
                                    />
                                )
                            )}
                        </AvatarGroup>
                    </Grid>
                    <Grid
                        item
                        className={classes.details}
                        xs={4}
                        onClick={() => onJoin(data.channel_id)}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.joinBtn}
                            endIcon={<QuestionAnswerIcon />}
                        >
                            JOIN
                        </Button>
                    </Grid>
                </Grid>
            </Card>
        </CardActionArea>
    );
}
