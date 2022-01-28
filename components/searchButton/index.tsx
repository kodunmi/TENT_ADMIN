import { Button, ButtonProps } from '@mui/material'
import { purple, grey } from '@mui/material/colors';
import { styled } from '@mui/system'
import React, { MouseEvent, ReactElement } from 'react'
import Filter from 'remixicon-react/Filter2LineIcon'

const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    border: '0.5px solid #8692A6',
    borderRadius:'10px',
    justifyContent: 'start',
    paddingLeft:'20px'
  }));

interface SearchButtonProps{
    text: string,
    onclick: (event: MouseEvent<HTMLButtonElement>) => void;
}
export const SearchButton = ({text,onclick}:SearchButtonProps) => {
    return (
        <StyledButton onClick={onclick} fullWidth startIcon={<Filter />}>
            {text}
        </StyledButton>
    )
}
