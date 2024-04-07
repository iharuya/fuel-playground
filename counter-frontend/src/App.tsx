import { Provider, Wallet } from 'fuels';
import { FC, useEffect, useState } from 'react'
import { COUNTER_CONTRACT_ID, USER_ADDRESS } from './constants/fuel';
import { CounterAbi, CounterAbi__factory } from "./sway-api"
import { formatEther } from 'viem';

export const App: FC = () => {
  const [counterContract, setCounterContract] = useState<CounterAbi>();
  const [count, setCount] = useState<number>() // sync with the contract
  const [balance, setBalance] = useState<string>("0");

  useEffect(() => {
    const init = async () => {
      const provider = await Provider.create("https://beta-5.fuel.network/graphql");
      const myWallet = Wallet.fromAddress(USER_ADDRESS, provider);
      myWallet.getBalances().then((data) => {
        const rawBalance = data[0].amount
        const eth = formatEther(BigInt(rawBalance.toString()), "gwei")
        setBalance(eth);
      })
      const counterContract = CounterAbi__factory.connect(COUNTER_CONTRACT_ID, myWallet);
      setCounterContract(counterContract);
    }
    init();
  }, []);

  const updateCount = async () => {
    if (!counterContract) return;
    try {
      const { value } = await counterContract.functions
        .get()
        .txParams({
          gasPrice: 1,
          gasLimit: 100_000,
        })
        .get();
      setCount(value.toNumber());
    } catch (error) {
      console.error(error);
    }
  }

  const increment = async() => {
    if (!counterContract) return;
    try {
      await counterContract.functions
        .inc()
        .txParams({
          gasPrice: 1,
          gasLimit: 100_000,
        })
        .call();
      updateCount();
    } catch (error) {
      console.error(error);
    }
  }

  const decrement = async() => {
    if (!counterContract) return;
    try {
      await counterContract.functions
        .dec()
        .txParams({
          gasPrice: 1,
          gasLimit: 100_000,
        })
        .call();
      updateCount();
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <main className='container p-4 text-center'>
      <p className='text-2xl'>Balance: {balance} ETH</p>
      <div className='py-2'>
        <p className='text-2xl'>Count: {count}</p>
        <div className='flex space-x-2 justify-center'>
          <button
            onClick={decrement}
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              - Decrement
            </span>
          </button>

          <button
            onClick={updateCount}
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Update Count
            </span>
          </button>

          <button
            onClick={increment}
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              + Increment
            </span>
          </button>
        </div>
      </div>
    </main>
  )
}
