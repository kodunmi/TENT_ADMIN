import React from 'react'
import styled from 'styled-components'

const SpinImg = styled.img`
    animation: rotation 2s infinite linear;
    max-width: "20px";
    @keyframes rotation {
        from {
                transform: rotateY(0deg);
        }
        to {
                transform: rotateY(359deg);
        }
    }
`

export const TentSpinner = () => {
    return (
        <div style={{width: '100%', textAlign: 'center'}}>
            <SpinImg src="/images/logo-small.png" />
        </div>
        
    )
}
