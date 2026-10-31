# Neumorphic design creator: review and implementation plan

## Maintainability follow-up

The subsequent cleanup replaces styled-components with colocated CSS, extracts
settings/URL, clipboard, and preview-sizing hooks, and replaces Vitest with
Jest and React Testing Library. Every one of the 12 React components has a
dedicated test suite. The current checks pass: 84 tests in 15 suites, 100%
measured JavaScript coverage, lint, and production build. See the README for
the current architecture and commands; the original plan below records the
earlier design and implementation decisions.

## Implementation status

Implemented as a single-surface design creator on 31 October 2026. The scope
contains no component gallery, button/card previews, accounts, or saved designs.
The shared generator, all four surface styles and light directions, validated
colour and numeric controls, geometry shortcuts, reset, colour hash links, CSS
copying, and responsive preview scaling are complete.

The finished desktop layout puts CSS below the preview and settings on the
right, keeping the surface and editing controls visible together. Mobile stacks
the preview, settings, and CSS. Light controls are part of the preview rather
than a separate component file.

Verification: lint and production build pass, all 36 tests pass, browser checks
at 320/375/768/1280/1440px show no horizontal page overflow, extreme selected
dimensions remain contained, and copied CSS matches the displayed output.

## Recommendation

Extend the existing app into a focused, single-page CSS creator. Keep React,
Vite, styled-components, the `color` package, and the current testing setup.
The project already has a working foundation; it needs a complete creation and
export workflow rather than a framework rewrite.

The intended workflow is: choose a base colour, adjust the surface and lighting,
inspect the live result, and copy the CSS into another project.

Reference inspected: [Neumorphism.io](https://neumorphism.io/#e0e0e0), including
its rendered generator UI, on 31 October 2026. The reference provides a colour
picker and hex input, size/radius/distance/intensity/blur controls, four surface
styles, corner light-source controls, and a CSS panel with a copy button. Its
examples gallery and promotional sections are separate from the core workflow.

## Current project assessment

| Area | Current implementation | Planned change |
| --- | --- | --- |
| Foundation | React, Vite, styled-components, `color`, Vitest, Testing Library | Retain the current stack |
| State | One settings object in `Generator.jsx` | Extend with surface style and light direction |
| Colour | Native colour picker and a read-only hex value | Add validated, editable hex input |
| Dimensions | Square size and border-radius sliders | Retain; add precise numeric input and square/circle options |
| Shadows | Live distance, blur, and intensity; opposing light/dark shadows | Extract shared calculations and support all light directions |
| Surface | Flat raised surface only | Add concave, convex, and pressed styles |
| Output | Visual preview only | Add generated CSS and clipboard feedback |
| Layout | Wrapping flex layout with a control panel | Add header, deliberate desktop/mobile layouts, and a more useful preview stage |
| Persistence | No URL or saved settings handling | Add reference-compatible colour hash in the initial release; consider full settings sharing later |
| Verification | Five behaviour tests plus lint/build scripts | Extend coverage around generation, inputs, and export |

### What is already good

- `src/components/generator/Generator.jsx` owns settings in one place and derives
  shadow colours instead of maintaining duplicate colour state.
- `Configuration.jsx`, `Preview.jsx`, `ColourPicker.jsx`, and `RangeControl.jsx`
  provide a useful starting component structure.
- Controls have labels and keyboard support, and styling uses transient props
  to avoid leaking presentation values into DOM attributes.
- Changing distance sets blur to twice the distance; blur can then be changed
  independently. Existing tests verify this behaviour.

### Issues to address

- There is no CSS export, so users currently cannot complete the main creator
  workflow from the app.
- Shadow offsets are hard-coded to one light direction in `Preview.jsx`.
- `Preview.jsx` constructs styles directly. Adding a separate CSS exporter with
  its own calculations would risk differences between the preview and copied CSS.
- The preview wrapper has a 550px minimum height, 64px padding, and scrolling.
  The shape itself cannot shrink. Rework this for smaller screens and large
  selected sizes; the present desktop view was inspected, but mobile behaviour
  has not been verified in a resized browser.
- The radius range is 10–200px. This excludes a sharp square and cannot reach
  a true circle when the selected square is larger than 400px.
- Fixed dark text and focus colours sit against arbitrary selected background
  colours. The control panel also changes elevation with the preview's distance
  and intensity, making the editing UI less predictable.
- The default colour is teal (`#6ebfb5`), whereas a neutral initial canvas would
  make the light and dark shadows easier to compare with the reference.

## Initial release scope

Build the complete generator first:

1. Live preview on a canvas with the same base colour as the generated surface.
2. Native colour picker plus editable hex value.
3. Size, radius, distance, intensity, and blur controls, with numeric entry.
4. Flat, concave, convex, and pressed surface styles.
5. Four light-source positions: top-left, top-right, bottom-left, bottom-right.
6. Generated CSS with a copy button, success feedback, and a manual-copy path
   when clipboard access fails.
7. Reset, a neutral default colour, and colour hash support such as `#e0e0e0`.
8. Responsive layout, clear selected states, labels, and keyboard navigation.

Keep saved collections, a large examples gallery, framework-specific exports,
image export, accounts, and cloud storage outside this initial scope. The core
creator can run entirely in the browser without a backend.

## Proposed interface

- **Header:** product name, one-line purpose, and Reset.
- **Desktop workspace:** a large preview stage on the left, with controls and
  generated CSS on the right. Keep the result and its controls visible together
  at ordinary desktop viewport sizes.
- **Preview stage:** selected surface centred on its matching base colour, with
  four clearly labelled light-source buttons around it. Show the selected size.
- **Controls:** colour, dimensions, lighting, and a four-option surface selector.
  Use plain-language labels and retain visible numeric values.
- **CSS panel:** selectable, readable monospace output and a clearly placed
  Copy CSS button. Include dimensions so the exported shape can be reproduced.
- **Mobile:** stack preview, controls, and CSS. Fit or scale the display of large
  shapes while preserving their actual generated dimensions; avoid horizontal
  page scrolling and clipped light-source controls.

Use restrained neumorphic styling for the editor itself. Give the controls
stable readable contrast and fixed elevation, independent of the preview's
shadow settings. Selection and focus should remain clear at every colour.

## Implementation sequence

### 1. Create one style-generation module

Add `src/lib/neumorphism.js` and a settings definition, such as
`src/lib/generatorSettings.js`.

- Define defaults, valid surface styles, light directions, and numeric limits.
- Start with `#e0e0e0`, size 250px, radius 50px, distance 20px, blur 40px,
  intensity 0.15, a flat surface, and top-left lighting. The 40px default blur
  stays consistent with the app's existing distance-times-two rule; visual
  similarity does not require matching every reference default.
- Extend settings with `surface` and `lightDirection`.
- Create a pure `createNeumorphicStyle(settings)` function that returns the
  generated width, height, radius, background, and box-shadow values.
- Derive opposing shadow offsets from light direction. Use a solid background
  for flat and pressed surfaces; use directional gradients for convex and
  concave surfaces. Pressed surfaces use inset shadows. Rotate gradients with
  the chosen light source.
- Reuse the existing colour library for valid, clamped shadow and gradient
  colours. Check saturated colours and black/white boundaries explicitly.
- Add a formatter that serializes the resulting style values into a CSS class.
  Both preview and output must consume these same values.

Keep state changes in `Generator.jsx`. A reducer or state library is not needed
for this amount of state. Preserve the existing distance/blur interaction.

**Completion condition:** all four surface styles and four light directions can
be represented by the same generator, without separate export calculations.

### 2. Add surface and lighting controls

- Add `SurfaceSelector.jsx` with labelled options for Flat, Concave, Convex,
  and Pressed; simple inline SVG profiles can supplement the text.
- Add `LightSourceControl.jsx` with four native buttons and a visible selected
  state. Expose the selected state to assistive technology.
- Update `Preview.jsx` to consume the generated styles, including `background`
  rather than only `backgroundColor`, so gradients work.
- Keep light direction and surface style independent: switching a mode should
  preserve size, colour, and lighting choices.

**Completion condition:** changing any of the four modes or light positions
updates the live surface correctly and is keyboard accessible.

### 3. Complete the controls and export workflow

- Extend `ColourPicker.jsx` with a labelled hex text field. Allow partial text
  while editing, apply only valid colours, normalize valid short/full hex
  values, and show a useful validation message without crashing the preview.
- Extend `RangeControl.jsx` with synchronized numeric input and shared bounds.
  Allow temporary empty input while editing; clamp or restore on commit.
- Allow radius zero and enough radius for a circle at every supported size;
  clamp radius coherently when size decreases. Add square/circle shortcuts.
- Add `CodeOutput.jsx` with generated CSS, Copy CSS, and an announced success
  or failure message. Keep the code selectable when clipboard access fails.
- Include width, height, border radius, background, and box shadow. Explain
  briefly that the surrounding surface should use the selected base colour.
- Add Reset so it restores every setting and updates all controls and output.
- Read valid colour hashes on initial load and hash changes, and update the
  hash without creating a browser history entry for every picker movement.
  Invalid hashes should fall back safely to the default colour.

**Completion condition:** a user can create a result, paste the CSS into a
matching-colour container, and reproduce the selected surface.

### 4. Refine layout and interaction

- Replace the implicit flex wrapping with an explicit responsive workspace.
- Move the main heading into a small page header and group control sections.
- Give the preview a bounded stage with enough shadow space. Large dimensions
  should not push the rest of the app off-screen.
- Keep control surfaces, text contrast, focus outlines, and selected states
  readable for light, dark, saturated, black, and white base colours.
- Use short transitions where helpful and respect reduced-motion preferences.
- Update the page description, manifest, and README to describe the creator
  and its export workflow.

**Completion condition:** the full workflow works at 320px, 375px, 768px,
1280px, and 1440px widths, without horizontal page overflow.

### 5. Verify the complete workflow

- Unit-test representative combinations of surface style and direction, inset
  shadows, gradient orientation, numeric bounds, and colour boundary values.
- Verify that CSS serialization preserves the values used by the preview.
- Extend the existing component tests for mode selection, light direction,
  valid/invalid hex input, numeric input, reset, and colour hash handling.
- Exercise clipboard success and failure with mocked browser APIs.
- Retain coverage for the existing distance/blur behaviour and labelled inputs.
- Run `npm run lint`, `npm test`, and `npm run build`.
- Manually inspect desktop/mobile layouts, keyboard navigation, long CSS
  values, and pasted output in a matching-colour container. Real-browser visual
  checks are needed because the component test environment does not render
  shadows or gradients.

## Suggested file responsibilities

| File | Responsibility |
| --- | --- |
| `src/components/generator/Generator.jsx` | Settings state, derived styles, reset, URL integration |
| `src/components/generator/Configuration.jsx` | Group and connect editing controls |
| `src/components/generator/Preview.jsx` | Render the surface and responsive preview stage |
| `src/components/common/ColourPicker.jsx` | Colour picker, hex editing, validation |
| `src/components/common/RangeControl.jsx` | Synchronized slider and numeric input |
| `src/components/generator/SurfaceSelector.jsx` (new) | Four surface styles |
| `src/components/generator/LightSourceControl.jsx` (new) | Four light positions |
| `src/components/generator/CodeOutput.jsx` (new) | CSS display, copying, feedback |
| `src/lib/generatorSettings.js` (new) | Defaults, limits, settings validation |
| `src/lib/neumorphism.js` (new) | Pure style generation and CSS formatting |
| `src/index.css`, `src/styling/styled.js` | Global readability and shared responsive styling |

Keep tests alongside the relevant module or in the existing app test file.
Avoid introducing extra abstraction or a component library unless the actual
implementation reveals a need.

## Optional follow-up work

Only if requested later, consider full-settings share URLs or separate
width/height controls. Keep the product focused on a single surface creator.

## Review verification and working-tree notes

- Inspected the current source files and rendered desktop app, and compared
  them with the rendered reference generator.
- `npm run lint`: passed.
- `npm test`: passed, 5 tests in 1 file.
- `npm run build`: passed.
- The review shell runs Node 22.17.0, below the minimum declared in
  `package.json`. Checks passed in this environment, but implementation should
  use a supported Node version, preferably the Node 24 version selected by
  `.nvmrc`.
- The current project already includes a substantial CRA-to-Vite migration and
  removal of previously tracked dependencies. Build on these current files and
  preserve that modernization work.
- The initial review added this plan; the implementation status above records
  the subsequent application changes and final verification.
