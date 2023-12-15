import React, { useState, useEffect } from "react";
import { Grid, Typography, Avatar, SvgIcon } from "@mui/material";
import Button from "@mui/material-next/Button";
import { useRouter, useParams } from "next/navigation";
import { Contract, ethers } from "ethers";
import { formatEther } from "@ethersproject/units";
import {
  useEthers,
  shortenAddress,
  Goerli,
  Mainnet,
  useEtherBalance,
} from "@usedapp/core";
import { useWalletProvider } from "../context/WalletContext";
import ERC20 from "@openzeppelin/contracts/build/contracts/ERC20.json";
import DropDown from "./DropDown";

function PageHeader({ pageTitle }) {
  const { account, deactivate, switchNetwork, chainId } = useEthers();
  const {
    selectedSigner,
    sellToken,
    buyToken,
    setChainName,
    setIsLoadingSellerTokenBalance,
    setIsLoadingBuyTokenBalance,
    setBuyTokenBalance,
    sellerTokenBalance,
    setSellerTokenBalance,
  } = useWalletProvider();

  const paramChainName = useParams();

  const router = useRouter();

  const [selectedChain, setSelectedChain] = useState("");

  const balance = useEtherBalance(account, { chainId: chainId });

  useEffect(() => {
    switch (paramChainName.testNetName) {
      case "goerli":
        setSelectedChain("Goerli");
        break;
      case "mainnet":
        setSelectedChain("Mainnet");
        break;
      default:
        break;
    }
  }, [paramChainName]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setIsLoadingSellerTokenBalance(true);
        const erc20 = new Contract(
          sellToken.address,
          ERC20.abi,
          selectedSigner
        );
        const tx = erc20.connect(selectedSigner);
        const newBalance = await erc20.balanceOf(account);
        setSellerTokenBalance(
          ethers.utils.formatUnits(newBalance, sellToken.decimals)
        );
        setIsLoadingSellerTokenBalance(false);
      } catch (error) {
        setSellerTokenBalance(0);
        setIsLoadingSellerTokenBalance(false);
      }
    };
    if (account) {
      fetchBalance();
    }
  }, [sellToken, buyToken, selectedSigner, account]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setIsLoadingBuyTokenBalance(true);
        const erc20 = new Contract(buyToken.address, ERC20.abi, selectedSigner);
        const tx = erc20.connect(selectedSigner);
        const newBalance = await erc20.balanceOf(account);
        setBuyTokenBalance(
          ethers.utils.formatUnits(newBalance, buyToken.decimals)
        );
        setIsLoadingBuyTokenBalance(false);
      } catch (error) {
        setBuyTokenBalance(0);
        setIsLoadingBuyTokenBalance(false);
      }
    };
    if (account) {
      fetchBalance();
    }
  }, [sellToken, buyToken, selectedSigner, account]);

  const handleChainSelection = async (event) => {
    const chain = selectedChain;
    try {
      const selectedChain = event.target.value;
      console.log("Selected Chain = ", selectedChain);

      setSelectedChain(selectedChain);

      switch (selectedChain) {
        case "Goerli":
          await switchNetwork(Goerli.chainId);
          break;
        case "Mainnet":
          await switchNetwork(Mainnet.chainId);
          break;
        default:
          break;
      }

      if (selectedChain !== paramChainName.testNetName) {
        router.push(`/${selectedChain.toLowerCase()}/home`);
        setChainName(selectedChain.toLowerCase());
      }
    } catch (e) {
      setSelectedChain(chain);
      console.error(e);
    }
  };

  return (
    <Grid
      container
      style={{
        height: "16vh",
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography
        variant="h1"
        color="#896808"
        style={{ fontWeight: "bold", fontFamily: "CustomFont" }}
      >
        {pageTitle}
      </Typography>
      <Grid
        item
        xs={6}
        style={{
          height: "20vh",
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <DropDown
          value={selectedChain}
          handleChange={handleChainSelection}
          name="selectChain"
          object={["Goerli", "Mainnet"]}
          label="Chain"
        />

        <Button
          variant="outlined"
          style={{
            height: "60px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "0px",
            padding: "0px",
            border: "3px solid black",
          }}
        >
          <Button
            style={{
              paddingRight: "0px",
              margin: "0px",
              paddingLeft: "20px",
              borderRadius: "0px",
            }}
          >
            <Typography variant="h6" mr={2} fontWeight="bold" color="black">
              {balance && formatEther(balance)}
            </Typography>
          </Button>

          <Button
            variant="outlined"
            size="medium"
            color="primary"
            style={{
              height: "60px",
              border: "2px solid black",
              margin: "0px",
              paddingRight: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              color="black"
              paddingRight="16px"
            >
              {account && shortenAddress(account)}
            </Typography>
            <Avatar alt="metamask" src="/metamask.svg" />
          </Button>
        </Button>

        <Button
          variant="elevated"
          marginLeft="20px"
          style={{ backgroundColor: "red" }}
          onClick={() => {
            deactivate();
            router.push("/");
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="white">
            DISCONNECT
          </Typography>
        </Button>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
