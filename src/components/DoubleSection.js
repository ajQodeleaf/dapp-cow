import React from "react";
import { Grid, Typography } from "@mui/material";
import { useWalletProvider } from "@/context/WalletContext";
import LoadingIcon from "./LoadingIcon";

const DoubleSection = ({
  xs,
  color,
  height,
  fieldTitle1,
  fieldTitle2,
  fieldValue1,
  fieldValue2,
}) => {
  const sectionStyle = {
    backgroundColor: color,
    height: height,
    paddingLeft: "20px",
  };

  const { isLoadingSellerTokenBalance } = useWalletProvider();

  return (
    <Grid item xs={xs} style={sectionStyle}>
      <Grid
        item
        xs={12}
        style={{ height: "50%", paddingTop: "8%" }}
      >
        <Typography
          variant="h6"
          style={{
            display: "flex",
            alignItems: "center",
          }}
          color="black"
        >
          {fieldTitle1} {fieldValue1}
        </Typography>
      </Grid>

      <Grid
        item
        xs={12}
        style={{ height: "50%", paddingTop: "0%" }}
      >
        {isLoadingSellerTokenBalance ? (
          <LoadingIcon />
        ) : (
          <Typography
            variant="h6"
            style={{ justifyContent: "center", alignItems: "center" }}
            color="black"
          >
            {fieldTitle2} {fieldValue2}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default DoubleSection;
