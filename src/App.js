import react from "react";
import "./App.css";
import React, { useState, useEffect } from "react";
var Web3 = require('web3');

function App() {
  const [web3Api, setweb3Api] = useState({
    provider: null,
    web3: null
  })

  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadProvider = async() => {
      let provider = null;

      if(window.ethereum) {
        provider = window.ethereum;
        try {
          await provider.request({ method: "eth_requestAccounts" })
        } catch {
          console.error('Denied accounts access!')
        }
      } else if(window.web3) {
        provider = window.web3.currentProvider;
      } else if(!process.env.production) {
        provider = new Web3.providers.HttpProvider("http://localhost:7545");
      }

      setweb3Api({
        provider,
        web3: new Web3(provider)
      })  
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
          <span>Account:</span>
          <h1>{ account ? account : "Not connected."}</h1>
          <div className="balance-view is-size-2">
            Current Balance: <strong>10</strong>
          </div>
          <button className="btn mr-2">Donate</button>
          <button className="btn">Withdraw</button>
        </div>
      </div>
    </>
  );
}

export default App;
