import { describe, expect, it, jest } from '@jest/globals';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SurfaceSelector from './SurfaceSelector.jsx';

describe('SurfaceSelector', () => {
  it('announces the selected surface and responds to controlled updates', () => {
    const { rerender } = render(<SurfaceSelector value="flat" onChange={jest.fn()} />);
    const group = screen.getByRole('group', { name: 'Surface' });

    expect(within(group).getAllByRole('button')).toHaveLength(4);
    expect(within(group).getAllByRole('button', { pressed: true })).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'flat' })).toHaveAttribute('aria-pressed', 'true');

    rerender(<SurfaceSelector value="convex" onChange={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'convex' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'flat' })).toHaveAttribute('aria-pressed', 'false');
  });

  it.each(['flat', 'concave', 'convex', 'pressed'])('emits the selected %s surface', async (surface) => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<SurfaceSelector value="flat" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: surface }));
    expect(onChange).toHaveBeenCalledWith(surface);
  });

  it('gives multiple instances distinct accessible labels', () => {
    render(<><SurfaceSelector value="flat" /><SurfaceSelector value="pressed" /></>);
    const groups = screen.getAllByRole('group', { name: 'Surface' });
    expect(groups[0].getAttribute('aria-labelledby')).not.toBe(groups[1].getAttribute('aria-labelledby'));
  });
});
