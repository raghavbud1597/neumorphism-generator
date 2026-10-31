import { useState } from 'react';
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ColourPicker from './ColourPicker.jsx';

function ControlledPicker({ onChange }) {
  const [value, setValue] = useState('#e0e0e0');
  return <ColourPicker value={value} onChange={(colour) => { setValue(colour); onChange(colour); }} />;
}

describe('ColourPicker', () => {
  it('labels both inputs and accepts externally controlled colours', () => {
    const { rerender } = render(<ColourPicker value="#e0e0e0" onChange={jest.fn()} />);
    expect(screen.getByLabelText('Base colour')).toHaveValue('#e0e0e0');
    expect(screen.getByRole('textbox', { name: 'Hex colour' })).toHaveValue('#e0e0e0');
    rerender(<ColourPicker value="#336699" onChange={jest.fn()} />);
    expect(screen.getByRole('textbox', { name: 'Hex colour' })).toHaveValue('#336699');
  });

  it.each(['#AbC', 'AABBCC'])('normalizes %s on Enter and syncs the native picker', async (text) => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<ControlledPicker onChange={onChange} />);
    const hex = screen.getByRole('textbox', { name: 'Hex colour' });
    await user.clear(hex);
    await user.type(hex, `${text}{Enter}`);
    expect(onChange).toHaveBeenLastCalledWith('#aabbcc');
    expect(hex).toHaveValue('#aabbcc');
    expect(screen.getByLabelText('Base colour')).toHaveValue('#aabbcc');
  });

  it('validates invalid text on blur without emitting an invalid colour', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<ControlledPicker onChange={onChange} />);
    const hex = screen.getByRole('textbox', { name: 'Hex colour' });
    await user.clear(hex);
    await user.type(hex, 'oops');
    await user.tab();
    expect(onChange).not.toHaveBeenCalled();
    expect(hex).toHaveAttribute('aria-invalid', 'true');
    expect(hex).toHaveAccessibleDescription('Enter a 3 or 6 digit hex colour, like #e0e0e0.');
    expect(screen.getByLabelText('Base colour')).toHaveValue('#e0e0e0');
  });

  it('cancels invalid drafts and validation with Escape', async () => {
    const user = userEvent.setup();
    render(<ControlledPicker onChange={jest.fn()} />);
    const hex = screen.getByRole('textbox', { name: 'Hex colour' });
    await user.clear(hex);
    await user.type(hex, 'oops{Enter}');
    expect(hex).toHaveAttribute('aria-invalid', 'true');
    await user.keyboard('{Escape}');
    expect(hex).toHaveValue('#e0e0e0');
    expect(hex).toHaveAttribute('aria-invalid', 'false');
  });

  it('replaces invalid text and errors when the native picker changes', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<ControlledPicker onChange={onChange} />);
    const hex = screen.getByRole('textbox', { name: 'Hex colour' });
    await user.clear(hex);
    await user.type(hex, 'oops{Enter}');
    fireEvent.change(screen.getByLabelText('Base colour'), { target: { value: '#336699' } });
    expect(onChange).toHaveBeenLastCalledWith('#336699');
    expect(hex).toHaveValue('#336699');
    expect(hex).toHaveAttribute('aria-invalid', 'false');
  });

  it('does not emit updates when an untouched field loses focus', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<ColourPicker value="#e0e0e0" onChange={onChange} />);
    await user.click(screen.getByRole('textbox', { name: 'Hex colour' }));
    await user.tab();
    expect(onChange).not.toHaveBeenCalled();
  });
});
