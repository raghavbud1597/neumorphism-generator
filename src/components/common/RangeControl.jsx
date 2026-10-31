import { useId } from 'react';
import { Flex } from '../../styling/styled.js';

export default function RangeControl({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  onChange,
}) {
  const id = useId();

  return (
    <Flex>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.valueAsNumber)}
      />
      <output htmlFor={id}>
        {value}
        {unit}
      </output>
    </Flex>
  );
}
