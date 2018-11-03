import web3 from './web3';

export const getTime = (blockNumber = 'latest') => web3.eth.getBlock(blockNumber).timestamp;

export const mineCurrentBlock = () => web3.currentProvider.send({
  jsonrpc: '2.0',
  method: 'evm_mine',
  params: [],
  id: 0
});

export const increaseTimeBy = (seconds, dontMine) => {
  if (seconds < 0) {
    throw new Error('Can\'t decrease time in testrpc');
  }

  if (seconds === 0) return;

  web3.currentProvider.send({
    jsonrpc: '2.0',
    method: 'evm_increaseTime',
    params: [seconds],
    id: 0
  });

  if (!dontMine) {
    mineCurrentBlock();
  }
};

export const setTime = (seconds, dontMine) => {
  const increaseBy = seconds - getTime();

  increaseTimeBy(increaseBy, dontMine);
};

export const makeSnapshot = () => web3.currentProvider.send({ jsonrpc: '2.0', method: 'evm_snapshot' }).result;

export const revertSnapshot = snapshotID => new Promise((resolve, reject) => {
  web3.currentProvider.sendAsync({ jsonrpc: '2.0', method: 'evm_revert', params: [snapshotID] }, (err) => {
    if (!err) {
      console.log('Revert Success');
      resolve(snapshotID);
    } else {
      reject(err);
    }
  });
});

export const ETHEREUM_NETWORKS = {
  MAIN: 'MAIN',
  MORDEN: 'MORDEN',
  ROPSTEN: 'ROPSTEN',
  RINKEBY: 'RINKEBY',
  KOVAN: 'KOVAN',
  UNKNOWN: 'UNKNOWN'
};

export const networkById = {
  1: ETHEREUM_NETWORKS.MAIN,
  2: ETHEREUM_NETWORKS.MORDEN,
  3: ETHEREUM_NETWORKS.ROPSTEN,
  4: ETHEREUM_NETWORKS.RINKEBY,
  42: ETHEREUM_NETWORKS.KOVAN
};

export const GAS_LIMIT = 4000000;
export const GAS_PRICE = 5e9;
