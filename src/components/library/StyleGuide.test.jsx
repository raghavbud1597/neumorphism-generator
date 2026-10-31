import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StyleGuide from './StyleGuide.jsx';
import { componentStyles } from '../../lib/componentStyles.js';

describe('Styling guide', () => {
  it('copies the same foundations shipped with component exports', async () => {
    const user = userEvent.setup();
    render(<StyleGuide />);
    const write = jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    await user.click(screen.getByRole('button', { name: /Copy foundation CSS/ }));
    expect(write).toHaveBeenCalledWith(componentStyles);
    expect(screen.getByRole('status')).toHaveTextContent('Foundation CSS copied');
  });

  it('explains how to recover when copying is unavailable', async () => {
    const user = userEvent.setup();
    render(<StyleGuide />);
    jest.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Denied'));
    await user.click(screen.getByRole('button', { name: /Copy foundation CSS/ }));
    expect(screen.getByRole('status')).toHaveTextContent('copy the foundations manually');
  });
});
