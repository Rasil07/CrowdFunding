import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
  appBar: {
    top: 'auto',
    bottom: 0,
    background: theme.background.transparent,
    boxShadow: 'none',
  },

  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -10,
    left: 'auto',
    right: '1rem',
    margin: '0 auto',
  },
}));

export default function BottomAppBar(props) {
  const { toggleModal } = props;
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />

      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
          <div>
            <Fab
              color="secondary"
              aria-label="add"
              className={classes.fabButton}
              onClick={() => toggleModal()}
            >
              <AddIcon />
            </Fab>

            {/* <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <Modal label="Create">Modal</Modal>
              </MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
            </Menu> */}
          </div>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
