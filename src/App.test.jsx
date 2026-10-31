import { StrictMode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App.jsx';

function renderGenerator() {
  render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  return screen.getByRole('img', { name: 'Neumorphic shape' });
}

describe('Neumorphism Generator', () => {
  it('renders labelled controls and opposing light and dark shadows', () => {
    const preview = renderGenerator();

    expect(screen.getByRole('heading', { name: 'Neumorphism Generator' })).toBeInTheDocument();
    expect(screen.getAllByRole('slider')).toHaveLength(5);
    expect(screen.getByLabelText('Pick a Colour')).toHaveValue('#6ebfb5');
    expect(preview).toHaveStyle({ width: '300px', height: '300px', borderRadius: '63px' });
    expect(getComputedStyle(preview).boxShadow).toMatch(/^20px 20px 40px .+,\s*-20px -20px 40px /);
  });

  it('updates dimensions through keyboard-accessible controls', async () => {
    const user = userEvent.setup();
    const preview = renderGenerator();
    const size = screen.getByRole('slider', { name: 'Size' });

    await user.tab();
    expect(screen.getByLabelText('Pick a Colour')).toHaveFocus();
    await user.tab();
    expect(size).toHaveFocus();

    fireEvent.change(size, { target: { value: '400' } });
    fireEvent.change(screen.getByRole('slider', { name: 'Border Radius' }), {
      target: { value: '100' },
    });

    expect(preview).toHaveStyle({ width: '400px', height: '400px', borderRadius: '100px' });
  });

  it('updates blur with distance while allowing a custom blur', () => {
    const preview = renderGenerator();

    fireEvent.change(screen.getByRole('slider', { name: 'Distance' }), {
      target: { value: '35' },
    });

    expect(screen.getByRole('slider', { name: 'Blur' })).toHaveValue('70');
    expect(getComputedStyle(preview).boxShadow).toMatch(/^35px 35px 70px .+,\s*-35px -35px 70px /);

    fireEvent.change(screen.getByRole('slider', { name: 'Blur' }), {
      target: { value: '25' },
    });

    expect(screen.getByRole('slider', { name: 'Distance' })).toHaveValue('35');
    expect(getComputedStyle(preview).boxShadow).toMatch(/^35px 35px 25px .+,\s*-35px -35px 25px /);
  });

  it('keeps shadows in sync when intensity and colour change', () => {
    const preview = renderGenerator();
    const initialShadow = getComputedStyle(preview).boxShadow;

    fireEvent.change(screen.getByRole('slider', { name: 'Intensity' }), {
      target: { value: '0.3' },
    });

    const intensifiedShadow = getComputedStyle(preview).boxShadow;
    expect(intensifiedShadow).not.toBe(initialShadow);

    fireEvent.change(screen.getByLabelText('Pick a Colour'), {
      target: { value: '#336699' },
    });

    expect(preview).toHaveStyle({ backgroundColor: '#336699' });
    expect(screen.getByRole('main')).toHaveStyle({ backgroundColor: '#336699' });
    expect(getComputedStyle(preview).boxShadow).not.toBe(intensifiedShadow);
    expect(screen.getByRole('slider', { name: 'Intensity' })).toHaveValue('0.3');
  });

  it('keeps styling props out of the DOM', () => {
    const preview = renderGenerator();
    const elements = [
      preview,
      screen.getByRole('main'),
      screen.getByRole('region', { name: 'Neumorphism Generator' }),
    ];
    const attributes = [
      'backgroundColor', 'lightColor', 'darkColor', 'borderRadius',
      'size', 'distance', 'blur', 'settings',
    ];

    for (const element of elements) {
      for (const attribute of attributes) {
        expect(element).not.toHaveAttribute(attribute);
      }
    }
  });
});
