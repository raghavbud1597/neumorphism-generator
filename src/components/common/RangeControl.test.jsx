import { useState } from 'react';
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RangeControl from './RangeControl.jsx';

function ControlledRange({ onChange, step = 1 }) {
  const [value, setValue] = useState(20);
  return (
    <RangeControl label="Distance" value={value} min={0} max={60} step={step} unit="px"
      onChange={(number) => { setValue(number); onChange(number); }} />
  );
}

describe('RangeControl', () => {
  it('renders labelled inputs with optional units and actions', () => {
    render(
      <RangeControl label="Size" value={20} min={0} max={100} step={1} unit="px"
        onChange={jest.fn()} actions={<button type="button">Use circle</button>} />,
    );
    expect(screen.getByRole('slider', { name: 'Size' })).toHaveValue('20');
    expect(screen.getByRole('spinbutton', { name: 'Size value' })).toHaveValue(20);
    expect(screen.getByText('px')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Use circle' })).toBeInTheDocument();
  });

  it('emits numeric slider values and synchronizes the number field', () => {
    const onChange = jest.fn();
    render(<ControlledRange onChange={onChange} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '42' } });
    expect(onChange).toHaveBeenCalledWith(42);
    expect(screen.getByRole('spinbutton')).toHaveValue(42);
  });

  it('commits numeric edits on blur', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<ControlledRange onChange={onChange} />);
    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '32');
    expect(onChange).not.toHaveBeenCalled();
    await user.tab();
    expect(onChange).toHaveBeenCalledWith(32);
    expect(screen.getByRole('slider')).toHaveValue('32');
  });

  it.each([['999', 60], ['-10', 0]])('clamps %s to %s on Enter', async (text, expected) => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<ControlledRange onChange={onChange} />);
    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, `${text}{Enter}`);
    expect(onChange).toHaveBeenCalledWith(expected);
    expect(input).toHaveValue(expected);
  });

  it('rounds fractional entries to the configured step', async () => {
    const user = userEvent.setup();
    render(<ControlledRange onChange={jest.fn()} step={0.5} />);
    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '12.26{Enter}');
    expect(input).toHaveValue(12.5);
  });

  it('restores empty drafts and cancels edits with Escape', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<ControlledRange onChange={onChange} />);
    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.keyboard('{Enter}');
    expect(input).toHaveValue(20);
    await user.clear(input);
    await user.type(input, '45{Escape}');
    expect(input).toHaveValue(20);
    await user.tab();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not update untouched fields and handles a fixed range without NaN', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<RangeControl label="Size" value={10} min={10} max={10} step={1} onChange={onChange} />);
    expect(screen.getByRole('slider')).toHaveStyle({ '--range-progress': '0%' });
    await user.click(screen.getByRole('spinbutton'));
    await user.tab();
    expect(onChange).not.toHaveBeenCalled();
  });
});
