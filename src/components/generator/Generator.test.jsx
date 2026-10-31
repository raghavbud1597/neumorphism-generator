import { StrictMode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import Generator from './Generator.jsx';

function renderGenerator() {
  render(<StrictMode><Generator /></StrictMode>);
  return screen.getByRole('img', { name: 'Neumorphic shape' });
}

beforeEach(() => window.history.replaceState(null, '', '/'));

describe('Neumorphic design creator', () => {
  it('renders a live surface with labelled editing controls and reproducible CSS', () => {
    const preview = renderGenerator();
    expect(screen.getByRole('heading', { name: /Generate neumorphic designs/ })).toBeInTheDocument();
    expect(screen.getAllByRole('slider')).toHaveLength(5);
    expect(screen.getAllByRole('spinbutton')).toHaveLength(5);
    expect(screen.getByLabelText('Base colour')).toHaveValue('#e0e0e0');
    expect(preview).toHaveStyle({ width: '250px', height: '250px', borderRadius: '50px' });
    expect(preview.style.boxShadow).toBe('20px 20px 40px #bebebe, -20px -20px 40px #ffffff');
    expect(screen.getByLabelText('Generated CSS')).toHaveTextContent('width: 250px;');
    expect(screen.getByRole('button', { name: 'flat' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('commits precise dimensions with Enter, clamps values, and restores empty numeric edits', async () => {
    const user = userEvent.setup();
    const preview = renderGenerator();
    const size = screen.getByRole('spinbutton', { name: 'Size value' });
    await user.click(size);
    await user.clear(size);
    await user.type(size, '999{Enter}');
    expect(preview).toHaveStyle({ width: '500px' });
    expect(screen.getByRole('slider', { name: 'Size' })).toHaveValue('500');
    await user.clear(size);
    await user.tab();
    expect(size).toHaveValue(500);
    expect(screen.getByRole('button', { name: 'Square corners' })).toHaveFocus();
  });

  it('supports sharp corners and true circles, including odd sizes and shrinking surfaces', async () => {
    const user = userEvent.setup();
    const preview = renderGenerator();
    fireEvent.change(screen.getByRole('slider', { name: 'Size' }), { target: { value: '501' } });
    fireEvent.change(screen.getByRole('slider', { name: 'Size' }), { target: { value: '499' } });
    await user.click(screen.getByRole('button', { name: 'Circular shape' }));
    expect(preview).toHaveStyle({ borderRadius: '249.5px' });
    fireEvent.change(screen.getByRole('slider', { name: 'Size' }), { target: { value: '100' } });
    expect(preview).toHaveStyle({ borderRadius: '50px' });
    await user.click(screen.getByRole('button', { name: 'Square corners' }));
    expect(preview).toHaveStyle({ borderRadius: '0px' });
  });

  it('updates blur with distance while allowing an independent custom blur', () => {
    const preview = renderGenerator();
    fireEvent.change(screen.getByRole('slider', { name: 'Distance' }), { target: { value: '35' } });
    expect(screen.getByRole('slider', { name: 'Blur' })).toHaveValue('70');
    expect(preview.style.boxShadow).toContain('35px 35px 70px');
    fireEvent.change(screen.getByRole('slider', { name: 'Blur' }), { target: { value: '25' } });
    expect(screen.getByRole('slider', { name: 'Distance' })).toHaveValue('35');
    expect(preview.style.boxShadow).toContain('35px 35px 25px');
  });

  it('preserves a custom blur when a distance field is focused without editing', async () => {
    const user = userEvent.setup();
    renderGenerator();
    fireEvent.change(screen.getByRole('slider', { name: 'Blur' }), { target: { value: '11' } });
    await user.click(screen.getByRole('spinbutton', { name: 'Distance value' }));
    await user.tab();
    expect(screen.getByRole('slider', { name: 'Blur' })).toHaveValue('11');
  });

  it('rotates light and gradients and preserves settings when switching surface modes', async () => {
    const user = userEvent.setup();
    const preview = renderGenerator();
    await user.click(screen.getByRole('button', { name: 'convex' }));
    expect(preview.style.background).toContain('315deg');
    const convex = preview.style.background;
    await user.click(screen.getByRole('button', { name: 'concave' }));
    expect(preview.style.background).not.toBe(convex);
    await user.click(screen.getByRole('button', { name: 'Light from bottom right' }));
    expect(preview.style.background).toContain('135deg');
    expect(preview.style.boxShadow).toMatch(/^-20px -20px/);
    await user.click(screen.getByRole('button', { name: 'pressed' }));
    expect(preview.style.boxShadow).toContain('inset -20px -20px');
    expect(screen.getByLabelText('Generated CSS')).toHaveTextContent('inset -20px -20px');
    expect(screen.getByRole('button', { name: 'Light from bottom right' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('slider', { name: 'Size' })).toHaveValue('250');
  });

  it('normalizes valid hex and safely leaves the last valid preview for an invalid edit', async () => {
    const user = userEvent.setup();
    const preview = renderGenerator();
    const hex = screen.getByRole('textbox', { name: 'Hex colour' });
    await user.clear(hex);
    await user.type(hex, '#AbC{Enter}');
    expect(hex).toHaveValue('#aabbcc');
    expect(preview).toHaveStyle({ backgroundColor: '#aabbcc' });
    expect(window.location.hash).toBe('#aabbcc');
    await user.clear(hex);
    await user.type(hex, 'nope');
    await user.tab();
    expect(hex).toHaveAttribute('aria-invalid', 'true');
    expect(preview).toHaveStyle({ backgroundColor: '#aabbcc' });
    fireEvent.change(screen.getByLabelText('Base colour'), { target: { value: '#336699' } });
    expect(hex).toHaveValue('#336699');
    expect(hex).toHaveAttribute('aria-invalid', 'false');
    expect(screen.getByRole('region', { name: 'Preview' })).toHaveStyle({ '--preview-background': '#336699' });
  });

  it('updates shadow intensity as a percentage', () => {
    const preview = renderGenerator();
    const initial = preview.style.boxShadow;
    fireEvent.change(screen.getByRole('slider', { name: 'Intensity' }), { target: { value: '30' } });
    expect(preview.style.boxShadow).not.toBe(initial);
    expect(screen.getByRole('spinbutton', { name: 'Intensity value' })).toHaveValue(30);
  });

  it('reads colour links, handles hash changes, and falls back safely for invalid hashes', () => {
    window.history.replaceState(null, '', '/#abc');
    const preview = renderGenerator();
    expect(preview).toHaveStyle({ backgroundColor: '#aabbcc' });
    window.history.replaceState(null, '', '/#113355');
    fireEvent(window, new HashChangeEvent('hashchange'));
    expect(preview).toHaveStyle({ backgroundColor: '#113355' });
    window.history.replaceState(null, '', '/#invalid');
    fireEvent(window, new HashChangeEvent('hashchange'));
    expect(preview).toHaveStyle({ backgroundColor: '#e0e0e0' });
  });

  it('resets settings, colour validation, surface, and lighting together', async () => {
    const user = userEvent.setup();
    const preview = renderGenerator();
    fireEvent.change(screen.getByRole('slider', { name: 'Size' }), { target: { value: '400' } });
    await user.click(screen.getByRole('button', { name: 'pressed' }));
    await user.click(screen.getByRole('button', { name: 'Light from top right' }));
    const hex = screen.getByRole('textbox', { name: 'Hex colour' });
    await user.clear(hex);
    await user.type(hex, 'oops');
    await user.click(screen.getByRole('button', { name: 'Reset settings' }));
    expect(preview).toHaveStyle({ width: '250px', borderRadius: '50px', backgroundColor: '#e0e0e0' });
    expect(screen.getByRole('textbox', { name: 'Hex colour' })).toHaveAttribute('aria-invalid', 'false');
    expect(screen.getByRole('button', { name: 'flat' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Light from top left' })).toHaveAttribute('aria-pressed', 'true');
    expect(preview.style.boxShadow).not.toContain('inset');
  });

  it('copies the displayed CSS and clears success when the design changes', async () => {
    const user = userEvent.setup();
    renderGenerator();
    const write = jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    await user.click(screen.getByRole('button', { name: 'Copy CSS' }));
    expect(write).toHaveBeenCalledWith(screen.getByLabelText('Generated CSS').textContent);
    expect(screen.getByRole('status')).toHaveTextContent('CSS copied to clipboard.');
    fireEvent.change(screen.getByRole('slider', { name: 'Size' }), { target: { value: '300' } });
    expect(screen.getByRole('button', { name: 'Copy CSS' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('keeps CSS available with a useful message when clipboard access fails', async () => {
    const user = userEvent.setup();
    renderGenerator();
    jest.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Permission denied'));
    await user.click(screen.getByRole('button', { name: 'Copy CSS' }));
    expect(screen.getByRole('status')).toHaveTextContent('Select the CSS above and copy it manually.');
    expect(screen.getByLabelText('Generated CSS')).toHaveAttribute('tabindex', '0');
  });
});
