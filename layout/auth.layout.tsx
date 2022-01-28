import React, { ReactNode } from 'react'
import styled from 'styled-components'
import Image from 'next/image';

const Main = styled.main`
    width: 100vw;
    height: 100vh;
    background-image:linear-gradient(171.56deg, #161616 36.11%, rgba(0, 0, 0, 0.25) 58.92%), url('/images/bg2.png');
    background-repeat: no-repeat;
    background-size:cover;
    background-position: center center;
    display: flex;
    align-items: center;
    justify-content: space-between;   
    padding-right: 5%; 
    padding-left: 20%; 
    @media (max-width: 1300px) {
        padding-left: 15%; 
      } 

      @media (max-width: 1000px) {
        padding-left: 10%; 
      } 

      @media (max-width: 800px) {
        padding-left: 5%; 
      } 

      @media (max-width: 700px) {
        justify-content: center; 
        padding: 0; 
      } 
`
const Content = styled.div`
background: #FFFFFF;
border-radius: 15px;
width: 400.15px;
height: calc(100vh - 30%);
overflow-y: scroll;
@media (max-width: 700px) {
    width: 100%;
height: 100%;
border-radius: 0px;
  } 
`

const SImage = styled.img`
width: 25%;
@media (max-width: 700px) {
        display:none;
  } 
`
export const AuthLayout = ({
  children
}: {
  children: ReactNode
}) => {
  return (

    <Main>
      <SImage alt="logo" src="/images/logox2.png" />
      <Content>
        {children}
      </Content>
    </Main>

  )
}

