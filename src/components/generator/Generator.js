import React, { useState } from 'react';
import styled from 'styled-components';
import Preview from './Preview';
import Configuration from './Configuration';
import Color from 'color'

const Flex = styled.div`
    align-items: center;
    background: ${(props) => props.backgroundColor};
    display: flex;
    height: 100vh;
    justify-content: center;
`;


export default function Generator() {
    const [backgroundColor, setBackgroundColor] = useState('#6ebfb5');
    const [size, setSize] = useState('300');
    const [borderRadius, setBorderRadius] = useState('63');
    const [distance, setDistance] = useState('20');
    const [blur, setBlur] = useState('40');
    const [intensity, setIntensity] = useState(0.15);
    const [lightColor, setLightColour] = useState(Color('#6ebfb5').lighten(0.15));
    const [darkColor, setDarkColor] = useState(Color('#6ebfb5').darken(0.15));

    return (
        <Flex backgroundColor={backgroundColor}>
            <Preview 
                backgroundColor={backgroundColor}
                size={size}
                borderRadius={borderRadius}
                distance={distance}
                lightColor={lightColor}
                darkColor={darkColor}
                blur={blur}
            />
            <Configuration
                backgroundColor={backgroundColor}
                setBackgroundColor={setBackgroundColor}
                size={size}
                setSize={setSize}
                borderRadius={borderRadius}
                setBorderRadius={setBorderRadius}
                distance={distance}
                setDistance={setDistance}
                lightColor={lightColor}
                setLightColour={setLightColour}
                darkColor={darkColor}
                setDarkColor={setDarkColor}
                intensity={intensity}
                setIntensity={setIntensity}
                blur={blur}
                setBlur={setBlur}
            />
        </Flex>
    )
}
