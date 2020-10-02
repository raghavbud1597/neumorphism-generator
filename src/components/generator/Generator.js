import React from 'react'
import styled from 'styled-components';
import Preview from './preview';
import Generator from './Generator';

const Flex = styled.div`
  display: flex;
  align-itmes: center;
  justify-elements: center;
`;


export default function Generator() {
    return (
        <div>
            <Flex>
                <Preview/>
                <Generator/>
            </Flex>
        </div>
    )
}
