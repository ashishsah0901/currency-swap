import React, { useState, useRef } from "react";

const SellForm = ({ sellTokens, tokenBalance, ethBalance }) => {
  const [output, setOutput] = useState("0");
  const input = useRef(null);

  return (
    <form
      className="mb-3"
      onSubmit={(e) => {
        e.preventDefault();
        const etherAmount = input.current.value.toString();
        sellTokens(window.web3.utils.toWei(etherAmount, "Ether"));
      }}
    >
      <div>
        <label className="float-left">
          <b>Input</b>
        </label>
        <span className="float-right text-muted">
          Balance: {window.web3.utils.fromWei(tokenBalance, "Ether")}
        </span>
      </div>
      <div className="input-group mb-4">
        <input
          type="text"
          onChange={() => {
            const tokenAmount = input.current.value.toString();
            setOutput(tokenAmount / 100);
          }}
          ref={input}
          className="form-control form-control-lg"
          placeholder="0"
          required
        />
        <div className="input-group-append">
          <div className="input-group-text">
            <img
              src={
                "https://raw.githubusercontent.com/dappuniversity/eth_swap/master/src/token-logo.png"
              }
              height="32"
              alt=""
            />
            &nbsp; DApp
          </div>
        </div>
      </div>
      <div>
        <label className="float-left">
          <b>Output</b>
        </label>
        <span className="float-right text-muted">
          Balance: {window.web3.utils.fromWei(ethBalance, "Ether")}
        </span>
      </div>
      <div className="input-group mb-2">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="0"
          value={output}
          disabled
        />
        <div className="input-group-append">
          <div className="input-group-text">
            <img
              src={
                "https://raw.githubusercontent.com/dappuniversity/eth_swap/master/src/eth-logo.png"
              }
              height="32"
              alt=""
            />
            &nbsp;&nbsp;&nbsp; ETH
          </div>
        </div>
      </div>
      <div className="mb-5">
        <span className="float-left text-muted">Exchange Rate</span>
        <span className="float-right text-muted">100 DApp = 1 ETH</span>
      </div>
      <button type="submit" className="btn btn-primary btn-block btn-lg">
        SWAP!
      </button>
    </form>
  );
};

export default SellForm;
