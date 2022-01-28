import { Card, CardContent } from '@mui/material';
import React, { ReactNode } from 'react'
import styled from "styled-components";

const StyledCardData = styled(Card)`
    ${props => props.color && `border-left: 20px solid ${props.color};`}
  
`

interface CardProps {
    children: ReactNode
    color?: string
  }
  

export const DataCountCard = ({children,color} : CardProps) => {
    return (
      <StyledCardData color={color} variant='outlined'>
        <CardContent>
          {children}
        </CardContent>
      </StyledCardData>
    )
  }