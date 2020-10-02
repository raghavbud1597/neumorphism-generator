import React from 'react'
import styled from 'styled-components';

const PreviewBox = styled.div`
    height: 120px;
    width: 120px;
    border-radius: 100px;
    background: #3f464a;
    box-shadow: inset 28px 28px 56px #2b3033, 
                inset -28px -28px 56px #535c61;
`;

export default function Preview() {
    return (
        <PreviewBox/>
    )
}
