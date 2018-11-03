import Deposit from './deposit';
import {register, unregister} from './serviceWorker';
import web3 from './web3';
import { getTime,
  mineCurrentBlock,
  increaseTimeBy,
  setTime,
  makeSnapshot,
  revertSnapshot,
  ETHEREUM_NETWORKS,
  networkById,
  GAS_LIMIT,
  GAS_PRICE
} from './utils';

export { Deposit,
  register,
  unregister,
  web3,
  getTime,
  mineCurrentBlock,
  increaseTimeBy,
  setTime,
  makeSnapshot,
  revertSnapshot,
  ETHEREUM_NETWORKS,
  networkById,
  GAS_LIMIT,
  GAS_PRICE
};
