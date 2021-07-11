import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AppContext } from '../../context/App/context';
import { ethers } from 'ethers';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Modal from '../../../global/Modal';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import FundCard from './FundCard';

import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Footer from '../../footer';
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  loadingDiv: {
    width: '50%',
    height: 'max-content',
    margin: '10rem auto',
  },
  listContainer: {
    background: theme.background.darkContainer,
    padding: '2rem',
  },
  gridContainer: {
    justifyContent: 'center',
  },
  inputStyles: {
    width: '100%',
  },
  formContainer: {
    padding: '0.4rem',
  },
}));

function List() {
  const classes = useStyles();
  const { providerContract, signerContract, metaMaskEnabled, showError } = useContext(AppContext);

  const [fundProjectList, setFundProjectList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFundProjects = useCallback(async () => {
    if (!providerContract) return;
    try {
      setLoading(true);

      let projectCount = ethers.BigNumber.from(await providerContract.projectCount()).toNumber();

      const projectLists = [];

      for (let i = 1; i <= projectCount; i++) {
        let { id, name, desc, target, endDate, owner, balance, exists } =
          await providerContract.projects(i);
        projectLists.push({ id, name, desc, target, endDate, owner, balance, exists });
      }
      setFundProjectList(projectLists);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setFundProjectList([]);

      showError('Error while fetching Fund Projects');
    }
  }, [providerContract, showError]);

  const createProject = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let name = formData.get('name');
    let desc = formData.get('description');
    let closingDate = formData.get('closingDate');
    closingDate = new Date(closingDate).valueOf();

    let target = formData.get('target');
    target = ethers.BigNumber.from(ethers.utils.parseEther(target.toString())).toString();

    try {
      await signerContract.createProject(name, desc, closingDate, target);
      handleClose();
      await fetchFundProjects();
    } catch (e) {
      setLoading(false);
      showError('Error while creating project');
    }
  };

  const [open, setOpen] = useState(false);
  function handleClose() {
    setOpen(!open);
  }

  useEffect(() => {
    if (!metaMaskEnabled) return;
    return fetchFundProjects();
  }, [providerContract, metaMaskEnabled, fetchFundProjects]);

  return (
    <>
      <Modal label="Create" open={open} setOpen={setOpen} handleClose={handleClose}>
        <form id="addNewProject" onSubmit={createProject}>
          <Grid container className={classes.formContainer} justify="start" spacing={3}>
            <Grid item xs={6}>
              <FormControl className={classes.inputStyles}>
                <InputLabel htmlFor="my-input">Project Name</InputLabel>
                <Input
                  id="projectName"
                  type="text"
                  name="name"
                  placeholder="Project Name"
                  required
                />
                <FormHelperText id="my-helper-text">Enter Your Crowdfund name.</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl className={classes.inputStyles}>
                <InputLabel htmlFor="my-input">Target Amount (Eth)</InputLabel>
                <Input
                  id="projectTarget"
                  type="number"
                  name="target"
                  placeholder="Project Target"
                  maxLength={9}
                  pattern="[+-]?\d+(?:[.,]\d+)?"
                  required
                />
                <FormHelperText id="my-helper-text">Enter Target Ether.</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={8}>
              <FormControl className={classes.inputStyles}>
                <Input
                  id="closingDate"
                  name="closingDate"
                  type="datetime-local"
                  placeholder="Closing Date"
                  required
                />
                <FormHelperText id="my-helper-text">Choose project closing date</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl className={classes.inputStyles}>
                {/* <InputLabel htmlFor="my-input">Project Description</InputLabel> */}
                <Input
                  id="projectDesc"
                  type="text"
                  name="description"
                  // className="form-control"
                  placeholder="Project Description"
                  required
                />
                <FormHelperText id="my-helper-text">Write down your description</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          {/* <input className="btn btn-danger m-2" type="reset" value="Reset" /> */}
          <Button
            variant="contained"
            color="secondary"
            type="reset"
            size="small"
            className={classes.button}
          >
            Reset
          </Button>
        </form>
        <Box>
          <Button variant="outlined" onClick={handleClose} className={classes.button} size="small">
            Close
          </Button>
          <Button
            variant="contained"
            type="submit"
            form="addNewProject"
            color="primary"
            className={classes.button}
            size="small"
          >
            Add Project
          </Button>
        </Box>
      </Modal>
      <Paper elevation={1} className={classes.listContainer}>
        {loading ? (
          <Box className={classes.loadingDiv}>
            {' '}
            <LinearProgress color="secondary" />
          </Box>
        ) : fundProjectList && fundProjectList.length ? (
          <Grid container className={classes.gridContainer}>
            {fundProjectList.map((item, index) => (
              <Grid item key={index} lg={8} xs={8}>
                <FundCard item={item} index={index} listProjects={fetchFundProjects} />
              </Grid>
            ))}
          </Grid>
        ) : (
          'No funding projects yet'
        )}
      </Paper>
      <Footer toggleModal={handleClose} />
    </>
  );
}

export default List;
