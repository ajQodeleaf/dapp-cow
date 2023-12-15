import React from "react";
import { Grid } from "@mui/material";

function SingleSection({ xs, color, padding, height, children }) {
  const sectionStyle = {
    backgroundColor: color,
    height: height,
    padding: "0px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  return (
    <Grid item xs={xs} style={sectionStyle}>
      {children}
    </Grid>
  );
}

export default SingleSection;
