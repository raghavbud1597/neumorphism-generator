import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import SiteFooter from './SiteFooter.jsx';

describe('SiteFooter', () => {
  it('renders the product footer and CSS attribution', () => {
    render(<SiteFooter />);

    expect(screen.getByRole('contentinfo')).toHaveTextContent('Simple shapes. Endless possibilities.');
    expect(screen.getByText('Made with CSS')).toBeInTheDocument();
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Component library' })).toHaveAttribute('href', '/components/');
    expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute('rel', 'noreferrer');
  });
});
