import { Stack, TextField, TextFieldProps, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { borderRadius } from "@mui/system";
import React from "react";

const useStyles = makeStyles({
  noBorder: {
    border: "none",
  },
});


export const TentTextField = (props:TextFieldProps) => {
  const classes = useStyles();

  const {label, ...rest} = props;
  return (
    <Stack>
      {props.label && <Typography color="text.secondary" mb={1} variant="body2">{props.label}</Typography>}
      <TextField
        {...rest}
        sx={{
          border: "none",
          backgroundColor: "action.hover",
          borderRadius: "5px"
        }}
        InputProps={{
          "aria-label": "naked",
          classes: { notchedOutline: classes.noBorder },
        }}
      />
    </Stack>
  );
};
