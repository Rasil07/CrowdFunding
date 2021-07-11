import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import Typography from '@material-ui/core/Typography';
import { red, green } from '@material-ui/core/colors';

import SendIcon from '@material-ui/icons/Send';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Chip from '@material-ui/core/Chip';
import {
  convertEth,
  getRemainingTime,
  convertBigNumber,
  convertToWei,
} from '../../../utils/etherMethods';

import PropTypes from 'prop-types';
import { AppContext } from '../../context/App/context';
import { useHistory } from 'react-router-dom';

// STYLES START
const useStyles = makeStyles((theme) => ({
  container: {
    margin: '0.3rem',
    padding: '1rem',
    width: '100%',
    background: theme.background.default,
  },
  gridContainer: {
    // alignItems: 'center',
  },
  topItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  details: {
    height: '100%',
  },
  ether: {
    margin: '0 0 0 auto',
  },
  donate: {
    display: 'flex',
    justifyContent: 'end',
  },
  title: {
    color: theme.palette.text.darkHighlight,
    fontWeight: '600',
    letterSpacing: '0.12rem',
  },
  funded: {
    marginRight: '1rem',
  },
  days: {
    color: theme.palette.text.complementaryGreen,
    margin: '0.2rem 0rem',
  },
  description: {
    color: theme.palette.text.dark,
  },
  progress: {
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '0.4rem',
    alignItems: 'start',
    justifyContent: 'center',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  fundOpenAvatar: {
    background: green[500],
  },
  fundClosedAvatar: {
    background: red[500],
  },
}));
// STYLES END

// CircularProgressWithLabel START

function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">{` ${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

// CircularProgressWithLabel START

// Main Component START

function Fund(props) {
  const { item, listProjects } = props;
  const history = useHistory();
  const [progress, setProgress] = useState(0);
  const [eth, setEth] = useState(0);
  const [error, setError] = useState(false);

  const { signerContract, currentWallet, showError } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const classes = useStyles();

  function setProgressPercentage() {
    if (!item) return;
    const { target, balance } = item;
    const percentage = Math.floor((convertEth(balance) / convertEth(target)) * 100);
    setProgress(percentage);
  }
  async function sendEther() {
    if (eth <= 0) {
      setError(true);

      setTimeout(() => {
        setError(false);
      }, 500);
      return;
    }
    let ethValue = eth.toString();
    let value = convertToWei(ethValue);

    try {
      await signerContract.fundProject(parseInt(convertBigNumber(item.id)), {
        value,
      });
      return listProjects();
    } catch (err) {
      showError('Error while funding Project');
    }
  }

  async function closeProject() {
    handleClose();
    try {
      await signerContract.closeProject(parseInt(convertBigNumber(item.id)));
      return listProjects();
    } catch (err) {
      showError('Closing Project Unsuccessful');
    }
  }
  function goToDetails() {
    return history.push(`/fund/${item.id}`);
  }

  useEffect(setProgressPercentage, [item]);
  return (
    <Paper elevation={5} className={classes.container}>
      <Grid container className={classes.gridContainer} spacing={3}>
        <Grid item lg={3}>
          <Grid item xs={12} className={classes.topItem}>
            {item && item.exists ? (
              <Chip
                avatar={
                  <Avatar aria-label="status" className={classes.fundOpenAvatar}>
                    C
                  </Avatar>
                }
                label="Closed"
                color="secondary"
              />
            ) : (
              <Chip
                avatar={
                  <Avatar aria-label="status" className={classes.fundOpenAvatar}>
                    O
                  </Avatar>
                }
                label="Open"
                color="primary"
              />
            )}
          </Grid>
          <Grid item className={classes.progress}>
            <Box>
              <CircularProgressWithLabel
                variant="determinate"
                color="secondary"
                value={progress}
                size="8rem"
                thickness={2}
              />
            </Box>
          </Grid>
        </Grid>
        <Grid item lg={9} className={classes.details}>
          <Grid item xs={12} className={classes.topItem}>
            <Box>
              <Typography variant="h5" className={classes.title}>
                {item && item.name ? item.name : 'N/A'}
              </Typography>
              <Typography variant="subtitle2" className={classes.days}>
                {item && item._endDate ? `${getRemainingTime(item.endDate)} days ` : 'N/A'} days
                left.
              </Typography>
            </Box>
            {item.owner === currentWallet.address && item.exists && (
              <div>
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="fade-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                >
                  <MenuItem onClick={() => closeProject()}>Close Project </MenuItem>

                  {/* <MenuItem onClick={() => goToDetails()}>View Contributors</MenuItem> */}
                </Menu>
              </div>
            )}
          </Grid>

          <div className="w-100 d-flex align-items-center ">
            <Typography variant="overline" color="primary" component="p" className={classes.funded}>
              {item && item.balance ? `Funded: ${convertEth(item.balance)} ETH` : 'N/A'}
            </Typography>
            <Typography
              variant="overline"
              color="textSecondary"
              component="p"
              className={classes.funded}
            >
              {item && item.target ? `Target: ${convertEth(item.target)} ETH` : 'N/A'}
            </Typography>
          </div>
          <br />

          <Typography variant="body1" color="textSecondary" className={classes.description}>
            {item && item.desc ? item.desc : 'N/A'}
          </Typography>
          <br />

          <Button variant="outlined" color="primary" onClick={() => goToDetails()}>
            Show
          </Button>
        </Grid>
        <Grid item xs={12} lg={12} className={classes.donate}>
          {item && item.exists ? (
            <Box className={classes.ether}>
              <FormControl>
                <InputLabel htmlFor="my-input">ETH</InputLabel>
                <Input
                  id="my-input"
                  aria-describedby="my-helper-text"
                  type="number"
                  value={eth ? eth : ''}
                  min={0}
                  onChange={(e) => setEth(e.target.value)}
                  error={error}
                />
                <FormHelperText id="my-input-helper-text" error={error}>
                  {!error ? 'Enter ETH to fund.' : 'Incorrect Value Sent.'}
                </FormHelperText>
              </FormControl>

              <IconButton aria-label="add to favorites" onClick={() => sendEther()}>
                <SendIcon />
              </IconButton>
            </Box>
          ) : (
            <Box className={classes.ether}>
              <FormControl>
                <InputLabel htmlFor="my-input">ETH</InputLabel>
                <Input id="my-input" aria-describedby="my-helper-text" type="number" disabled />
                <FormHelperText id="my-input-helper-text" error={error}>
                  Project Closed
                </FormHelperText>
              </FormControl>
            </Box>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}
// Main Component START

export default Fund;
