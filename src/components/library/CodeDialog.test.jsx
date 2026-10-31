import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CodeDialog from './CodeDialog.jsx';
import ComponentLibrary from './ComponentLibrary.jsx';
import { components, createComponentDocument } from '../../lib/componentCatalog.js';

beforeEach(() => {
  window.history.replaceState(null, '', '/components');
  HTMLDialogElement.prototype.showModal = jest.fn(function () { this.setAttribute('open', ''); });
  HTMLDialogElement.prototype.close = jest.fn(function () { this.removeAttribute('open'); });
});

describe('Component code viewer', () => {
  it('copies the exact HTML and CSS shown in the preview and supports keyboard language tabs', async () => {
    const user = userEvent.setup();
    const item = components.find(item => item.id === 'button');
    const onClose = jest.fn();
    render(<CodeDialog item={item} onClose={onClose} />);
    const write = jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    expect(screen.getByTitle('Button expanded preview')).toHaveAttribute('srcdoc', createComponentDocument(item, { preview: true }));
    await user.click(screen.getByRole('button', { name: 'Copy HTML' }));
    expect(write).toHaveBeenLastCalledWith(item.html);
    await user.click(screen.getByRole('tab', { name: 'CSS' }));
    await user.click(screen.getByRole('button', { name: 'Copy CSS' }));
    expect(write).toHaveBeenLastCalledWith(item.css);
    expect(screen.getByRole('status')).toHaveTextContent('Copied to clipboard.');
    fireEvent.keyDown(screen.getByRole('tab', { name: 'CSS' }), { key: 'Home' });
    expect(screen.getByRole('tab', { name: 'HTML' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'HTML' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(screen.getByRole('tab', { name: 'HTML' }), { key: 'Escape' });
    await user.click(screen.getByRole('button', { name: 'Close code viewer' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('includes behaviour scripts in both the JS tab and the complete copied document', async () => {
    const user = userEvent.setup();
    const item = components.find(item => item.id === 'tabs');
    render(<CodeDialog item={item} onClose={() => {}} />);
    const write = jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    await user.click(screen.getByRole('tab', { name: 'JavaScript' }));
    await user.click(screen.getByRole('button', { name: 'Copy JavaScript' }));
    expect(write).toHaveBeenLastCalledWith(item.js);
    await user.click(screen.getByRole('button', { name: /Copy all/ }));
    expect(write).toHaveBeenLastCalledWith(createComponentDocument(item));
    expect(write.mock.calls.at(-1)[0]).toContain('<script>');
  });

  it('keeps code selectable and reports clipboard failures for either copy action', async () => {
    const user = userEvent.setup();
    render(<CodeDialog item={components[0]} onClose={() => {}} />);
    jest.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Blocked'));
    await user.click(screen.getByRole('button', { name: 'Copy HTML' }));
    expect(screen.getByRole('status')).toHaveTextContent('copy it manually');
    expect(screen.getByLabelText('HTML code for Button')).toHaveAttribute('tabindex', '0');
    await user.click(screen.getByRole('button', { name: /Copy all/ }));
    expect(screen.getByRole('status')).toHaveTextContent('copy it manually');
  });

  it('opens from the gallery, closes with Escape, and restores focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<ComponentLibrary />);
    const trigger = screen.getByRole('button', { name: 'View code for Button' });
    await user.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { bubbles: true, cancelable: true }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('opens shared component links directly', () => {
    window.history.replaceState(null, '', '/components?component=toggle-switch');
    render(<ComponentLibrary />);
    expect(screen.getByRole('dialog')).toHaveAccessibleName('Toggle switch');
  });
});
