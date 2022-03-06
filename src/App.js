import detectEthereumProvider from '@metamask/detect-provider'
import react from "react"
import "./App.css"
import React, { useState, useEffect } from "react"
import { loadContract } from "./utils/load-contract"
var Web3 = require('web3')

function App() {
  const [web3Api, setweb3Api] = useState({
    provider: null,
    web3: null,
    contract: null
  })
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(null)
  const [reload, setReload] = useState(false)

  const reloadHelper = () => setReload(!reload)

  const setAccountListener = (provider) => {
    provider.on("accountsChanged", () => window.location.reload())
    // provider._jsonRpcConnection.events.on("notification", (payload) => {
    //   const { method } = payload
    //   if (method === 'metamask_unlockStateChanged') {
    //     setAccount(null)
    //   }
    // })
  }

  useEffect(() => {
    const loadProvider = async() => {

      const provider = await detectEthereumProvider()
      const contract = await loadContract("Faucet", provider)

      if(provider) {
        setAccountListener(provider)
        setweb3Api({
          provider,
          web3: new Web3(provider),
          contract
        })
      } else {
          console.error('Please install Metamask')
      }
    }
    loadProvider()
  }, [])

  useEffect(() => {
    const getAccount = async() => {
      const accounts = await web3Api.web3.eth.getAccounts()
      setAccount(accounts[0])
    }

    web3Api.web3 && getAccount()
  }, [web3Api.web3, reload])

  useEffect(() => {
    const loadBalance = async() => {
      const { contract, web3 } = web3Api
      const balance = await web3.eth.getBalance(contract.address)
      setBalance(web3.utils.fromWei(balance, "ether"))
    }

    web3Api.contract && loadBalance()
  }, [web3Api, reload])

  const addFunds = async() => {
    const { contract, web3 } = web3Api

    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether")
    })

    reloadHelper()
  }

  const withdrawFunds = async() => {
    const { contract, web3 } = web3Api
    const withdrawAmount = web3.utils.toWei("1", "ether")

    await contract.withdrawFunds(withdrawAmount, {from: account})

    reloadHelper()
  }
  

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <div className='is-flex is-align-items-center'>
            <span className='mr-3'>Account:</span>
            <h1>{ account ? account : <button onClick={() => web3Api.provider.request({method: "eth_requestAccounts"})} className='button is-rounded is-small'>Connect wallet</button>}</h1>
          </div>
          <div className="balance-view is-size-2 my-4">
            Current Faucet Balance: <strong>{ balance ? `${balance} Ether` : 'Balance not loaded'}</strong>
          </div>
          <button disabled={!account} onClick={addFunds} className="button is-link is-rounded mr-2">Donate 1 Ether</button>
          <button disabled={!account} onClick={withdrawFunds} className="button is-primary is-rounded">Withdraw 1 Ether</button>
        </div>
      </div>
    </>
  );
}

export default App;
