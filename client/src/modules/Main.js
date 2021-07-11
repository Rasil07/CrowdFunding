import React, { useContext } from 'react';

import FundList from './crowdFunds/list';

import { AppContext } from './context/App/context';
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom';
import Navbar from './navbar';

import FundDetails from './crowdFunds/details';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: '1.2rem',
    background: theme.background.body,
    minHeight: '100vh',
  },
  breakText: {
    background: theme.background.default,
    marginTop: '3rem',
    padding: '2rem',
    textAlign: 'center',
  },
}));

function App() {
  const { metaMaskEnabled } = useContext(AppContext);
  const history = useHistory();

  const classes = useStyles();

  return (
    <Box className={classes.root}>
      {metaMaskEnabled ? (
        <Box>
          <Router history={history}>
            <Navbar />
            <Switch>
              <Route path="/" exact component={FundList} />
              <Route path="/fund/:id" exact component={FundDetails} />
            </Switch>
          </Router>
        </Box>
      ) : (
        <div className="d-flex align-items-center justify-content-center">
          <h4>Connect to metamask first ...</h4>
        </div>
      )}
    </Box>
  );
}

export default App;
