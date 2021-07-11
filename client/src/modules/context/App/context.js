import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import appReduce from './reducers';
import ACTIONS from './actions';
import * as ContractService from '../../../services/contract';
import { ethers } from 'ethers';
import Swal from 'sweetalert2';

const initialState = {
  provider: null,
  signer: null,
  providerContract: null,
  signerContract: null,
  metaMaskEnabled: false,
  currentWallet: {},
};

export const AppContext = createContext(initialState);

export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReduce, initialState);

  const getContractByProvider = useCallback(
    //callback function that retrieves provider contract and puts it on our context
    async (args = null) => {
      const provider = args;
      if (!provider) return;
      const contract = await ContractService.getContractByProvider(provider);
      dispatch({ type: ACTIONS.GET_CONTRACT_BY_PROVIDER, data: contract });
      return contract;
    },
    [dispatch],
  );

  const getContractBySigner = useCallback(
    //callback function that retrieves signer contract and puts it on our context
    async (args = null) => {
      const signer = args;
      if (!signer) return;
      const contract = await ContractService.getContractBySigner(signer);

      dispatch({ type: ACTIONS.GET_CONTRACT_BY_SIGNER, data: contract });
      return contract;
    },
    [dispatch],
  );

  const getCurrentWallet = useCallback(
    async (signer) => {
      if (!signer) return;

      let balance = ethers.utils.formatEther(await signer.getBalance());
      let address = await signer.getAddress();

      dispatch({ type: ACTIONS.SET_WALLET_INFO, data: { address, balance } });
    },
    [dispatch],
  );

  const loadMetamask = useCallback(async () => {
    //initializing function for our context
    try {
      let provider;
      provider = new ethers.providers.Web3Provider(window.ethereum);
      dispatch({ type: ACTIONS.SET_PROVIDER, data: provider });
      await getContractByProvider(provider);
      const signer = provider.getSigner();
      dispatch({ type: ACTIONS.SET_SIGNER, data: signer });
      await getContractBySigner(signer);
      await getCurrentWallet(signer);

      dispatch({ type: ACTIONS.SET_METAMASK_ENABLED, data: true });
    } catch (err) {}
  }, [dispatch, getContractBySigner, getContractByProvider, getCurrentWallet]);

  function showError(msg = '') {
    return Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: msg ? msg : 'Something went wrong!',
    });
  }

  useEffect(() => {
    if (!window.ethereum) {
      return;
    } else {
      // Request account access if needed
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(() => loadMetamask())
        .catch((err) => {
          if (err.code === 4001) {
            console.log('Please connect to MetaMask.');
          } else {
            console.error(err);
          }
        });

      //listener for changing network

      window.ethereum.on('chainChanged', () => loadMetamask());

      //listener for changing account

      window.ethereum.on('accountsChanged', () => loadMetamask());
    }
  }, [loadMetamask]);

  return (
    <AppContext.Provider
      value={{
        provider: state.provider,
        signer: state.signer,
        providerContract: state.providerContract,
        signerContract: state.signerContract,
        metaMaskEnabled: state.metaMaskEnabled,
        currentWallet: state.currentWallet,
        getContractByProvider,
        getContractBySigner,
        showError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
