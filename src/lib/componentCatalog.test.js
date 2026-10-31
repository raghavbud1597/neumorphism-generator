import { afterEach, describe, expect, it } from '@jest/globals';
import { fireEvent, screen } from '@testing-library/dom';
import { componentCategories, components, createComponentDocument } from './componentCatalog.js';

function mountExample(id) {
  const item = components.find(component => component.id === id);
  document.body.innerHTML = item.html;
  if (item.js) new Function(item.js)();
  return item;
}

afterEach(() => { document.body.innerHTML = ''; });

describe('portable component exports', () => {
  it('has unique component identifiers and covers every documented category', () => {
    expect(new Set(components.map(item => item.id)).size).toBe(components.length);
    expect(componentCategories).toHaveLength(15);
    expect(components.length).toBeGreaterThanOrEqual(80);
    expect(componentCategories.every(category => category.items.length > 0)).toBe(true);
  });

  it.each(components)('$name exports complete markup, CSS, and valid accessibility references', item => {
    const doc = new DOMParser().parseFromString(createComponentDocument(item), 'text/html');
    expect(doc.querySelector('title').textContent).toContain(item.name);
    expect(doc.querySelector('.neu')).not.toBeNull();
    expect(doc.querySelector('style').textContent).toContain(item.css);
    expect(doc.querySelector('script')?.textContent.trim() || '').toBe(item.js.trim());
    const ids = [...doc.querySelectorAll('[id]')].map(node => node.id);
    expect(new Set(ids).size).toBe(ids.length);
    doc.querySelectorAll('[aria-labelledby], [aria-describedby], [aria-controls], [for], [popovertarget], [list]').forEach(node => {
      ['aria-labelledby', 'aria-describedby', 'aria-controls', 'for', 'popovertarget', 'list'].forEach(attribute => {
        (node.getAttribute(attribute) || '').split(/\s+/).filter(Boolean).forEach(id => {
          expect(doc.getElementById(id)).not.toBeNull();
        });
      });
    });
    // Every standalone example must initialize without missing app dependencies.
    document.body.innerHTML = item.html;
    if (item.js) expect(() => new Function(item.js)()).not.toThrow();
  });

  it('keeps both range endpoints ordered', () => {
    mountExample('range-slider');
    const min = screen.getByRole('slider', { name: 'Minimum price' });
    const max = screen.getByRole('slider', { name: 'Maximum price' });
    fireEvent.input(min, { target: { value: '95' } });
    expect(max.value).toBe('95');
    fireEvent.input(max, { target: { value: '5' } });
    expect(min.value).toBe('5');
    expect(document.querySelector('output').value).toBe('$5 – $5');
  });

  it('keeps preview anchor links inside their frame and exports regular standalone documents', () => {
    const item = components.find(item => item.id === 'text-link');
    const preview = new DOMParser().parseFromString(createComponentDocument(item, { preview: true }), 'text/html');
    expect(preview.querySelector('base').getAttribute('href')).toBe('about:srcdoc');
    expect(createComponentDocument(item)).not.toContain('<base');
  });

  it('supports keyboard tab selection and hides inactive content', () => {
    mountExample('tabs');
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Overview' }), { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Your project was created today.');
  });

  it('sorts numeric columns numerically in both directions', () => {
    mountExample('sortable-table');
    const members = screen.getByRole('button', { name: 'Members ↕' });
    fireEvent.click(members);
    expect([...document.querySelectorAll('tbody tr')].map(row => row.cells[1].textContent)).toEqual(['4', '8', '12']);
    expect(members.closest('th')).toHaveAttribute('aria-sort', 'ascending');
    fireEvent.click(members);
    expect([...document.querySelectorAll('tbody tr')].map(row => row.cells[1].textContent)).toEqual(['12', '8', '4']);
  });

  it('updates passwords, quantity bounds, and carousel slides without React', () => {
    mountExample('password-field');
    fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
    mountExample('number-stepper');
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '100' } });
    expect(screen.getByRole('spinbutton')).toHaveValue(10);
    fireEvent.click(screen.getByRole('button', { name: 'Increase quantity' }));
    expect(screen.getByRole('spinbutton')).toHaveValue(10);
    mountExample('carousel');
    fireEvent.click(screen.getByRole('button', { name: 'Previous slide' }));
    expect(screen.getByRole('heading')).toHaveTextContent('03. Make it yours.');
  });

  it('allows copied components to coexist without binding to each other or duplicating listeners', () => {
    const password = components.find(item => item.id === 'password-field');
    const filters = components.find(item => item.id === 'filter-chip');
    document.body.innerHTML = password.html + filters.html;
    new Function(password.js)();
    new Function(filters.js)();
    new Function(filters.js)();
    fireEvent.click(screen.getByRole('button', { name: 'Code' }));
    expect(screen.getByRole('button', { name: 'Code' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
    fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
  });
});
