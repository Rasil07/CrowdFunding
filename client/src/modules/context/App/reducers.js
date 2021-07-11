import ACTIONS from './actions';

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PROVIDER: {
      return {
        ...state,
        provider: action.data,
      };
    }
    case ACTIONS.SET_METAMASK_ENABLED: {
      return {
        ...state,
        metaMaskEnabled: action.data,
      };
    }
    case ACTIONS.SET_WALLET_INFO: {
      return {
        ...state,
        currentWallet: action.data,
      };
    }
    case ACTIONS.SET_SIGNER: {
      return {
        ...state,
        signer: action.data,
      };
    }
    case ACTIONS.GET_CONTRACT_BY_PROVIDER: {
      return {
        ...state,
        providerContract: action.data,
      };
    }
    case ACTIONS.GET_CONTRACT_BY_SIGNER: {
      return {
        ...state,
        signerContract: action.data,
      };
    }
    default:
      return state;
  }
}
export default reducer;
