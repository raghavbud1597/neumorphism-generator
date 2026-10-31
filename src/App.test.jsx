import { beforeEach, describe, expect, it } from '@jest/globals';
import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App.jsx';

beforeEach(() => window.history.replaceState(null, '', '/'));

describe('App', () => {
  it('composes the complete creator inside one main landmark', () => {
    render(<App />);

    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Generate neumorphic designs.');
    expect(screen.getByRole('region', { name: 'Preview' })).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: 'Design editor' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Your CSS' })).toBeInTheDocument();
  });

  it('renders the library on its own URL with shared navigation and footer', () => {
    window.history.replaceState(null, '', '/components/');
    render(<App />);
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('A softer starting point.');
    expect(within(screen.getByRole('navigation', { name: 'Main navigation' })).getByRole('link', { name: /Components/ })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('contentinfo')).toHaveTextContent('All rights reserved');
    expect(document.title).toBe('Component Library · Neumorphism');
  });

  it('skips to the main content without changing the generator colour hash', () => {
    window.history.replaceState(null, '', '/#aabbcc');
    render(<App />);
    fireEvent.click(screen.getByRole('link', { name: 'Skip to content' }));
    expect(screen.getByRole('main')).toHaveFocus();
    expect(window.location.hash).toBe('#aabbcc');
  });
});
