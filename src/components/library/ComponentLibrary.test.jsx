import { beforeEach, describe, expect, it } from '@jest/globals';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComponentLibrary from './ComponentLibrary.jsx';

beforeEach(() => window.history.replaceState(null, '', '/components'));

describe('Component library browsing', () => {
  it('starts with a bounded set of previews and loads more on demand', async () => {
    const user = userEvent.setup();
    render(<ComponentLibrary />);
    expect(screen.getAllByRole('button', { name: /^View code for/ })).toHaveLength(12);
    expect(screen.getByRole('heading', { name: 'One surface. A shared language.' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Load more components/ }));
    expect(screen.getAllByRole('button', { name: /^View code for/ })).toHaveLength(24);
    expect(screen.getByText('Showing 24 of 86 components')).toBeInTheDocument();
  });

  it('filters by category and search together and recovers from no results', async () => {
    const user = userEvent.setup();
    render(<ComponentLibrary />);
    await user.click(within(screen.getByRole('complementary')).getByRole('button', { name: /^Cards/ }));
    expect(screen.getAllByRole('button', { name: /^View code for/ })).toHaveLength(6);
    await user.type(screen.getByRole('searchbox'), 'profile');
    expect(screen.getAllByRole('button', { name: /^View code for/ })).toHaveLength(1);
    await user.clear(screen.getByRole('searchbox'));
    await user.type(screen.getByRole('searchbox'), 'nothing matches');
    expect(screen.getByRole('heading', { name: 'No components found.' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getByRole('searchbox')).toHaveValue('');
    expect(screen.getAllByRole('button', { name: /^View code for/ })).toHaveLength(12);
  });

  it('offers the same categories through the mobile selector', async () => {
    const user = userEvent.setup();
    render(<ComponentLibrary />);
    await user.selectOptions(screen.getByRole('combobox', { name: 'Browse category' }), 'selection');
    expect(screen.getByRole('heading', { name: 'Toggle switch' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^View code for/ })).toHaveLength(7);
    expect(screen.queryByRole('button', { name: /Load more components/ })).not.toBeInTheDocument();
  });

  it('ignores invalid component deep links', () => {
    window.history.replaceState(null, '', '/components?component=not-real');
    render(<ComponentLibrary />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
