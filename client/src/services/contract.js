import { ethers } from 'ethers';
import ContractAbi from '../contract/abis/Crowdfunding.json';

const ContractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

export const getContractByProvider = async (provider) => {
  try {
    const { abi } = ContractAbi;
    const contract = new ethers.Contract(ContractAddress, abi, provider);
    return contract;
  } catch (err) {
    throw err;
  }
};
export const getContractBySigner = async (signer) => {
  try {
    const { abi } = ContractAbi;
    const contract = new ethers.Contract(ContractAddress, abi, signer);
    return contract;
  } catch (err) {
    throw err;
  }
};
