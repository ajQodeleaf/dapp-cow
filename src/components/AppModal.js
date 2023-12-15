import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Modal from "@mui/material/Modal";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import PersonIcon from "@mui/icons-material/Person";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ListItemButton from "@mui/material/ListItemButton";
import { useWalletProvider } from "../context/WalletContext";
import { goerliTokensList } from "../TokenList";
import { Typography } from "@mui/material";

const AvatarSelector = ({ buy }) => {
  const { setBuyToken, buyToken, sellToken, setSellToken } =
    useWalletProvider();
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (buy) {
      setSelectedItem(buyToken);
    } else {
      setSelectedItem(sellToken);
    }
  }, [goerliTokensList, buyToken, sellToken]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleItemClick = (item) => {
    if (buy) {
      setSelectedItem(item);
      setBuyToken(item);
    } else {
      setSelectedItem(item);
      setSellToken(item);
    }

    handleClose();
  };

  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const contentStyle = {
    width: "100%",
    maxWidth: 360,
    height: "60%",
    bgcolor: "background.paper",
    p: 4,
    overflowY: "auto",
  };

  return (
    <>
      <Button
        style={{ color: "#705402" }}
        startIcon={
          selectedItem ? (
            <Avatar alt="Selected" src={selectedItem.img} />
          ) : (
            <PersonIcon />
          )
        }
        endIcon={<ArrowDropDownIcon />}
        onClick={handleOpen}
      >
        <Typography variant="h6">
          {selectedItem ? selectedItem.name : "Select"}
        </Typography>
      </Button>

      <Modal open={open} onClose={handleClose} style={modalStyle}>
        <Fade in={open}>
          <Box sx={contentStyle}>
            <List>
              {goerliTokensList.map((item) => (
                <ListItemButton
                  key={item.name}
                  onClick={() => handleItemClick(item)}
                >
                  <ListItemAvatar>
                    <Avatar alt={item.name} src={item.img} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`Symbol: ${item.ticker}`}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default AvatarSelector;
