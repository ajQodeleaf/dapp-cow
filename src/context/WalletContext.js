"use client";
import React, { createContext, useContext, useState } from "react";
import { goerliTokensList } from "../TokenList";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [contractAddress, setContractAddress] = useState("");
  const [transactionHash, setTransactionHash] = useState(null);
  const [contract, setContract] = useState(null);
  const [selectedSigner, setSelectedSigner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSellerTokenBalance, setIsLoadingSellerTokenBalance] =
    useState(false);
  const [isLoadingBuyTokenBalance, setIsLoadingBuyTokenBalance] =
    useState(false);
  const [buyTokenBalance, setBuyTokenBalance] = useState(0);
  const [timeout, setTimeout] = useState(false);
  const [sellToken, setSellToken] = useState(goerliTokensList[0]);
  const [buyToken, setBuyToken] = useState(goerliTokensList[1]);
  const [buyTokenAmount, setBuyTokenAmount] = useState(0);
  const [sellTokenAmount, setSellTokenAmount] = useState(0);
  const [sellerTokenBalance, setSellerTokenBalance] = useState(0);
  const [chainName, setChainName] = useState("");
  const [slippage, setSlippage] = useState("0.50");
  const [fees, setFees] = useState(0);

  return (
    <WalletContext.Provider
      value={{
        contractAddress,
        contract,
        selectedSigner,
        isLoading,
        transactionHash,
        timeout,
        sellToken,
        buyToken,
        buyTokenAmount,
        sellTokenAmount,
        sellerTokenBalance,
        isLoadingSellerTokenBalance,
        buyTokenBalance,
        isLoadingBuyTokenBalance,
        chainName,
        fees,
        slippage,
        setSlippage,
        setFees,
        setChainName,
        setIsLoadingBuyTokenBalance,
        setBuyTokenBalance,
        setIsLoadingSellerTokenBalance,
        setSellerTokenBalance,
        setSellToken,
        setBuyToken,
        setBuyTokenAmount,
        setSellTokenAmount,
        setTimeout,
        setSelectedSigner,
        setContractAddress,
        setIsLoading,
        setTransactionHash,
        setContract,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletProvider = () => useContext(WalletContext);
