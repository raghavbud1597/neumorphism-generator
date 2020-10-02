import React, { useState } from 'react';
import styled from 'styled-components';
import Preview from './Preview';
import Configuration from './Configuration';

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

    return (
        <Flex backgroundColor={backgroundColor}>
            <Preview 
                backgroundColor={backgroundColor}
                size={size}
                borderRadius={borderRadius}
            />
            <Configuration
                backgroundColor={backgroundColor}
                setBackgroundColor={setBackgroundColor}
                size={size}
                setSize={setSize}
                borderRadius={borderRadius}
                setBorderRadius={setBorderRadius}
            />
        </Flex>
    )
}
