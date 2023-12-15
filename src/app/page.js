"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useEthers, Goerli, Mainnet } from "@usedapp/core";
import Button from "@mui/material-next/Button";
import { useWalletProvider } from "../../src/context/WalletContext";
import { Typography } from "@mui/material";
const ConnectWallet = () => {
  const { activateBrowserWallet, account, chainId } = useEthers();
  const { chainName, setChainName } = useWalletProvider();
  const router = useRouter();

  useEffect(() => {
    if (account) {
      switch (chainId) {
        case Goerli.chainId:
          setChainName("Goerli");
          break;
        case Mainnet.chainId:
          setChainName("Mainnet");
          break;
        default:
          break;
      }
      if (chainName !== "") {
        router.push(`/${chainName.toLowerCase()}/home`);
      }
    }
  }, [chainId, chainName]);

  const handleConnectWallet = () => {
    activateBrowserWallet();
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        <Button
          variant="elevated"
          onClick={handleConnectWallet}
          style={{ backgroundColor: "#705402", color: "white" }}
        >
          <Typography variant="h6" fontWeight="bold" color="white">
            Connect Wallet
          </Typography>
        </Button>
      </div>
    </div>
  );
};

export default ConnectWallet;
