import React, { ReactElement, ReactNode } from "react";

import {
  Button,
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";

import styled from "styled-components";

import CardStyle from "../../styles/components/card.module.scss";

interface CardProps {
  children: ReactNode
  rounded?: boolean
}

const StyledCard = styled(Card)`
  border-radius: ${(props:{rounded:boolean}) => props.rounded ? "20px": "0px" };
  height: 100%;
`;



export const TentCard = ({children, rounded}: CardProps) => {
  return (
    <StyledCard rounded={rounded} variant='outlined'>
     {children}
    </StyledCard>
  );
};


