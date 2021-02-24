import React from 'react'
import styled from 'styled-components';
import Lightbulb from '../images/Lightbulb.svg'
import GlowingBulb from '../images/GlowingBulb.svg'

const PreviewBox = styled.div`
    background: ${(props) => props.backgroundColor};
    border-radius: ${(props) => `${props.borderRadius}px`};
    box-shadow: ${(props) => ` ${props.distance}px ${props.distance}px ${props.blur}px ${props.darkColor}, ${props.distance}px ${props.distance}px ${props.blur}px ${props.lightColor}`};
    height: ${(props) => `${props.size}px`};
    width: ${(props) => `${props.size}px`};
`;

const PreviewWrapper = styled.div`
    align-items: center;
    display: flex;
    height: 550px;
    justify-content: center;
    margin: 40px;
    width: 550px;
`;

export default  ({
    backgroundColor,
    borderRadius,
    size,
    distance,
    lightColor,
    darkColor,
    blur
}) => {
    return (
        <PreviewWrapper>
            <PreviewBox 
                backgroundColor={backgroundColor} 
                size={size}
                borderRadius={borderRadius}
                blur={blur}
                distance={distance}
                lightColor={lightColor.hex()}
                darkColor={darkColor.hex()}
            />
        </PreviewWrapper>
    )
}
