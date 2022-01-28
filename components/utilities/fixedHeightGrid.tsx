import { Grid, useMediaQuery, useTheme } from '@mui/material'
import React, { ReactNode } from 'react'
import styled from 'styled-components'



export const FixedHeightGrid = (props) => {
    const theme = useTheme();
    const lg = useMediaQuery(theme.breakpoints.up('lg'));
    const FixedHeightGridStyled = styled(Grid)`
 height: ${lg ? props.height : "100"}%`
    return (
        <FixedHeightGridStyled {...props}>
            {props.children}
        </FixedHeightGridStyled>
    )
}
