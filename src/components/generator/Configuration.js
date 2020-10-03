import React from 'react'
import styled from 'styled-components'
import ColourPicker from '../common/ColourPicker';
import { Flex } from '../../styling/styled'
import Color from 'color'

const ConfigurationWrapper = styled.div`
    background: ${(props) => props.backgroundColor};
    border-radius: 20px;
    box-shadow: ${(props) => ` ${props.distance}px ${props.distance}px 56px ${props.darkColor}, -${props.distance}px -${props.distance}px 56px ${props.lightColor}`};
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
    setBorderRadius,
    distance,
    setDistance,
    lightColor,
    setLightColour,
    darkColor,
    setDarkColor,
    intensity,
    setIntensity,
    blur,
    setBlur
}) => {
    return (
        <ConfigurationWrapper 
            backgroundColor={backgroundColor} 
            distance={distance}
            lightColor={lightColor.hex()}
            darkColor={darkColor.hex()}
        >
            <div>
                <ColourPicker 
                    backgroundColor={backgroundColor}
                    setBackgroundColor={setBackgroundColor}
                    setLightColour={setLightColour}
                    setDarkColor={setDarkColor}
                    intensity={intensity}
                />
            </div>

            <Flex>
                <div>Size: </div>
                <input 
                    type="range" 
                    min="50" 
                    max="500" 
                    step="10"
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
                    step="5"
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(e.target.value)}
                    />
            </Flex>

            <Flex>
                <div>Distance: </div>
                <input 
                    type="range" 
                    min="5" 
                    max="60" 
                    step="5"
                    value={distance}
                    onChange={(e) => {
                        setDistance(e.target.value);
                        setBlur(e.target.value * 2);
                    }}
                    />
            </Flex>

            <Flex>
                <div>Intensity: </div>
                <input 
                    type="range" 
                    min="0.05" 
                    max="0.6" 
                    step="0.01"
                    value={intensity}
                    onChange={(e) => {
                        setIntensity(e.target.value);
                        setLightColour(Color(backgroundColor).lighten(e.target.value));
                        setDarkColor(Color(backgroundColor).darken(e.target.value));
                    }}
                    />
            </Flex>

            <Flex>
                <div>Blur: </div>
                <input 
                    type="range" 
                    min="0" 
                    max="120" 
                    step="10"
                    value={blur}
                    onChange={(e) => {
                        setBlur(e.target.value);
                    }}
                    />
            </Flex>

        </ConfigurationWrapper>
    )
}
