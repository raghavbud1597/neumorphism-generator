import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CodeOutput from './CodeOutput.jsx';

const CODE = '.neumorphic { width: 250px; }';

describe('CodeOutput', () => {
  it('shows selectable CSS and explains the surrounding colour', () => {
    render(<CodeOutput code={CODE} backgroundColor="#e0e0e0" />);

    expect(screen.getByRole('region', { name: 'Your CSS' })).toBeInTheDocument();
    expect(screen.getByLabelText('Generated CSS')).toHaveTextContent(CODE);
    expect(screen.getByLabelText('Generated CSS')).toHaveAttribute('tabindex', '0');
    expect(screen.getByText('#e0e0e0')).toBeInTheDocument();
  });

  it('copies exactly the provided CSS and resets visible feedback when output changes', async () => {
    const user = userEvent.setup();
    const write = jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    const { rerender } = render(<CodeOutput code={CODE} backgroundColor="#e0e0e0" />);

    await user.click(screen.getByRole('button', { name: 'Copy CSS' }));
    expect(write).toHaveBeenCalledWith(CODE);
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('CSS copied to clipboard.');

    rerender(<CodeOutput code=".neumorphic { width: 300px; }" backgroundColor="#e0e0e0" />);
    expect(screen.getByRole('button', { name: 'Copy CSS' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('announces clipboard rejection without hiding the CSS', async () => {
    const user = userEvent.setup();
    jest.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Denied'));
    render(<CodeOutput code={CODE} backgroundColor="#e0e0e0" />);

    await user.click(screen.getByRole('button', { name: 'Copy CSS' }));
    expect(screen.getByRole('status')).toHaveTextContent('Select the CSS above and copy it manually.');
    expect(screen.getByLabelText('Generated CSS')).toHaveTextContent(CODE);
  });
});
