import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Token from "../abis/Token.json";
import EthSwap from "../abis/EthSwap.json";
import Navbar from "./Navbar";
import Main from "./Main";

const App = () => {
  const [account, setAccount] = useState("");
  const [token, setToken] = useState({});
  const [ethSwap, setEthSwap] = useState({});
  const [ethBalance, setEthBalance] = useState("0");
  const [tokenBalance, setTokenBalance] = useState("0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      await loadWeb3();
      await loadBlockchainData();
    }
    init();
  }, []);

  async function loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    const ethBalance = await web3.eth.getBalance(accounts[0]);
    setEthBalance(ethBalance);
    const networkId = await web3.eth.net.getId();
    const tokenData = Token.networks[networkId];
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address);
      setToken(token);
      let tokenBalance = await token.methods.balanceOf(accounts[0]).call();
      setTokenBalance(tokenBalance.toString());
    } else {
      window.alert("Token contract not deployed to detected network.");
    }
    const ethSwapData = EthSwap.networks[networkId];
    if (ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);
      setEthSwap(ethSwap);
    } else {
      window.alert("EthSwap contract not deployed to detected network.");
    }
    setLoading(false);
  }

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  const buyTokens = (etherAmount) => {
    setLoading(true);
    ethSwap.methods
      .buyTokens()
      .send({ value: etherAmount, from: account })
      .on("transactionHash", () => {
        setLoading(false);
      });
  };

  const sellTokens = (tokenAmount) => {
    setLoading(true);
    token.methods
      .approve(ethSwap.address, tokenAmount)
      .send({ from: account })
      .on("transactionHash", () => {
        ethSwap.methods
          .sellTokens(tokenAmount)
          .send({ from: account })
          .on("transactionHash", () => {
            setLoading(false);
          });
      });
  };

  return (
    <div>
      <Navbar account={account} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main
            role="main"
            className="col-lg-12 ml-auto mr-auto"
            style={{ maxWidth: "600px" }}
          >
            <div className="content mr-auto ml-auto">
              {loading ? (
                <p id="loader" className="text-center">
                  Loading...
                </p>
              ) : (
                <Main
                  ethBalance={ethBalance}
                  tokenBalance={tokenBalance}
                  buyTokens={buyTokens}
                  sellTokens={sellTokens}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
