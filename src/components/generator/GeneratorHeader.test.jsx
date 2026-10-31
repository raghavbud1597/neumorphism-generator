import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GeneratorHeader from './GeneratorHeader.jsx';

describe('GeneratorHeader', () => {
  it('explains the creator and calls reset from the keyboard', async () => {
    const user = userEvent.setup();
    const onReset = jest.fn();
    render(<GeneratorHeader onReset={onReset} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Generate neumorphic designs.');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Reset settings' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
