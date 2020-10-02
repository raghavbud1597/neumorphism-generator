import React from 'react'
import styled from 'styled-components';

const PreviewBox = styled.div`
    background: ${(props) => props.backgroundColor};
    border-radius: ${(props) => `${props.borderRadius}px`};
    box-shadow: inset 18px 18px 56px #56958d, inset -18px -18px 56px #86e9dd;
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
}) => {
    return (
        <PreviewWrapper>
            <PreviewBox 
                backgroundColor={backgroundColor} 
                size={size}
                borderRadius={borderRadius}
            />
        </PreviewWrapper>
    )
}
