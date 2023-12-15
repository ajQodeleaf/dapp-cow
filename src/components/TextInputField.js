import React from "react";
import { TextField } from "@mui/material";
import { useForm } from "react-hook-form";

const TextInputField = ({ name, label, onChange, error, helperText, type }) => {
  const { register } = useForm();
  return (
    <TextField
      name={name}
      label={label}
      {...register(name, { required: true })}
      onChange={onChange}
      type={type}
      error={!!error}
      helperText={helperText}
      style={{ marginBottom: "28px",width:"400px",height:"60px" }}
      InputProps={{
        style: {
          color: "white",
          backgroundColor: "#07162d",
          fontSize: "24px",
        },
      }}
    />
  );
};

export default TextInputField;
