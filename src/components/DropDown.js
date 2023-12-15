import React from "react";
import { FormControl, Select, InputLabel, MenuItem } from "@mui/material";
import { useForm } from "react-hook-form";

function DropDown({ value, handleChange, name, object, label }) {
  const { register } = useForm();
  return (
    <FormControl required variant="standard">
      <InputLabel id="select-chain-required-label" style={{ color: "black" }}>
        {label}
      </InputLabel>
      <Select
        labelId={label + "-select-chain-required-label"}
        id={label + "-select-chain-required-label"}
        value={value}
        {...register(name, { required: true })}
        onChange={handleChange}
        renderValue={(selected) => (
          <div style={{ fontWeight: "bold" }}>{selected}</div>
        )}
        style={{
          width: "200px",
          height: "60px",
          color: "black",
        
        }}
        label={label}
      >
        <MenuItem value="" disabled>
          Select {label}
        </MenuItem>
        {object.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default DropDown;
