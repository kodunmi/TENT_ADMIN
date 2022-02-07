import { Typography } from '@mui/material'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: 100%;
    margin-top: 10%;
`

export const ErrorData = ({error}:{error:FetchBaseQueryError | SerializedError }) => {
    let e = error as FetchBaseQueryError
    let data = e.data as {error:{message:string}}
    console.log(error);
    return (
        <Container>
            <img src="/images/undraw_cancel_u-1-it.svg" alt="" height="50%" width="50%" />
            <Typography mt={8} variant="h4">
                {/* {data ? `${data.error.message}` : 'Something went wrong'} */}
                Something went wrong
              {/* {data.error.message ?? 'Error fetching data'} */}
            </Typography>
        </Container>
    )
}
