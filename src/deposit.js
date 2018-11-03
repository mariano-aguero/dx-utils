import web3 from './web3';

const abiDutchX = require('./abi/abiDutchX');
const abiWeth = require('./abi/abiWeth');

export default class Deposit {

  constructor(addressDutchX, addressWeth) {
    this.addressDutchX = addressDutchX;
    this.addressWeth = addressWeth;
    this.dutchx = new web3.eth.Contract(abiDutchX, addressDutchX);
    this.weth = new web3.eth.Contract(abiWeth, addressWeth);
  }

  async auctioneer() {
    return await this.dutchx.methods.auctioneer().call();
  }

  async deposit(amount) {
    const [ account ] = await web3.eth.getAccounts();

    // See: https://github.com/gnosis/dx-contracts/blob/master/contracts/DutchExchange.sol#L351
    const txReceipt = await this.dutchx.methods
      .deposit(this.addressWeth, web3.utils.toWei(amount))
      .send({
        from: account
      });

    const { transactionHash } = txReceipt;

    return transactionHash;
  }

  async wrapEther(amount) {
    const [ account ] = await web3.eth.getAccounts();

    const txReceipt = await this.weth.methods
      .deposit()
      .send({
        from: account,
        value: web3.utils.toWei(amount)
      });

    const { transactionHash } = txReceipt;

    return transactionHash;
  }

  async setAllowance(amount) {
    const [ account ] = await web3.eth.getAccounts();

    const txReceipt = await this.weth.methods
      .approve(this.addressDutchX, web3.utils.toWei(amount))
      .send({
        from: account
      });

    const { transactionHash } = txReceipt;

    return transactionHash;
  }

  async getBalances() {
    const [ account ] = await web3.eth.getAccounts();

    const etherBalancePromise = web3.eth
      .getBalance(account)
      .then(web3.utils.fromWei);

    const wethBalancePromise = this.weth.methods
      .balanceOf(account)
      .call()
      .then(web3.utils.fromWei);

    const wethAllowancePromise = this.weth.methods
      .allowance(account, this.addressDutchX)
      .call()
      .then(web3.utils.fromWei);

    // See https://github.com/gnosis/dx-contracts/blob/master/contracts/DutchExchange.sol#L74
    const dutchxBalancePromise = this.dutchx.methods
      .balances(this.addressWeth, account)
      .call()
      .then(web3.utils.fromWei);

    // Wait for all promises
    const [
      etherBalance,
      wethBalance,
      wethAllowance,
      dutchxBalance
    ] = await Promise.all([
      etherBalancePromise,
      wethBalancePromise,
      wethAllowancePromise,
      dutchxBalancePromise
    ]);

    return {
      etherBalance: etherBalance,
      wethBalance: wethBalance,
      wethAllowance: wethAllowance,
      dutchxBalance: dutchxBalance
    };
  }

}

