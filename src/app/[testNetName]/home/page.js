"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Contract, ethers } from "ethers";
import { useWalletProvider } from "../../../context/WalletContext.js";
import { useEthers } from "@usedapp/core";
import ERC20 from "@openzeppelin/contracts/build/contracts/ERC20.json";
import {
  OrderBookApi,
  OrderKind,
  OrderSigningUtils,
} from "@cowprotocol/cow-sdk";
import {
  Grid,
  Card,
  Stack,
  Chip,
  IconButton,
  CardContent,
  Typography,
  TextField,
  Box,
  Menu,
} from "@mui/material";
import Button from "@mui/material-next/Button";
import { useForm } from "react-hook-form";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PageHeader from "../../../components/PageHeader.js";
import AvatarSelector from "../../../components/AppModal";
import LoadingIcon from "../../../components/LoadingIcon";
import AlertDialog from "../../../components/AlertDialog";
import BigNumber from "bignumber.js";

const HomePage = () => {
  const {
    selectedSigner,
    setSelectedSigner,
    setIsLoading,
    isLoading,
    isLoadingSellerTokenBalance,
    sellToken,
    buyToken,
    setSellToken,
    setBuyToken,
    slippage,
    fees,
    setSlippage,
    setFees,
    buyTokenAmount,
    chainName,
    sellTokenAmount,
    setBuyTokenAmount,
    setSellTokenAmount,
    sellerTokenBalance,
    isLoadingBuyTokenBalance,
    buyTokenBalance,
  } = useWalletProvider();

  const { chainId, library, account } = useEthers();

  const { register } = useForm();
  const router = useRouter();

  const [isLoadingBuyAmount, setIsLoadingBuyAmount] = useState(false);
  const [sellAmountError, setSellAmountError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [quote, setQuote] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [textFieldValue, setTextFieldValue] = useState("0.50");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [receiveAmount, setReceiveAmount] = useState(0);

  const open = Boolean(anchorEl);

  const handleSlippage = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if (library && account) {
      const signer = library.getSigner(account);
      setSelectedSigner(signer);
    }
  }, [library, account]);

  useEffect(() => {
    setReceiveAmount(buyTokenAmount - buyTokenAmount * (slippage / 100));
  }, [buyTokenAmount, slippage]);

  useEffect(() => {
    if (!selectedSigner) {
      router.push("/");
    }
  }, [selectedSigner]);

  useEffect(() => {
    const fetchQuote = async () => {
      setIsLoadingBuyAmount(true);
      const orderBookApi = new OrderBookApi({
        chainId: chainId,
      });

      const quoteRequest = {
        sellToken: sellToken.address,
        buyToken: buyToken.address,
        from: account,
        receiver: account,
        sellAmountBeforeFee: (
          sellTokenAmount *
          10 ** sellToken.decimals
        ).toString(),
        kind: OrderKind.SELL,
      };

      // Get quote
      const { quote } = await orderBookApi.getQuote(quoteRequest);
      setQuote(quote);
      const buyAmount = quote.buyAmount / 10 ** buyToken.decimals;
      setBuyTokenAmount(buyAmount);
      setIsLoadingBuyAmount(false);
      const fees = quote.feeAmount / 10 ** sellToken.decimals;
      setFees(Number(fees));
    };

    if (
      sellTokenAmount !== "" &&
      sellTokenAmount !== 0 &&
      sellerTokenBalance > sellTokenAmount
    ) {
      fetchQuote();
    }
  }, [sellTokenAmount]);

  const handleClose = () => {
    setOpenDialog(false);
    router.push(`/${chainName.toLowerCase()}/home`);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setTextFieldValue(inputValue);
    setIsButtonDisabled(inputValue !== "");
    setSlippage(inputValue);
  };

  const handleSellTokenAmountChange = (event) => {
    const amount = event.target.value;
    if (amount !== "" && Number(amount) < Number(sellerTokenBalance)) {
      setSellTokenAmount(Number(amount));
      setSellAmountError("");
    } else {
      setSellAmountError("Amount is greater than Trader's Balance");
    }

    if (amount == "") {
      setSellTokenAmount("");
      setSellAmountError("Amount cannot be empty");
    }
  };

  const handleSwap = async () => {
    try {
      if (quote !== null) {
        setIsLoading(true);
        const erc20 = new Contract(
          sellToken.address,
          ERC20.abi,
          selectedSigner
        );

        const tx = erc20.connect(selectedSigner);

        const allowance = await tx.allowance(
          selectedSigner.getAddress(),
          "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110"
        );

        if (allowance) {
          console.log("Approval successful!");
        } else {
          const approveTx = await tx.approve(
            "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110",
            ethers.constants.MaxUint256
          );
        }

        const orderBookApi = new OrderBookApi({
          chainId: chainId,
        });

        const bigNum = new BigNumber(quote.buyAmount);
        const buyAmount = bigNum.times(1 - slippage / 100);

        const order = {
          sellToken: sellToken.address,
          buyToken: buyToken.address,
          sellAmount: quote.sellAmount,
          buyAmount: buyAmount.round(null, BigNumber.ROUND_DOWN).toFixed(),
          validTo: quote.validTo,
          appData:
            "0xf785fae7a7c5abc49f3cd6a61f6df1ff26433392b066ee9ff2240ff1eb7ab6e4",
          feeAmount: quote.feeAmount,
          kind: OrderKind.SELL,
          partiallyFillable: false,
          receiver: account,
        };

        // Sign order
        const orderSigningResult = await OrderSigningUtils.signOrder(
          order,
          chainId,
          selectedSigner
        );

        const requestBody = {
          ...order,
          signature: orderSigningResult.signature,
          signingScheme: orderSigningResult.signingScheme,
        };

        // Send order to the order-book
        const orderId = await orderBookApi.sendOrder(requestBody);
        setOrderId(orderId);

        setIsLoading(false);
        setOpenDialog(true);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const disableSwapButton =
    sellTokenAmount === "" ||
    sellTokenAmount === 0 ||
    sellerTokenBalance < sellTokenAmount;
  return (
    <div>
      <PageHeader pageTitle="CoW Swap" />
      <>
        <Grid
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "80vh",
            width: "100vw",
          }}
          container
        >
          <Card
            style={{
              width: "600px",
              height: "700px",
              margin: "auto",
              borderRadius: "20px",
              backgroundColor: "#f7e9bf",
            }}
          >
            <Grid
              item
              xs={12}
              style={{
                height: "10%",
                paddingLeft: "32px",
                paddingRight: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Stack direction="row" spacing={1}>
                <Chip
                  label="Swap"
                  size="large"
                  style={{
                    backgroundColor: "#faf6e8",
                    color: "black",
                  }}
                />
              </Stack>
              <IconButton
                color="black"
                size="large"
                onClick={handleSlippage}
                style={{
                  color: "black",
                }}
              >
                <SettingsOutlinedIcon />
              </IconButton>
              <Menu
                id="long-menu"
                MenuListProps={{
                  "aria-labelledby": "long-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
                PaperProps={{
                  style: {
                    padding: "20px",
                    height: 100,
                    width: 400,
                  },
                }}
              >
                <Grid
                  container
                  spacing={2}
                  style={{
                    padding: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    required
                    id="outlined-required"
                    label="Slippage (in %)"
                    defaultValue={textFieldValue}
                    onChange={handleInputChange}
                  />
                  <Button
                    variant="elevated"
                    size="large"
                    disabled={isButtonDisabled}
                    style={{
                      backgroundColor: "#705402",
                    }}
                    onClick={() => {
                      handleCloseMenu();
                      setTextFieldValue(0.5);
                      setSlippage(0.5);
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="white">
                      AUTO
                    </Typography>
                  </Button>
                </Grid>
              </Menu>
            </Grid>

            <Grid
              item
              xs={12}
              style={{
                height: "25%",
                paddingLeft: "32px",
                paddingRight: "32px",
              }}
            >
              <Card
                style={{
                  backgroundColor: "#faf6e8",
                  height: "100%",
                  borderRadius: "20px",
                  alignItems: "center",
                  elevation: "0px",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <CardContent
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    paddingRight: "32px",
                    paddingLeft: "32px",
                    boxSizing: "border-box",
                    height: "100%",
                  }}
                >
                  <Grid
                    item
                    container
                    xs={12}
                    style={{
                      height: "100%",
                    }}
                  >
                    <Grid
                      item
                      xs={6}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                      }}
                    >
                      <AvatarSelector buy={false} />
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        hiddenLabel
                        variant="standard"
                        placeholder="Enter Sell Token Amount"
                        {...register("sellTokenAmount", { required: true })}
                        name="sellTokenAmount"
                        label="Sell Token Amount"
                        type="number"
                        value={sellTokenAmount}
                        error={!!sellAmountError}
                        helperText={sellAmountError}
                        onChange={handleSellTokenAmountChange}
                        InputProps={{
                          style: {
                            color: "black",
                            backgroundColor: "#faf6e8",
                            fontSize: "24px",
                          },
                          inputProps: {
                            min: 0,
                          },
                        }}
                        InputLabelProps={{
                          style: {
                            color: "black",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    direction="column"
                    style={{
                      height: "30%",
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "start",
                    }}
                  >
                    {isLoadingSellerTokenBalance ? (
                      <LoadingIcon />
                    ) : (
                      <Typography
                        variant="h6"
                        style={{
                          color: "#705402",
                          fontWeight: "bold",
                        }}
                      >
                        Balance:{" "}
                        {parseFloat(Number(sellerTokenBalance).toFixed(2))}{" "}
                        {sellToken.ticker}
                      </Typography>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid
              item
              xs={12}
              style={{
                height: "6%",
                paddingTop: "2px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                style={{
                  backgroundColor: "#f7e9bf",
                  height: "100%",
                  width: "40px",
                  border: "3px solid #8e6a00",
                  borderRadius: "12px",
                }}
              >
                <IconButton
                  size="large"
                  onClick={() => {
                    const buyT = sellToken;
                    const sellT = buyToken;
                    setSellToken(sellT);
                    setBuyToken(buyT);
                  }}
                  style={{
                    color: "black",
                    backgroundColor: "#f7e9bf",
                    height: "40px",
                    width: "40px",
                  }}
                >
                  <SwapVertIcon />
                </IconButton>
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              style={{
                height: "25%",
                paddingLeft: "32px",
                paddingRight: "32px",
                paddingTop: "2px",
              }}
            >
              <Card
                style={{
                  backgroundColor: "#faf6e8",
                  height: "100%",
                  borderRadius: "20px",
                  alignItems: "center",
                  elevation: 0,
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <CardContent
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    paddingRight: "32px",
                    paddingLeft: "32px",
                    boxSizing: "border-box",
                    height: "100%",
                  }}
                >
                  <Grid
                    item
                    container
                    xs={12}
                    style={{
                      height: "100%",
                    }}
                  >
                    <Grid
                      item
                      xs={6}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                      }}
                    >
                      <AvatarSelector buy={true} />
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      {isLoadingBuyAmount ? (
                        <LoadingIcon />
                      ) : (
                        <TextField
                          id="filled-read-only-input"
                          label="Buy Token Amount"
                          value={
                            sellTokenAmount === 0 || sellTokenAmount === ""
                              ? 0
                              : buyTokenAmount
                          }
                          InputProps={{
                            readOnly: true,
                            style: {
                              color: "black",
                              backgroundColor: "#faf6e8",
                              fontSize: "24px",
                            },
                            inputProps: {
                              min: 0,
                            },
                          }}
                          InputLabelProps={{
                            style: {
                              color: "black",
                            },
                          }}
                          variant="filled"
                        />
                      )}
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    direction="column"
                    style={{
                      height: "30%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "start",
                    }}
                  >
                    {isLoadingBuyTokenBalance ? (
                      <LoadingIcon />
                    ) : (
                      <Typography
                        variant="h6"
                        style={{
                          color: "#705402",
                          fontWeight: "bold",
                        }}
                      >
                        Balance:{" "}
                        {parseFloat(Number(buyTokenBalance).toFixed(2))}{" "}
                        {buyToken.ticker}
                      </Typography>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid
              item
              xs={12}
              style={{
                height: "17%",
                paddingTop: "16px",
                paddingLeft: "40px",
                paddingRight: "40px",
              }}
            >
              <Grid
                item
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography color="black" variant="h6">
                  Fees:
                </Typography>
                <Typography
                  color="black"
                  variant="h6"
                  style={{ fontWeight: "bold" }}
                >
                  {fees + ` ${sellToken.ticker}`}
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography color="black" variant="h6">
                  Slippage Tolerance:
                </Typography>
                <Typography
                  color="black"
                  variant="h6"
                  style={{ fontWeight: "bold" }}
                >
                  {slippage + " %"}
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography color="black" variant="h6">
                  Minimum Received:
                </Typography>

                <Typography
                  color="black"
                  variant="h6"
                  style={{ fontWeight: "bold" }}
                >
                  {receiveAmount + ` ${buyToken.ticker}`}
                </Typography>
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              style={{
                height: "17%",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isLoading ? (
                <LoadingIcon />
              ) : (
                <Button
                  size="large"
                  onClick={handleSwap}
                  disabled={disableSwapButton}
                  style={{
                    backgroundColor: "#705402",
                    width: "100%",
                    color: "white",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "40px",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" color="white">
                    SWAP
                  </Typography>
                </Button>
              )}
            </Grid>
          </Card>
        </Grid>
        <AlertDialog
          orderId={orderId}
          alert={false}
          open={openDialog}
          onClose={handleClose}
          chainName={chainName.toLowerCase()}
        />
      </>
    </div>
  );
};

export default HomePage;
