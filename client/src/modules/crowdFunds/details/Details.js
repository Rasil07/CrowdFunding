import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../../context/App/context';
import { convertEth, convertBigNumber, unixToLocaleDate } from '../../../utils/etherMethods';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import grey from '@material-ui/core/colors/grey';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  paperCard: {
    width: '100%',
    padding: '0.7rem',
  },
  projectContainer: {
    padding: '0.5rem',
  },
  projectInfoContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  infoContainer: {
    margin: '0 0.4rem 0 0.4rem',
  },
  projectHeaders: {
    fontSize: '1.4rem',
    fontWeight: '600',
    color: grey[600],
    opacity: 0.9,
    marginBottom: '0.5rem',
  },
  list: {
    width: '90%',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));
function Details(props) {
  const id = props.match.params.id;
  const classes = useStyles();
  const { providerContract, showError } = useContext(AppContext);

  const [projectInfo, setProjectInfo] = useState(null);
  const [contributionInfo, setContributionsInfo] = useState(null);

  const getContributions = useCallback(async () => {
    if (!id) return;
    try {
      let totalContributors = await providerContract.getContibutionsLength(parseInt(id));
      totalContributors = parseInt(convertBigNumber(totalContributors));

      const contributorAddresses = [];
      for (let i = 0; i < totalContributors; i++) {
        let address = await providerContract.getContributor(id, i);
        contributorAddresses.push(address);
      }

      const contributionInfos = await Promise.all(
        contributorAddresses.map(async (item) => {
          let contributedAmount = convertEth(await providerContract.contributions(id, item));
          return { amount: contributedAmount, address: item };
        }),
      );

      setContributionsInfo(contributionInfos);
    } catch (err) {
      showError('Error while loading contributions');
    }
  }, [id, showError, providerContract]);
  const fetchDetails = useCallback(async () => {
    if (!id) return;

    try {
      const res = await providerContract.projects(id);
      let { name, target, endDate, desc, balance, exists, owner } = res;
      target = convertEth(target);
      endDate = Number(convertBigNumber(endDate));

      balance = convertEth(balance);

      setProjectInfo({ name, target, endDate, desc, balance, exists, owner });
    } catch (err) {
      showError('Error while loading project info');
    }
  }, [id, providerContract, showError]);
  useEffect(() => getContributions(), [id, getContributions]);

  useEffect(() => fetchDetails(), [id, fetchDetails]);

  return (
    <Box>
      <Paper
        elevation={3}
        className={classes.paperCard}
        children={
          <DetailContainer
            projectInfo={projectInfo}
            contributionInfo={contributionInfo}
            classes={classes}
          />
        }
      />
    </Box>
  );
}

function DetailContainer(props) {
  const { contributionInfo, projectInfo, classes } = props;

  return (
    <Box className={classes.container}>
      <Grid container>
        <Grid item xs={12} className={classes.projectContainer}>
          <Typography vairant="overline" className={classes.projectHeaders}>
            Project Information
          </Typography>
          <Grid item lg={12}>
            <Box className={classes.infoContainer}>
              <Typography variant="overline" color="textSecondary">
                Name
              </Typography>
              <Typography variant="subtitle1" component="h2" color="primary">
                {projectInfo && projectInfo.name ? projectInfo.name : ''}
              </Typography>
            </Box>
          </Grid>
          <Grid item lg={8} className={classes.projectInfoContainer}>
            <Box className={classes.infoContainer}>
              <Typography variant="overline" color="textSecondary">
                Total Funded
              </Typography>
              <Typography variant="subtitle1" component="h2">
                {projectInfo && projectInfo.balance ? projectInfo.balance : ''} ETH
              </Typography>
            </Box>
            <Box className={classes.infoContainer}>
              <Typography variant="overline" color="textSecondary">
                Target Fund
              </Typography>
              <Typography variant="subtitle1" component="h2">
                {projectInfo && projectInfo.target ? projectInfo.target : ''} ETH
              </Typography>
            </Box>
            <Box className={classes.infoContainer}>
              <Typography variant="overline" color="textSecondary">
                Expiry Date
              </Typography>
              <Typography variant="subtitle1" component="h2">
                {projectInfo && projectInfo.endDate ? unixToLocaleDate(projectInfo.endDate) : ''}
              </Typography>
            </Box>
            <Box className={classes.infoContainer}>
              <Typography variant="overline" color="textSecondary">
                Status
              </Typography>
              <Typography variant="subtitle1" component="h2">
                {projectInfo && projectInfo.exists ? 'Open' : 'Closed'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Divider style={{ width: '90%', marginLeft: '0.4rem' }} />
        <Grid item xs={12} className={classes.projectContainer}>
          <Typography vairant="overline" className={classes.projectHeaders}>
            Contributions
          </Typography>{' '}
          {contributionInfo && contributionInfo.length ? (
            contributionInfo.map((item, index) => (
              <List className={classes.list} key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`${item.amount} ETH`}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          Donated By: {item.address}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </List>
            ))
          ) : (
            <List className={classes.list}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary=" No Contributions Yet !!!
                  "
                />
              </ListItem>
            </List>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default Details;
