import { componentStyles } from './componentStyles.js';

function formatMarkup(markup) {
  let depth = 1;
  const voidTag = /^<(?:input|hr|br|img|source|wbr)\b/;
  return markup.replaceAll('><', '>\n<').split('\n').map(line => {
    const text = line.trim();
    if (text.startsWith('</')) depth = Math.max(1, depth - 1);
    const formatted = '  '.repeat(depth) + text;
    if (/^<[a-z]/.test(text) && !voidTag.test(text) && !text.includes('</')) depth += 1;
    return formatted;
  }).join('\n');
}

function component(id, name, description, markup, options = {}) {
  // Scope copied scripts to their own component so multiple snippets can coexist.
  const behaviour = options.js
    ? options.js.replaceAll('document.querySelector', 'root.querySelector').replaceAll('document.getElementById', 'byId')
    : '';
  const script = behaviour ? `document.querySelectorAll('[data-neu-component="${id}"]').forEach(root => {
  if (root.dataset.neuReady) return;
  root.dataset.neuReady = 'true';
${behaviour.includes('byId(') ? `  const byId = id => root.querySelector('[id="' + id + '"]');\n` : ''}${behaviour.split('\n').map(line => `  ${line}`).join('\n')}
});` : '';
  return {
    id, name, description,
    html: `<div class="neu" data-neu-component="${id}">\n${formatMarkup(markup.replaceAll('neu-menu-result', `neu-menu-result-${id}`))}\n</div>`,
    css: componentStyles + (options.css || ''),
    js: script,
    height: options.height || 250,
  };
}

const button = (text, extra = '') => `<button class="neu-btn ${extra}" type="button">${text}</button>`;
const input = (id, label, type = 'text', placeholder = '') => `<label class="neu-label" for="${id}">${label}<input class="neu-field" id="${id}" type="${type}" placeholder="${placeholder}"></label>`;
const toggle = (id, label, checked = '') => `<label class="neu-toggle"><input id="${id}" type="checkbox" role="switch" ${checked}><span class="neu-track" aria-hidden="true"></span><span>${label}</span></label>`;
const avatar = (initials = 'JD') => `<span class="neu-avatar" aria-hidden="true">${initials}</span>`;
const badge = (text) => `<span class="neu-badge">${text}</span>`;
const progress = `<div class="neu-stack"><div class="neu-between"><label for="neu-progress">Project progress</label><span>65%</span></div><progress class="neu-progress" id="neu-progress" value="65" max="100">65%</progress></div>`;
const table = `<table><thead><tr><th scope="col">Project</th><th scope="col">Status</th><th scope="col">Owner</th></tr></thead><tbody><tr><th scope="row">Website</th><td>In progress</td><td>Alex</td></tr><tr><th scope="row">Design system</th><td>Complete</td><td>Jamie</td></tr><tr><th scope="row">Mobile app</th><td>In review</td><td>Taylor</td></tr></tbody></table>`;
const menuItems = `<a href="#neu-menu-result" data-choice="Edit project">Edit project</a><a href="#neu-menu-result" data-choice="Duplicate project">Duplicate project</a><a href="#neu-menu-result" data-choice="Archive project">Archive project</a>`;
const menuJS = `document.querySelectorAll('[data-choice]').forEach(item => {
  item.addEventListener('click', event => {
    event.preventDefault();
    document.querySelector('[data-menu-result]').textContent = item.dataset.choice + ' selected.';
    const dropdown = item.closest('details');
    if (dropdown) dropdown.open = false;
  });
});`;
const menuResult = `<p class="neu-muted" id="neu-menu-result" data-menu-result role="status">Choose an action.</p>`;
const overlay = (id, trigger, title, description, extra = '') => `${button(trigger)}<dialog class="neu-dialog" id="${id}" aria-labelledby="${id}-title"><div class="neu-stack"><h3 id="${id}-title">${title}</h3><p>${description}</p>${extra}<form method="dialog"><button class="neu-btn" type="submit">Close</button></form></div></dialog>`;
const overlayJS = (id) => `document.querySelector('.neu > button').addEventListener('click', () => {
  document.querySelector('#${id}').showModal();
});`;

export const componentCategories = [
  {
    id: 'actions', name: 'Buttons & actions',
    items: [
      component('button', 'Button', 'Raised, primary, and disabled actions with a tactile pressed state.', `<div class="neu-row">${button('Get started', 'neu-primary')}${button('Secondary')}<button class="neu-btn" disabled>Disabled</button></div>`),
      component('icon-button', 'Icon button', 'A circular action with an accessible text label.', `<div class="neu-row"><button class="neu-btn neu-icon" type="button" aria-label="Add item">+</button><button class="neu-btn neu-icon" type="button" aria-label="Favourite" aria-pressed="false">♡</button><button class="neu-btn neu-icon" type="button" aria-label="More options">⋯</button></div>`, { js: `const favourite = document.querySelector('[aria-label="Favourite"]');
favourite.addEventListener('click', () => {
  const selected = favourite.getAttribute('aria-pressed') !== 'true';
  favourite.setAttribute('aria-pressed', String(selected));
  favourite.textContent = selected ? '♥' : '♡';
});` }),
      component('button-group', 'Button group', 'Related actions arranged on one soft surface.', `<div class="neu-row" role="group" aria-label="Text alignment"><button class="neu-btn" type="button" aria-pressed="true">Left</button><button class="neu-btn" type="button" aria-pressed="false">Centre</button><button class="neu-btn" type="button" aria-pressed="false">Right</button></div>`, { js: `document.querySelectorAll('[aria-pressed]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[aria-pressed]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  });
});` }),
      component('split-button', 'Split button', 'A primary action paired with alternate actions in a disclosure.', `<div class="neu-row">${button('Save draft', 'neu-primary')}<details><summary class="neu-btn" aria-label="More save options">⌄</summary><div class="neu-menu">${menuItems}</div></details></div>${menuResult}`, { js: menuJS }),
      component('floating-action-button', 'Floating action button', 'A prominent circular action with a compact caption.', `<div class="neu-stack" style="justify-items:end"><button class="neu-btn neu-primary neu-icon" type="button" aria-label="Create new project" style="width:58px;height:58px;font-size:28px">+</button><span class="neu-muted">Create something new</span></div>`),
      component('text-link', 'Text link', 'Clear underlined links with a visible keyboard focus state.', `<div class="neu-stack"><a href="#neu-link-destination">Explore the collection ↗</a><p class="neu-muted" id="neu-link-destination">A little depth for your next idea.</p></div>`),
    ],
  },
  {
    id: 'cards', name: 'Cards',
    items: [
      component('content-card', 'Content card', 'An elevated content surface with a title, description, and action.', `<article class="neu-card neu-stack">${badge('DESIGN NOTES')}<h3>Less noise. More depth.</h3><p class="neu-muted">A little light and shadow can make everyday interfaces feel more human.</p><a href="#neu-card-note">Read the note ↗</a><p class="neu-muted" id="neu-card-note">Start with one surface and a consistent light source.</p></article>`, { height: 300 }),
      component('profile-card', 'Profile card', 'An identity card with an avatar and follow action.', `<article class="neu-card neu-stack" style="text-align:center;justify-items:center">${avatar('AL')}<div><h3>Alex Lee</h3><p class="neu-muted">Product designer · Toronto</p></div><button class="neu-btn" type="button" aria-pressed="false">Follow</button></article>`, { height: 310, js: `const follow = document.querySelector('button');
follow.addEventListener('click', () => {
  const following = follow.getAttribute('aria-pressed') !== 'true';
  follow.setAttribute('aria-pressed', String(following));
  follow.textContent = following ? 'Following' : 'Follow';
});` }),
      component('product-card', 'Product card', 'A product tile with an illustration, price, and cart feedback.', `<article class="neu-card neu-stack"><div class="neu-product-art" role="img" aria-label="Sage green ceramic cup">☕</div><div class="neu-between"><div><h3>The everyday cup</h3><p class="neu-muted">Sage · Handcrafted ceramic</p></div><strong>$24</strong></div><button class="neu-btn neu-primary" type="button">Add to bag</button><span class="neu-muted" role="status"></span></article>`, { height: 360, css: `.neu .neu-product-art { display:grid; place-items:center; min-height:90px; border-radius:12px; background:#dce3d5; box-shadow:var(--neu-inset); font-size:58px; }`, js: `document.querySelector('button').addEventListener('click', () => {
  document.querySelector('[role=status]').textContent = 'The everyday cup was added to your bag.';
});` }),
      component('pricing-card', 'Pricing card', 'A plan summary with a price, feature list, and call to action.', `<article class="neu-card neu-stack">${badge('FOR INDEPENDENT MAKERS')}<h3>Studio</h3><p><strong style="font-size:32px">$12</strong><span class="neu-muted"> / month</span></p><ul style="padding-left:18px"><li>Unlimited projects</li><li>Reusable styles</li><li>Export your work</li></ul>${button('Choose Studio', 'neu-primary')}</article>`, { height: 350 }),
      component('statistic-card', 'Statistic card', 'A compact metric with a label and comparison indicator.', `<article class="neu-card neu-stack"><span class="neu-muted">Total visitors</span><strong style="font-size:38px;letter-spacing:-2px">24,860</strong><div class="neu-row">${badge('↗ 12.8%')}<span class="neu-muted">vs. last month</span></div></article>`),
      component('media-card', 'Media card', 'Play / pause controls with a progress indicator.', `<article class="neu-card neu-stack"><div class="neu-row"><div class="neu-card" aria-hidden="true" style="font-size:30px;padding:12px">♫</div><div><h3>Quiet mornings</h3><p class="neu-muted">A little room to breathe</p></div></div><progress class="neu-progress" value="35" max="100" aria-label="Playback position">35%</progress><div class="neu-between"><span class="neu-muted">1:24 / 4:00</span><button class="neu-btn neu-icon" type="button" aria-label="Play" aria-pressed="false">▶</button></div></article>`, { height: 310, js: `const play = document.querySelector('button');
play.addEventListener('click', () => {
  const playing = play.getAttribute('aria-pressed') !== 'true';
  play.setAttribute('aria-pressed', String(playing));
  play.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  play.textContent = playing ? 'Ⅱ' : '▶';
});` }),
    ],
  },
  {
    id: 'text-inputs', name: 'Text inputs',
    items: [
      component('text-field', 'Text field', 'A labelled inset field for everyday text entry.', input('neu-full-name', 'Full name', 'text', 'Alex Lee')),
      component('password-field', 'Password field', 'A password field with an accessible visibility toggle.', `<div class="neu-stack">${input('neu-password', 'Password', 'password', 'At least 8 characters')}<button class="neu-btn" type="button" aria-controls="neu-password" aria-pressed="false">Show password</button></div>`, { js: `const button = document.querySelector('button');
const field = document.querySelector('input');
button.addEventListener('click', () => {
  const show = field.type === 'password';
  field.type = show ? 'text' : 'password';
  button.setAttribute('aria-pressed', String(show));
  button.textContent = show ? 'Hide password' : 'Show password';
});` }),
      component('search-field', 'Search field', 'A recessed search control with native clear behaviour.', `<div role="search">${input('neu-search', 'Search projects', 'search', 'Find something good…')}</div>`),
      component('textarea', 'Textarea', 'A resizable multiline field for messages and longer content.', `<label class="neu-label" for="neu-message">Your message<textarea class="neu-field" id="neu-message" rows="4" placeholder="What are you working on?"></textarea></label>`),
      component('input-with-icon', 'Input with icon', 'A leading decorative icon that leaves the field properly labelled.', `<label class="neu-label" for="neu-email">Email address<span class="neu-input-icon"><span aria-hidden="true">✉</span><input class="neu-field" id="neu-email" type="email" placeholder="you@example.com"></span></label>`, { css: `.neu .neu-input-icon { position:relative; } .neu .neu-input-icon > span { position:absolute; left:14px; top:12px; color:var(--neu-muted); } .neu .neu-input-icon input { padding-left:40px; }` }),
      component('input-prefix-suffix', 'Input with prefix / suffix', 'A numeric field with a visible currency prefix and unit suffix.', `<label class="neu-label" for="neu-budget">Monthly budget<div class="neu-row neu-field" style="flex-wrap:nowrap"><span aria-hidden="true">$</span><input id="neu-budget" type="number" min="0" value="120" style="width:100%;border:0;background:transparent" aria-label="Monthly budget in dollars"><span class="neu-muted">USD</span></div></label>`),
    ],
  },
  {
    id: 'selection', name: 'Selection controls',
    items: [
      component('checkbox', 'Checkbox', 'Independent choices with native checked and disabled states.', `<div class="neu-card neu-stack"><label><input class="neu-check" type="checkbox" checked> Email updates</label><label><input class="neu-check" type="checkbox"> Product news</label><label><input class="neu-check" type="checkbox" disabled> Coming soon</label></div>`),
      component('radio-button', 'Radio button', 'A labelled group for one choice from several options.', `<fieldset class="neu-card neu-stack" style="border:0"><legend>Billing cycle</legend><label><input class="neu-check" type="radio" name="billing" value="monthly" checked> Monthly</label><label><input class="neu-check" type="radio" name="billing" value="yearly"> Yearly · save 20%</label></fieldset>`),
      component('toggle-switch', 'Toggle switch', 'A sculpted on / off switch with a recessed track.', `<div class="neu-card neu-stack">${toggle('neu-notifications', 'Notifications', 'checked')}${toggle('neu-autosave', 'Auto-save')}</div>`),
      component('select-dropdown', 'Select dropdown', 'A native select styled as an inset surface.', `<label class="neu-label" for="neu-role">Your role<select class="neu-field" id="neu-role"><option>Designer</option><option>Developer</option><option>Product manager</option></select></label>`),
      component('multiselect', 'Multiselect', 'A native multiple select with clear keyboard instructions.', `<label class="neu-label" for="neu-tools">Your tools<select class="neu-field" id="neu-tools" multiple size="3" aria-describedby="neu-tools-help"><option selected>Figma</option><option>VS Code</option><option>Sketch</option></select></label><p class="neu-muted" id="neu-tools-help">Use Command or Control + click to select multiple options.</p>`),
      component('combobox', 'Combobox', 'A text field with native suggestions and custom entry.', `<label class="neu-label" for="neu-framework">Favourite framework<input class="neu-field" id="neu-framework" list="neu-frameworks" placeholder="Choose or type a framework"><datalist id="neu-frameworks"><option value="React"></option><option value="Vue"></option><option value="Svelte"></option><option value="Angular"></option></datalist></label>`),
      component('segmented-control', 'Segmented control', 'A radio group styled as an exclusive set of soft segments.', `<fieldset class="neu-segments"><legend class="neu-sr">View mode</legend><label><input type="radio" name="view" checked><span>Day</span></label><label><input type="radio" name="view"><span>Week</span></label><label><input type="radio" name="view"><span>Month</span></label></fieldset>`, { css: `.neu .neu-segments { display:flex; padding:6px; border:0; border-radius:12px; box-shadow:var(--neu-inset); } .neu .neu-segments label { flex:1; position:relative; } .neu .neu-segments input { position:absolute; opacity:0; width:1px; height:1px; } .neu .neu-segments span { display:block; text-align:center; padding:9px; border-radius:8px; cursor:pointer; } .neu .neu-segments input:checked + span { background:var(--neu-bg); color:var(--neu-accent); box-shadow:var(--neu-raised); } .neu .neu-segments input:focus-visible + span { outline:2px solid var(--neu-accent); }` }),
    ],
  },
  {
    id: 'special-inputs', name: 'Other inputs',
    items: [
      component('slider', 'Slider', 'A labelled range control with a synchronised value.', `<div class="neu-stack"><div class="neu-between"><label for="neu-volume">Volume</label><output for="neu-volume">60%</output></div><input class="neu-range" id="neu-volume" type="range" min="0" max="100" value="60"></div>`, { js: `document.querySelector('input').addEventListener('input', event => {
  document.querySelector('output').value = event.target.value + '%';
});` }),
      component('range-slider', 'Range slider', 'Two linked endpoints for selecting a price range.', `<div class="neu-stack"><output aria-live="polite">$20 – $80</output><label class="neu-label">Minimum price<input class="neu-range" data-min type="range" min="0" max="100" value="20"></label><label class="neu-label">Maximum price<input class="neu-range" data-max type="range" min="0" max="100" value="80"></label></div>`, { js: `const min = document.querySelector('[data-min]');
const max = document.querySelector('[data-max]');
[min, max].forEach(field => field.addEventListener('input', () => {
  if (Number(min.value) > Number(max.value)) {
    if (field === min) max.value = min.value;
    else min.value = max.value;
  }
  document.querySelector('output').value = '$' + min.value + ' – $' + max.value;
}));` }),
      component('number-stepper', 'Number stepper', 'Quantity controls with enforced minimum and maximum values.', `<div class="neu-stack"><label for="neu-quantity">Quantity</label><div class="neu-row" style="flex-wrap:nowrap"><button class="neu-btn neu-icon" type="button" data-step="-1" aria-label="Decrease quantity">−</button><input class="neu-field" id="neu-quantity" type="number" min="1" max="10" value="2" style="max-width:90px;text-align:center"><button class="neu-btn neu-icon" type="button" data-step="1" aria-label="Increase quantity">+</button></div></div>`, { js: `const quantity = document.querySelector('input');
document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
  quantity.value = Math.min(10, Math.max(1, Number(quantity.value) + Number(button.dataset.step)));
}));
quantity.addEventListener('change', () => { quantity.value = Math.min(10, Math.max(1, Math.round(Number(quantity.value) || 1))); });` }),
      component('date-picker', 'Date picker', 'A native accessible date picker on a soft inset surface.', input('neu-date', 'Choose a date', 'date')),
      component('time-picker', 'Time picker', 'A native time picker with keyboard entry.', input('neu-time', 'Meeting time', 'time')),
      component('colour-picker', 'Colour picker', 'A native colour control with its current hex value.', `<label class="neu-label" for="neu-colour">Accent colour<input class="neu-field" id="neu-colour" type="color" value="#536b3c" style="height:64px"></label><output for="neu-colour">#536b3c</output>`, { js: `document.querySelector('input').addEventListener('input', event => { document.querySelector('output').value = event.target.value; });` }),
      component('file-upload', 'File upload', 'A labelled file picker with native filename feedback.', `<label class="neu-label" for="neu-file">Attach a document<input class="neu-field" id="neu-file" type="file" aria-describedby="neu-file-help"></label><p class="neu-muted" id="neu-file-help">Choose a file from your device. Files stay in this demo.</p>`),
      component('dropzone', 'Drag-and-drop upload', 'A drop target with a keyboard-accessible file picker.', `<div class="neu-dropzone neu-stack"><strong>Drop your files here</strong><span class="neu-muted">or choose from your device</span><input class="neu-field" type="file" multiple aria-label="Choose files"><output aria-live="polite">No files selected</output></div>`, { css: `.neu .neu-dropzone { padding:24px; text-align:center; border:1px dashed var(--neu-muted); border-radius:16px; box-shadow:var(--neu-inset); } .neu .neu-dropzone[data-dragging] { outline:2px solid var(--neu-accent); }`, height: 310, js: `const zone = document.querySelector('.neu-dropzone');
const showFiles = files => { document.querySelector('output').value = Array.from(files).map(file => file.name).join(', ') || 'No files selected'; };
zone.addEventListener('dragover', event => { event.preventDefault(); zone.dataset.dragging = ''; });
zone.addEventListener('dragleave', () => { delete zone.dataset.dragging; });
zone.addEventListener('drop', event => { event.preventDefault(); delete zone.dataset.dragging; showFiles(event.dataTransfer.files); });
zone.querySelector('input').addEventListener('change', event => showFiles(event.target.files));` }),
      component('rating-input', 'Rating input', 'A native radio group presented as a five-star rating.', `<fieldset class="neu-rating"><legend>Your rating</legend>${[1, 2, 3, 4, 5].map(n => `<label><input type="radio" name="rating" value="${n}" ${n === 4 ? 'checked' : ''}><span aria-hidden="true">★</span><span class="neu-sr">${n} ${n === 1 ? 'star' : 'stars'}</span></label>`).join('')}</fieldset>`, { css: `.neu .neu-rating { border:0; padding:16px; border-radius:12px; box-shadow:var(--neu-raised); } .neu .neu-rating label { display:inline-block; position:relative; margin:4px; } .neu .neu-rating input { position:absolute; opacity:0; width:1px; height:1px; } .neu .neu-rating label > span:first-of-type { color:var(--neu-accent); font-size:28px; opacity:.4; } .neu .neu-rating label:has(input:checked) > span:first-of-type, .neu .neu-rating label:has(~ label input:checked) > span:first-of-type { opacity:1; } .neu .neu-rating input:focus-visible + span { outline:2px solid var(--neu-accent); }` }),
    ],
  },
  {
    id: 'forms', name: 'Form structure',
    items: [
      component('field-label', 'Field label', 'A visible label and required indicator attached to a field.', `<label class="neu-label" for="neu-company">Company name <span class="neu-muted">(required)</span><input class="neu-field" id="neu-company" required placeholder="Your studio"></label>`),
      component('helper-text', 'Helper text', 'Additional guidance associated with its input.', `<div class="neu-stack"><label class="neu-label" for="neu-username">Username<input class="neu-field" id="neu-username" type="text" placeholder="alexlee" aria-describedby="neu-username-help"></label><p class="neu-muted" id="neu-username-help">Use 3–20 letters, numbers, or underscores.</p></div>`),
      component('validation-message', 'Validation message', 'An invalid field with a programmatically associated error.', `<label class="neu-label" for="neu-invalid-email">Email address<input class="neu-field" id="neu-invalid-email" type="email" value="alex@" aria-invalid="true" aria-describedby="neu-email-error" style="border-color:#a33e30"></label><p id="neu-email-error" style="color:#a33e30;font-size:12px;margin-top:10px">Please enter a complete email address.</p>`),
      component('fieldset', 'Fieldset', 'Related form fields grouped with a descriptive legend.', `<fieldset class="neu-card neu-stack" style="border:0"><legend>Contact details</legend>${input('neu-contact-name', 'Name', 'text', 'Alex Lee')}${input('neu-contact-email', 'Email', 'email', 'alex@example.com')}</fieldset>`, { height: 320 }),
      component('input-group', 'Input group', 'A search field paired with a submit action and result feedback.', `<form class="neu-stack"><label class="neu-label" for="neu-project-search">Search your projects</label><div class="neu-row" style="flex-wrap:nowrap"><input class="neu-field" id="neu-project-search" type="search" placeholder="Project name" required><button class="neu-btn neu-primary" type="submit">Search</button></div><output aria-live="polite"></output></form>`, { js: `document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault();
  document.querySelector('output').textContent = 'Searching for “' + document.querySelector('input').value + '”…';
});` }),
    ],
  },
  {
    id: 'navigation', name: 'Navigation',
    items: [
      component('navigation-bar', 'Navigation bar', 'A horizontal navigation surface with a current-page indicator.', `<nav class="neu-card neu-row" aria-label="Demo navigation" style="justify-content:space-between;padding:14px"><strong>studio.</strong><a href="#neu-nav-work" aria-current="page">Work</a><a href="#neu-nav-about">About</a></nav><section id="neu-nav-work" style="margin-top:20px"><h3>Selected work</h3></section><section id="neu-nav-about" style="margin-top:12px"><p class="neu-muted">A small independent studio.</p></section>`),
      component('sidebar', 'Sidebar', 'A vertical set of navigation links in a raised panel.', `<nav class="neu-card neu-stack" aria-label="Workspace"><strong>WORKSPACE</strong><a class="neu-btn" href="#neu-side-projects" aria-current="page">▦ Projects</a><a href="#neu-side-tasks">☷ Tasks</a><a href="#neu-side-settings">⚙ Settings</a></nav><p class="neu-muted" id="neu-side-projects">Your projects, all in one place.</p><span id="neu-side-tasks"></span><span id="neu-side-settings"></span>`, { height: 300 }),
      component('tabs', 'Tabs', 'Keyboard-friendly tabs with linked content panels.', `<div class="neu-stack"><div class="neu-row" role="tablist" aria-label="Project information"><button class="neu-btn" type="button" role="tab" id="neu-tab-overview" aria-controls="neu-panel-overview" aria-selected="true">Overview</button><button class="neu-btn" type="button" role="tab" id="neu-tab-activity" aria-controls="neu-panel-activity" aria-selected="false" tabindex="-1">Activity</button></div><section class="neu-card" role="tabpanel" id="neu-panel-overview" aria-labelledby="neu-tab-overview" tabindex="0">A fresh space for your next idea.</section><section class="neu-card" role="tabpanel" id="neu-panel-activity" aria-labelledby="neu-tab-activity" tabindex="0" hidden>Your project was created today.</section></div>`, { js: `const tabs = [...document.querySelectorAll('[role=tab]')];
function selectTab(tab) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    const indexByKey = { ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1 };
    if (!(event.key in indexByKey)) return;
    event.preventDefault();
    const next = tabs[indexByKey[event.key]];
    selectTab(next);
    next.focus();
  });
});`, css: `.neu [role=tab][aria-selected=true] { color:var(--neu-accent); box-shadow:var(--neu-inset); }` }),
      component('breadcrumbs', 'Breadcrumbs', 'A compact navigation trail with a non-interactive current location.', `<nav aria-label="Breadcrumb"><ol class="neu-row neu-list"><li style="border:0;padding:0"><a href="#neu-breadcrumb-home">Home</a></li><li style="border:0;padding:0"><span aria-hidden="true">/ </span><a href="#neu-breadcrumb-projects">Projects</a></li><li style="border:0;padding:0" aria-current="page"><span aria-hidden="true">/ </span>Design system</li></ol></nav><div id="neu-breadcrumb-home"></div><div id="neu-breadcrumb-projects"></div>`),
      component('pagination', 'Pagination', 'Previous and next controls that respect the page boundaries.', `<nav class="neu-row" aria-label="Pagination"><button class="neu-btn" type="button" data-previous aria-label="Previous page" disabled>←</button><span aria-live="polite" data-page>Page 1 of 5</span><button class="neu-btn" type="button" data-next aria-label="Next page">→</button></nav>`, { js: `let page = 1;
const previous = document.querySelector('[data-previous]');
const next = document.querySelector('[data-next]');
function update(change) {
  page = Math.min(5, Math.max(1, page + change));
  previous.disabled = page === 1;
  next.disabled = page === 5;
  document.querySelector('[data-page]').textContent = 'Page ' + page + ' of 5';
}
previous.addEventListener('click', () => update(-1));
next.addEventListener('click', () => update(1));` }),
      component('step-indicator', 'Step indicator', 'An ordered workflow with completed, current, and upcoming steps.', `<ol class="neu-steps"><li><span>✓</span><small>Account</small></li><li aria-current="step"><span>2</span><small>Details</small></li><li><span>3</span><small>Review</small></li></ol>`, { css: `.neu .neu-steps { display:flex; justify-content:space-between; list-style:none; padding:0; gap:16px; } .neu .neu-steps li { display:grid; gap:12px; justify-items:center; color:var(--neu-muted); } .neu .neu-steps li > span { display:grid; place-items:center; width:40px; height:40px; border-radius:50%; box-shadow:var(--neu-raised); } .neu .neu-steps [aria-current] { color:var(--neu-accent); font-weight:700; } .neu .neu-steps [aria-current] > span { box-shadow:var(--neu-inset); }` }),
    ],
  },
  {
    id: 'menus', name: 'Menus',
    items: [
      component('dropdown-menu', 'Dropdown menu', 'A native disclosure menu with selectable actions.', `<div class="neu-stack"><details><summary class="neu-btn">Project actions ⌄</summary><div class="neu-menu" style="margin-top:14px">${menuItems}</div></details>${menuResult}</div>`, { js: menuJS, height: 320 }),
      component('context-menu', 'Context menu', 'Right-click actions with a visible keyboard-accessible alternative.', `<div class="neu-card neu-stack" data-context-area><p>Right-click this surface.</p><details><summary class="neu-btn">Or open actions ⌄</summary><div class="neu-menu">${menuItems}</div></details>${menuResult}</div>`, { js: menuJS + `
document.querySelector('[data-context-area]').addEventListener('contextmenu', event => {
  event.preventDefault();
  document.querySelector('details').open = true;
  document.querySelector('[data-choice]').focus();
});`, height: 350 }),
      component('nested-menu', 'Nested menu', 'A two-level navigation disclosure using native details elements.', `<div class="neu-menu neu-stack"><details open><summary>Projects</summary><div class="neu-menu" style="box-shadow:none;margin:10px"><details><summary>Design system</summary><div class="neu-menu" style="margin-top:12px">${menuItems}</div></details></div></details>${menuResult}</div>`, { js: menuJS, height: 320 }),
      component('account-menu', 'Account menu', 'An avatar-triggered account disclosure with profile actions.', `<details><summary class="neu-row" style="list-style:none">${avatar('AL')}<span>Alex Lee <span aria-hidden="true">⌄</span></span></summary><div class="neu-menu" style="margin-top:16px"><button type="button" data-choice="Profile">Your profile</button><button type="button" data-choice="Settings">Account settings</button><button type="button" data-choice="Sign out">Sign out</button></div></details>${menuResult}`, { js: menuJS, height: 340 }),
    ],
  },
  {
    id: 'overlays', name: 'Overlays',
    items: [
      component('modal-dialog', 'Modal dialog', 'A native dialog with focus containment and Escape-to-close.', overlay('neu-modal', 'Open dialog', 'A fresh perspective', 'Make a little space for your next idea.'), { js: overlayJS('neu-modal') }),
      component('confirmation-dialog', 'Confirmation dialog', 'A native confirmation dialog with cancel and confirm actions.', `${button('Archive project')}<dialog class="neu-dialog" aria-labelledby="neu-confirm-title"><form method="dialog" class="neu-stack"><h3 id="neu-confirm-title">Archive this project?</h3><p>You can restore it from your archive.</p><div class="neu-row"><button class="neu-btn" value="cancel">Cancel</button><button class="neu-btn neu-primary" value="confirm">Archive</button></div></form></dialog><p class="neu-muted" role="status"></p>`, { js: `const dialog = document.querySelector('dialog');
document.querySelector('.neu > button').addEventListener('click', () => { dialog.returnValue = ''; dialog.showModal(); });
dialog.addEventListener('close', () => {
  document.querySelector('[role=status]').textContent = dialog.returnValue === 'confirm' ? 'Project archived.' : 'Project kept.';
});` }),
      component('drawer', 'Drawer', 'A slide-out native dialog for secondary content.', overlay('neu-drawer', 'Open drawer', 'Your workspace', 'Everything you need, a little closer.', `<div class="neu-menu"><a href="#neu-drawer-projects">Projects</a><a href="#neu-drawer-settings">Settings</a></div><p id="neu-drawer-projects">3 active projects</p><p id="neu-drawer-settings" class="neu-muted">Workspace settings</p>`), { js: overlayJS('neu-drawer'), css: `.neu #neu-drawer { margin:0 0 0 auto; height:100%; max-height:100%; width:min(320px, 90%); border-radius:20px 0 0 20px; }` }),
      component('popover', 'Popover', 'A native dismissible popover anchored to its trigger.', `<button class="neu-btn" type="button" popovertarget="neu-popover">A little more info</button><div class="neu-card" id="neu-popover" popover style="max-width:260px;border:1px solid var(--neu-dark)"><h3>Made to be yours</h3><p class="neu-muted">Change the CSS variables to match your project.</p></div>`),
      component('tooltip', 'Tooltip', 'A hint revealed on both hover and keyboard focus.', `<span class="neu-tooltip-wrap"><button class="neu-btn neu-icon" type="button" aria-label="Surface information" aria-describedby="neu-tooltip">?</button><span class="neu-tooltip" id="neu-tooltip" role="tooltip">One surface. Two soft shadows.</span></span>`, { css: `.neu .neu-tooltip-wrap { display:inline-block; position:relative; } .neu .neu-tooltip { position:absolute; top:calc(100% + 12px); left:0; width:210px; padding:10px 14px; border-radius:8px; background:var(--neu-text); color:#fff; font-size:12px; visibility:hidden; } .neu .neu-tooltip-wrap:hover .neu-tooltip, .neu .neu-tooltip-wrap:focus-within .neu-tooltip { visibility:visible; }` }),
    ],
  },
  {
    id: 'feedback', name: 'Feedback',
    items: [
      component('alert', 'Alert', 'An inline message with a working dismiss action.', `<div class="neu-card neu-between" role="alert"><div><strong>A little heads-up</strong><p class="neu-muted">Your trial ends in three days.</p></div><button class="neu-btn neu-icon" type="button" aria-label="Dismiss alert">×</button></div>`, { js: `document.querySelector('button').addEventListener('click', () => { document.querySelector('[role=alert]').hidden = true; });` }),
      component('notification-banner', 'Notification banner', 'A full-width announcement with a clear action.', `<aside class="neu-card neu-stack" aria-label="Announcement"><div class="neu-row">${badge('NEW')}<strong>A softer way to build.</strong></div><p class="neu-muted">Your component collection is ready to explore.</p><a href="#neu-banner-details">See what’s new ↗</a><p class="neu-muted" id="neu-banner-details">Cards, inputs, and controls, ready to make your own.</p></aside>`, { height: 300 }),
      component('toast', 'Toast', 'A temporary live-region notification with manual dismissal.', `<div class="neu-stack">${button('Save changes', 'neu-primary')}<div class="neu-card neu-between" role="status" hidden><span>✓ Changes saved.</span><button class="neu-btn neu-icon" type="button" aria-label="Dismiss notification">×</button></div></div>`, { js: `const toast = document.querySelector('[role=status]');
let timer;
document.querySelector('.neu-stack > button').addEventListener('click', () => {
  clearTimeout(timer);
  toast.hidden = false;
  timer = setTimeout(() => { toast.hidden = true; }, 5000);
});
toast.querySelector('button').addEventListener('click', () => { clearTimeout(timer); toast.hidden = true; });` }),
      component('empty-state', 'Empty state', 'A helpful first-use message with an obvious next action.', `<div class="neu-card neu-stack" style="text-align:center;justify-items:center"><span class="neu-avatar" aria-hidden="true">＋</span><h3>A clean canvas.</h3><p class="neu-muted">Your first project starts with a small idea.</p>${button('Create project', 'neu-primary')}</div>`, { height: 330 }),
      component('success-state', 'Success state', 'A clear completion message that combines text and an icon.', `<div class="neu-card neu-stack" role="status" style="text-align:center;justify-items:center"><span class="neu-avatar" aria-hidden="true">✓</span><h3>You’re all set.</h3><p class="neu-muted">Your project is saved and ready to share.</p></div>`, { height: 290 }),
      component('error-state', 'Error state', 'An actionable error message with a retry interaction.', `<div class="neu-card neu-stack" style="text-align:center;justify-items:center"><span class="neu-avatar" aria-hidden="true" style="color:#a33e30">!</span><h3>Something went wrong.</h3><p class="neu-muted" role="status">We couldn’t load your project. Give it another try.</p>${button('Try again')}</div>`, { height: 330, js: `document.querySelector('button').addEventListener('click', () => {
  document.querySelector('h3').textContent = 'Back on track.';
  document.querySelector('[role=status]').textContent = 'Your project loaded successfully.';
  document.querySelector('button').hidden = true;
});` }),
    ],
  },
  {
    id: 'status', name: 'Status & loading',
    items: [
      component('badge', 'Badge', 'Small raised labels for counts, categories, and statuses.', `<div class="neu-row">${badge('New')}${badge('In progress')}${badge('12 updates')}</div>`),
      component('status-indicator', 'Status indicator', 'A text-labelled presence indicator that does not rely on colour alone.', `<div class="neu-card neu-row"><span class="neu-status-dot" aria-hidden="true"></span><span>All systems operational</span></div>`, { css: `.neu .neu-status-dot { width:10px; height:10px; border-radius:50%; background:var(--neu-accent); box-shadow:0 0 0 5px #536b3c15; }` }),
      component('progress-bar', 'Progress bar', 'A semantic progress element with a visible value and label.', progress),
      component('circular-progress', 'Circular progress', 'A circular metric with an accessible progress value.', `<div class="neu-ring" role="progressbar" aria-label="Weekly goal" aria-valuemin="0" aria-valuemax="100" aria-valuenow="72"><span>72%<small>Weekly goal</small></span></div>`, { css: `.neu .neu-ring { display:grid; place-items:center; width:150px; height:150px; margin:auto; padding:12px; border-radius:50%; background:conic-gradient(var(--neu-accent) 72%, var(--neu-dark) 0); box-shadow:var(--neu-raised); } .neu .neu-ring > span { display:grid; align-content:center; text-align:center; width:126px; height:126px; border-radius:50%; background:var(--neu-bg); box-shadow:var(--neu-inset); font-size:27px; font-weight:700; } .neu .neu-ring small { color:var(--neu-muted); font-size:11px; font-weight:400; }`, height: 270 }),
      component('loading-spinner', 'Loading spinner', 'A labelled loading state that respects reduced motion.', `<div class="neu-row" role="status"><span class="neu-spinner" aria-hidden="true"></span><span>Loading your workspace…</span></div>`),
      component('skeleton-loader', 'Skeleton loader', 'An animated placeholder for content that is still loading.', `<div class="neu-card neu-stack neu-skeleton" role="status" aria-label="Loading profile"><div class="neu-row"><span class="neu-avatar" aria-hidden="true"></span><span class="neu-skeleton-line" style="width:55%"></span></div><span class="neu-skeleton-line"></span><span class="neu-skeleton-line" style="width:70%"></span></div>`, { css: `.neu .neu-skeleton { animation:neu-pulse 1.8s ease-in-out infinite; } .neu .neu-skeleton-line { display:block; height:12px; border-radius:8px; background:var(--neu-dark); box-shadow:var(--neu-inset); }` }),
    ],
  },
  {
    id: 'content', name: 'Content & disclosure',
    items: [
      component('accordion', 'Accordion', 'Native exclusive disclosures for frequently asked questions.', `<div class="neu-stack"><details class="neu-card" name="neu-faq" open><summary>What is neumorphism?</summary><p class="neu-muted" style="margin-top:12px">A soft surface style made with opposing light and dark shadows.</p></details><details class="neu-card" name="neu-faq"><summary>Can I change the colours?</summary><p class="neu-muted" style="margin-top:12px">Yes. Update the CSS variables on the wrapper.</p></details></div>`, { height: 330 }),
      component('collapsible-section', 'Collapsible section', 'A standalone disclosure with native keyboard support.', `<details class="neu-card"><summary>Project details</summary><div class="neu-stack" style="margin-top:18px"><p class="neu-muted">A home for your next idea.</p><div class="neu-between"><span>Created</span><strong>Today</strong></div><div class="neu-between"><span>Visibility</span>${badge('Private')}</div></div></details>`, { height: 300 }),
      component('list', 'List', 'A grouped list of related items on a raised surface.', `<ul class="neu-card neu-list"><li class="neu-between"><span>Design exploration</span>${badge('3 files')}</li><li class="neu-between"><span>Component library</span>${badge('12 files')}</li><li class="neu-between"><span>Brand guidelines</span>${badge('5 files')}</li></ul>`),
      component('list-item', 'List item', 'An identity row with secondary text and a labelled action.', `<div class="neu-card neu-between"><div class="neu-row">${avatar('JT')}<div><strong>Jamie Taylor</strong><p class="neu-muted">jamie@example.com</p></div></div><button class="neu-btn neu-icon" type="button" aria-label="More actions for Jamie Taylor">⋯</button></div>`),
      component('carousel', 'Carousel', 'A manually controlled slide collection with live position feedback.', `<section class="neu-stack" aria-label="Design inspiration" aria-roledescription="carousel"><div class="neu-card" data-slide><h3>01. Start with a surface.</h3><p class="neu-muted">Choose a calm, neutral background.</p></div><div class="neu-card" data-slide hidden><h3>02. Find your light.</h3><p class="neu-muted">Keep one consistent light source.</p></div><div class="neu-card" data-slide hidden><h3>03. Make it yours.</h3><p class="neu-muted">Add a clear accent and readable type.</p></div><div class="neu-between"><button class="neu-btn" data-back type="button" aria-label="Previous slide">←</button><span data-slide-position aria-live="polite">1 / 3</span><button class="neu-btn" data-forward type="button" aria-label="Next slide">→</button></div></section>`, { js: `let current = 0;
const slides = [...document.querySelectorAll('[data-slide]')];
function move(change) {
  current = (current + change + slides.length) % slides.length;
  slides.forEach((slide, index) => { slide.hidden = index !== current; });
  document.querySelector('[data-slide-position]').textContent = (current + 1) + ' / ' + slides.length;
}
document.querySelector('[data-back]').addEventListener('click', () => move(-1));
document.querySelector('[data-forward]').addEventListener('click', () => move(1));` }),
    ],
  },
  {
    id: 'data', name: 'Data display',
    items: [
      component('table', 'Table', 'A responsive table with semantic row and column headers.', `<div class="neu-table-wrap">${table}</div>`, { height: 310 }),
      component('sortable-table', 'Sortable data table', 'A table with working column sorting and announced sort direction.', `<div class="neu-table-wrap"><table><thead><tr><th scope="col" aria-sort="none"><button class="neu-btn" data-column="0" type="button">Project ↕</button></th><th scope="col" aria-sort="none"><button class="neu-btn" data-column="1" type="button">Members ↕</button></th></tr></thead><tbody><tr><td>Website</td><td>8</td></tr><tr><td>Design system</td><td>12</td></tr><tr><td>Mobile app</td><td>4</td></tr></tbody></table></div>`, { height: 330, js: `document.querySelectorAll('[data-column]').forEach(button => button.addEventListener('click', () => {
  const heading = button.closest('th');
  const ascending = heading.getAttribute('aria-sort') !== 'ascending';
  document.querySelectorAll('th').forEach(th => th.setAttribute('aria-sort', 'none'));
  heading.setAttribute('aria-sort', ascending ? 'ascending' : 'descending');
  const column = Number(button.dataset.column);
  const body = document.querySelector('tbody');
  const rows = [...body.rows].sort((a, b) => a.cells[column].textContent.localeCompare(b.cells[column].textContent, undefined, { numeric: true }) * (ascending ? 1 : -1));
  rows.forEach(row => body.append(row));
}));` }),
      component('description-list', 'Description list', 'Label-and-value pairs for structured details.', `<dl class="neu-card neu-stack" style="margin:0"><div class="neu-between"><dt class="neu-muted">Project</dt><dd style="margin:0">Design system</dd></div><div class="neu-between"><dt class="neu-muted">Owner</dt><dd style="margin:0">Alex Lee</dd></div><div class="neu-between"><dt class="neu-muted">Status</dt><dd style="margin:0">${badge('In progress')}</dd></div></dl>`),
      component('timeline', 'Timeline', 'An ordered activity history with connected milestones.', `<ol class="neu-timeline"><li><strong>Project created</strong><p class="neu-muted">09:00 · A new beginning</p></li><li><strong>First design shared</strong><p class="neu-muted">11:30 · Ready for feedback</p></li><li><strong>Feedback received</strong><p class="neu-muted">14:00 · Looking good</p></li></ol>`, { height: 300, css: `.neu .neu-timeline { list-style:none; padding:0 0 0 20px; border-left:2px solid var(--neu-dark); } .neu .neu-timeline li { position:relative; padding:0 0 24px; } .neu .neu-timeline li:last-child { padding-bottom:0; } .neu .neu-timeline li::before { content:''; position:absolute; left:-27px; top:5px; width:12px; height:12px; background:var(--neu-accent); border:3px solid var(--neu-bg); border-radius:50%; box-shadow:var(--neu-raised); }` }),
      component('tree-view', 'Tree view', 'A nested file explorer built from accessible native disclosures.', `<div class="neu-card neu-stack"><details open><summary>▱ Design system</summary><ul class="neu-list" style="padding-left:20px"><li><details><summary>Components</summary><ul class="neu-list" style="padding-left:20px"><li>Button.html</li><li>Card.html</li></ul></details></li><li>Tokens.css</li><li>Readme.md</li></ul></details></div>`, { height: 320 }),
    ],
  },
  {
    id: 'identity', name: 'Identity & labels',
    items: [
      component('avatar', 'Avatar', 'Initial-based identity markers in three sizes.', `<div class="neu-row">${avatar('AL')}<span class="neu-avatar" style="width:38px;height:38px;font-size:12px">JT</span><span class="neu-avatar" style="width:30px;height:30px;font-size:10px">MK</span></div>`),
      component('avatar-group', 'Avatar group', 'Overlapping team identities with an accessible group description.', `<div class="neu-avatars" role="img" aria-label="Team members Alex Lee, Jamie Taylor, Morgan Kim, and 4 more">${avatar('AL')}${avatar('JT')}${avatar('MK')}${avatar('+4')}</div>`, { css: `.neu .neu-avatars { display:flex; padding-left:10px; } .neu .neu-avatars > span { margin-left:-10px; box-shadow:3px 3px 8px var(--neu-dark); }` }),
      component('tag', 'Tag', 'Small labels for organising related content.', `<div class="neu-row">${badge('Design')}${badge('Development')}${badge('Inspiration')}</div>`),
      component('removable-chip', 'Removable chip', 'A compact label with a working removal action.', `<div class="neu-row" data-chips><span class="neu-badge">Design <button type="button" aria-label="Remove Design">×</button></span><span class="neu-badge">Web <button type="button" aria-label="Remove Web">×</button></span></div><p class="neu-muted" role="status"></p>`, { css: `.neu [data-chips] button { border:0; background:transparent; font-size:18px; line-height:1; padding:0 2px; }`, js: `document.querySelectorAll('[data-chips] button').forEach(button => button.addEventListener('click', () => {
  const name = button.getAttribute('aria-label').replace('Remove ', '');
  const next = button.closest('span').nextElementSibling?.querySelector('button') || button.closest('span').previousElementSibling?.querySelector('button');
  button.closest('span').remove();
  document.querySelector('[role=status]').textContent = name + ' removed.';
  if (next) next.focus();
}));` }),
      component('filter-chip', 'Filter chip', 'Independent toggle buttons with an announced selection state.', `<div class="neu-row" role="group" aria-label="Filter projects"><button class="neu-btn" type="button" aria-pressed="true">Design</button><button class="neu-btn" type="button" aria-pressed="false">Code</button><button class="neu-btn" type="button" aria-pressed="false">Research</button></div>`, { js: `document.querySelectorAll('[aria-pressed]').forEach(button => button.addEventListener('click', () => {
  button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
}));` }),
    ],
  },
  {
    id: 'layout', name: 'Layout',
    items: [
      component('container', 'Container', 'A centred content boundary with a readable maximum width.', `<div class="neu-card" style="max-width:680px;margin-inline:auto"><h3>Room for your ideas.</h3><p class="neu-muted" style="margin-top:8px">A centred container keeps your content comfortably in view.</p></div>`),
      component('grid', 'Grid', 'An adaptive grid of soft surfaces that wraps on small screens.', `<div class="neu-grid"><div class="neu-card">01</div><div class="neu-card">02</div><div class="neu-card">03</div><div class="neu-card">04</div></div>`, { css: `.neu .neu-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(90px,1fr)); gap:18px; } .neu .neu-grid > div { text-align:center; color:var(--neu-muted); }` }),
      component('stack', 'Stack', 'A vertical rhythm primitive with consistent spacing.', `<div class="neu-stack"><div class="neu-card" style="padding:12px 18px">A place for everything.</div><div class="neu-card" style="padding:12px 18px">A little room between.</div><div class="neu-card" style="padding:12px 18px">A rhythm that feels right.</div></div>`, { height: 300 }),
      component('surface-panel', 'Surface panel', 'Raised and inset surfaces that share one background colour.', `<div class="neu-stack"><div class="neu-card">Raised surface</div><div class="neu-card" style="box-shadow:var(--neu-inset)">Inset surface</div></div>`),
      component('divider', 'Divider', 'A subtle inset separator with an optional section label.', `<div class="neu-stack"><p>One idea.</p><hr class="neu-divider"><p>Another perspective.</p></div>`, { css: `.neu .neu-divider { width:100%; height:2px; border:0; background:var(--neu-dark); box-shadow:0 1px 0 var(--neu-light); margin:8px 0; }` }),
    ],
  },
];

export const components = componentCategories.flatMap(category => category.items.map(item => ({
  ...item, category: category.id, categoryName: category.name,
})));

export function createComponentDocument(item, { preview = false } = {}) {
  const title = item.name.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
${preview ? '  <base href="about:srcdoc">\n' : ''}  <title>${title} · Neumorphism</title>
  <style>
    body { margin: 0; min-height: 100svh; display: grid; align-items: center; background: #e9ece5; }
${item.css}
  </style>
</head>
<body>
${item.html}${item.js ? `\n<script>\n${item.js}\n</script>` : ''}
</body>
</html>`;
}
