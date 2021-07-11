import { ethers } from 'ethers';

export const convertEth = (bigNum) => {
  return ethers.utils.formatEther(bigNum);
};

export const getRemainingTime = (date) => {
  const converted = ethers.BigNumber.from(date).toString();
  return Math.ceil((Number(converted) - new Date().getTime()) / 1000 / 60 / 60 / 24);
};
export const convertBigNumber = (bigNum) => {
  return ethers.BigNumber.from(bigNum).toString();
};

export const convertToWei = (eth) => {
  return ethers.utils.parseEther(eth);
};

export const unixToLocaleDate = (timeStamp) => {
  const dateObject = new Date(timeStamp);
  return `${
    dateObject.toLocaleString('en-US', { month: 'long' }) +
    ' ' +
    dateObject.toLocaleString('en-US', { day: 'numeric' }) +
    ',' +
    ' ' +
    dateObject.toLocaleString('en-US', { year: 'numeric' })
  }`;
};
