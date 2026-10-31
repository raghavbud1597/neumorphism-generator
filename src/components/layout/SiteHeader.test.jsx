import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import SiteHeader from './SiteHeader.jsx';

describe('SiteHeader', () => {
  it('links the generator, library, and styling guide', () => {
    render(<SiteHeader />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Neumorphism home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Generator' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: /Components/ })).toHaveAttribute('href', '/components/');
    expect(screen.getByRole('link', { name: 'Style guide' })).toHaveAttribute('href', '/components/#style-guide');
  });

  it('marks the library as the current page', () => {
    render(<SiteHeader activePage="components" />);
    expect(screen.getByRole('link', { name: /Components/ })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Generator' })).not.toHaveAttribute('aria-current');
  });
});
