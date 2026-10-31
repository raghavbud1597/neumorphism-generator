import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DEFAULT_SETTINGS } from '../../lib/generatorSettings.js';
import Configuration from './Configuration.jsx';

describe('Configuration', () => {
  it('exposes the current values with dimension-aware radius limits', () => {
    render(<Configuration settings={{ ...DEFAULT_SETTINGS, size: 499 }} onSettingChange={jest.fn()} />);

    expect(screen.getByRole('region', { name: 'Make it yours' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Size' })).toHaveValue('499');
    expect(screen.getByRole('slider', { name: 'Radius' })).toHaveAttribute('max', '249.5');
    expect(screen.getByRole('slider', { name: 'Intensity' })).toHaveValue('15');
  });

  it.each([
    ['Size', 'size', '300', 300],
    ['Radius', 'borderRadius', '100', 100],
    ['Distance', 'distance', '35', 35],
    ['Intensity', 'intensity', '25', 0.25],
    ['Blur', 'blur', '22', 22],
  ])('maps %s input to the correct setting and units', (label, setting, input, expected) => {
    const onSettingChange = jest.fn();
    render(<Configuration settings={DEFAULT_SETTINGS} onSettingChange={onSettingChange} />);

    fireEvent.change(screen.getByRole('slider', { name: label }), { target: { value: input } });
    expect(onSettingChange).toHaveBeenCalledWith(setting, expected);
  });

  it('connects colour, surface, and geometry shortcuts to their settings', async () => {
    const user = userEvent.setup();
    const onSettingChange = jest.fn();
    render(<Configuration settings={{ ...DEFAULT_SETTINGS, size: 499 }} onSettingChange={onSettingChange} />);

    fireEvent.change(screen.getByLabelText('Base colour'), { target: { value: '#336699' } });
    expect(onSettingChange).toHaveBeenCalledWith('backgroundColor', '#336699');
    await user.click(screen.getByRole('button', { name: 'pressed' }));
    expect(onSettingChange).toHaveBeenCalledWith('surface', 'pressed');
    await user.click(screen.getByRole('button', { name: 'Square corners' }));
    expect(onSettingChange).toHaveBeenCalledWith('borderRadius', 0);
    await user.click(screen.getByRole('button', { name: 'Circular shape' }));
    expect(onSettingChange).toHaveBeenCalledWith('borderRadius', 249.5);
  });
});
