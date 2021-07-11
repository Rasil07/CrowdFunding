import React from 'react';
import List from './List';
import Navbar from '../../coverComponent';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: '1.2rem',
    background: theme.background.body,
  },
  breakText: {
    background: theme.background.default,
    marginTop: '3rem',
    padding: '2rem',
    textAlign: 'center',
  },
}));

function Index() {
  const classes = useStyles();

  return (
    <>
      <Navbar />
      <Box className={classes.breakText}>
        <Typography variant="h3">Crowd Fund Projects.</Typography>
        <Typography variant="subtitle2">
          Below are all the crowd fund projects available.
        </Typography>
      </Box>
      <br />
      <List />
    </>
  );
}

export default Index;
