import { CircularProgress, circularProgressClasses, CircularProgressProps, LinearProgress, linearProgressClasses, LinearProgressProps, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react'
import styled2 from "styled-components";
import { styled } from '@mui/material/styles';
import { FacilityType } from '../../lib';
import { CardFactoryType } from '../../services';



const Container = styled2.div`
position: relative;
width: 100%;
color: white;
`

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: 'gray',
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: 'white',
    },
  }));

function LinearProgressWithLabel(props: CircularProgressProps & { value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
            <BorderLinearProgress variant="determinate" value={props.value} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="white">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

export const AtmCard = (props:CardFactoryType) => {

    let imgName: string
    if(props.percentageLandSold == 100){
        imgName = 'image (2).png'
    }else if(props.percentageLandSold >= 50 && props.percentageLandSold < 100){
        imgName = 'image (1).png'
    }else{
        imgName = 'image.png'
    }
    return (
        <Container style={{ backgroundImage: `url(/images/cards/${imgName})`, backgroundPosition: 'center', backgroundSize: 'cover' }} className={`bg-no-repeat px-3 py-8 mb-4 rounded-2xl`}>
            {/* <img src={`/images/cards/${imgName}`}alt="Snow" style={{ width: "100%", height: "100%" }} /> */}
           
            <p>{`${props.estateLocation.city} - ${props.estateLocation.state}`}</p>
           
            <div style={{
                
                display: 'flex',
                alignItems: 'center',

            }} >
                <h1 style={{ marginRight: '10px' }}> {`${props.totalLandSize} / ${props.landSizeSold}`}</h1>
                <p><i>Hecters</i></p>
            </div>
            <div style={{
                

            }} >
                {LinearProgressWithLabel({ value: props.percentageLandSold })}
            </div>
            
            <p>{`${props.landSizeSold} unit sold`}</p>
            

        </Container>
    )
}
