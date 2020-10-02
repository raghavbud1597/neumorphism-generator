import React from 'react'
import styled from 'styled-components'
import ColourPicker from '../common/ColourPicker';
import { Flex } from '../../styling/styled'

const ConfigurationWrapper = styled.div`
    background: ${(props) => props.backgroundColor};
    border-radius: 20px;
    box-shadow: inset 18px 18px 56px #56958d, inset -18px -18px 56px #86e9dd;
    min-height: 450px;
    min-width: 400px;
    padding: 30px;
`;

export default ({
    backgroundColor,
    setBackgroundColor,
    size, 
    setSize,
    borderRadius,
    setBorderRadius
}) => {
    return (
        <ConfigurationWrapper backgroundColor={backgroundColor}>
            <div>
                <ColourPicker 
                    backgroundColor={backgroundColor}
                    setBackgroundColor={setBackgroundColor}
                />
            </div>
            <Flex>
                <div>Size: </div>
                <input 
                    type="range" 
                    min="50" 
                    max="500" 
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    />
            </Flex>
            <Flex>
                <div>Border Radius: </div>
                <input 
                    type="range" 
                    min="10" 
                    max="200" 
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(e.target.value)}
                    />
            </Flex>

        </ConfigurationWrapper>
    )
}
