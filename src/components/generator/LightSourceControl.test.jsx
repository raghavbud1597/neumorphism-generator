import { describe, expect, it, jest } from '@jest/globals';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LightSourceControl from './LightSourceControl.jsx';

describe('LightSourceControl', () => {
  it('shows one selected source and accepts an updated direction', () => {
    const { rerender } = render(<LightSourceControl value="top-left" onChange={jest.fn()} />);
    const group = screen.getByRole('group', { name: 'Light source' });
    expect(within(group).getAllByRole('button')).toHaveLength(4);
    expect(within(group).getAllByRole('button', { pressed: true })).toHaveLength(1);

    rerender(<LightSourceControl value="bottom-right" onChange={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Light from bottom right' })).toHaveAttribute('aria-pressed', 'true');
  });

  it.each(['top-left', 'top-right', 'bottom-left', 'bottom-right'])(
    'selects %s lighting', async (direction) => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<LightSourceControl value="top-left" onChange={onChange} />);

      await user.click(screen.getByRole('button', { name: `Light from ${direction.replace('-', ' ')}` }));
      expect(onChange).toHaveBeenCalledWith(direction);
    },
  );

  it('can select a light with the keyboard', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<LightSourceControl value="top-left" onChange={onChange} />);

    await user.tab();
    await user.tab();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith('top-right');
  });
});
