import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DEFAULT_SETTINGS } from '../../lib/generatorSettings.js';
import { createNeumorphicStyle } from '../../lib/neumorphism.js';
import { installResizeObserverMock } from '../../test/resizeObserverMock.js';
import Preview from './Preview.jsx';

let observerMock;
afterEach(() => observerMock?.restore());

function renderPreview(settings = DEFAULT_SETTINGS, onSettingChange = jest.fn()) {
  return render(
    <Preview settings={settings} surfaceStyle={createNeumorphicStyle(settings)} onSettingChange={onSettingChange} />,
  );
}

describe('Preview', () => {
  it('renders generated dimensions, matching canvas, and light selection without ResizeObserver', async () => {
    const user = userEvent.setup();
    const onSettingChange = jest.fn();
    renderPreview(DEFAULT_SETTINGS, onSettingChange);

    expect(screen.getByRole('img', { name: 'Neumorphic shape' })).toHaveStyle({ width: '250px', height: '250px', borderRadius: '50px' });
    expect(screen.getByRole('region', { name: 'Preview' })).toHaveStyle({ '--preview-background': '#e0e0e0', '--preview-foreground': '#353735' });
    expect(screen.getByText('250 × 250 px')).toBeInTheDocument();
    expect(screen.queryByText(/Preview at/)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Light from top right' }));
    expect(onSettingChange).toHaveBeenCalledWith('lightDirection', 'top-right');
  });

  it('keeps preview text readable against a dark canvas', () => {
    renderPreview({ ...DEFAULT_SETTINGS, backgroundColor: '#111111' });
    expect(screen.getByRole('region', { name: 'Preview' })).toHaveStyle({ '--preview-foreground': '#f5f5f5' });
  });

  it('scales oversized shapes, preserves exported dimensions, and disconnects its observer', () => {
    observerMock = installResizeObserverMock();
    const { unmount } = renderPreview();
    expect(observerMock.instances[0].observe).toHaveBeenCalledWith(expect.any(HTMLElement));

    act(() => observerMock.resize(155, 200));
    expect(screen.getByText(/Preview at 50%/)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveStyle({ width: '250px', '--preview-scale': '0.5' });

    act(() => observerMock.resize(1000, 1000));
    expect(screen.queryByText(/Preview at/)).not.toBeInTheDocument();
    act(() => observerMock.resize(0, 0));
    expect(screen.getByText(/Preview at 1%/)).toBeInTheDocument();

    unmount();
    expect(observerMock.instances[0].disconnect).toHaveBeenCalledTimes(1);
  });
});
