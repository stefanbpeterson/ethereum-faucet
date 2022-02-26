import detectEthereumProvider from '@metamask/detect-provider'
import react from "react";
import "./App.css";
import React, { useState, useEffect } from "react";
var Web3 = require('web3');

function App() {
  const [web3Api, setweb3Api] = useState({
    provider: null,
    web3: null
  })

  const [account, setAccount] = useState(null)

  useEffect(() => {
    const loadProvider = async() => {
      const provider = await detectEthereumProvider()
      if(provider) {
        setweb3Api({
          provider,
          web3: new Web3(provider)
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
  }, [web3Api.web3])
  

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <div className='is-flex is-align-items-center'>
            <span className='mr-3'>Account:</span>
            <h1>{ account ? account : <button onClick={() => web3Api.provider.request({method: "eth_requestAccounts"})} className='button is-rounded is-small'>Connect wallet</button>}</h1>
          </div>
          <div className="balance-view is-size-2 my-4">
            Current Balance: <strong>10</strong>
          </div>
          <button className="button is-link is-rounded mr-2">Donate</button>
          <button className="button is-primary is-rounded">Withdraw</button>
        </div>
      </div>
    </>
  );
}

export default App;
