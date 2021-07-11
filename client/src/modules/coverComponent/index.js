import React from 'react';

import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    background: theme.background.darkContainer,
    display: 'flex',
    alignItems: 'center',
    padding: '0',
  },
  gridContainer: {
    padding: 0,
    alignItems: 'center',
  },
  imgContainer: {
    padding: '0',
    width: '100%',
    height: '100%',
    overflow: 'hide',
  },
  image: {
    width: '100%',
    height: '100%',
    margin: 0,
  },
  headingContainer: {
    padding: '0.4rem 0 0.4rem 2rem',
    display: 'flex',
    flexDirection: 'column',
  },
  heading: {
    color: theme.palette.text.default,
    fontWeight: '700',
    letterSpacing: '1rem',
  },
  subHeading: {
    fontWeight: '600',
    color: theme.palette.text.complementaryGreen,
    letterSpacing: '0.2rem',
  },
}));
export default function Navbar(props) {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Grid container className={classes.gridContainer}>
        <Grid item lg={5} xs={12} className={classes.headingContainer}>
          <Typography variant="h2" className={classes.heading}>
            Crowd Funding
          </Typography>
          <Typography variant="h6" className={classes.subHeading}>
            Contribute To The People In Need
          </Typography>{' '}
        </Grid>
        <Grid item lg={7} xs={12} className={classes.imgContainer}>
          <img src={'/crowfund.jpg'} alt="img" className={classes.image} />
        </Grid>
      </Grid>
    </Box>
  );
}
