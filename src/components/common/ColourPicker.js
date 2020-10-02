import React, {useState} from 'react'
import { ChromePicker } from 'react-color';
import styled from 'styled-components'
import { Flex } from '../../styling/styled' 

const ColorBox = styled.div`
    border: 2px solid #00334e;
    border-radius: 4px;
    height: 25px;
    cursor: pointer;
    margin: 10px;
    width: 25px;
`
const Popover = styled.div`
    position: absolute;
    top: 27px;
    right: 20px;
    z-index: 2;
`

  const Cover = styled.div`
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
  `

export default ({
    backgroundColor,
    setBackgroundColor
}) => {
    const [isColorPickerVisible, setColorPickerVisibility] = useState(false);

    return (
        <Flex>
            <p>Pick a Colour :</p>
            <ColorBox onClick={() => setColorPickerVisibility(!isColorPickerVisible)}/>
            {
                isColorPickerVisible ? (
                    <Popover>
                        <Cover onClick={ () => setColorPickerVisibility(false) }/>
                        <ChromePicker
                        color={ backgroundColor }
                        onChangeComplete={ (color) =>{
                            setBackgroundColor(`${color.hex}`);
                        }}
                    />
                    </Popover>
                    
                ) : null
            }
        </Flex>
    )
}
