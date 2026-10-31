import { useId } from 'react';
import styled from 'styled-components';
import { Flex } from '../../styling/styled.js';

const ColourInput = styled.input`
  border: 2px solid #00334e;
  border-radius: 4px;
  cursor: pointer;
  height: 32px;
  padding: 0;
  width: 40px;
`;

export default function ColourPicker({ value, onChange }) {
  const id = useId();

  return (
    <Flex>
      <label htmlFor={id}>Pick a Colour</label>
      <ColourInput
        id={id}
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <output htmlFor={id}>{value}</output>
    </Flex>
  );
}
