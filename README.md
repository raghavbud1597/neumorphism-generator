# Neumorphism Generator

A React app for experimenting with neumorphic colours, dimensions, and shadows.

## Getting started

Use Node.js 24.15 or newer in the Node 24 release line (`nvm install` and
`nvm use` read `.nvmrc`). Node 22.22.2+ and Node 26+ are also supported.

```sh
npm ci
npm start
```

Open the local URL printed by Vite, usually http://localhost:5173.

## Commands

| Command | Purpose |
| --- | --- |
| `npm start` / `npm run dev` | Start Vite with hot module replacement |
| `npm run build` | Build the production app into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check JavaScript, React Hooks, and Fast Refresh rules |
| `npm test` | Run component tests once |
| `npm run test:watch` | Run tests in watch mode |

## Development

The app uses React's `createRoot` API and Strict Mode. Generator settings have
one source of truth; shadow colours are calculated from the selected colour
and intensity. Changing distance also sets blur to twice the distance, and blur
can then be adjusted independently. Controls have accessible labels and use
numeric values for range settings. The colour control uses the browser's native
picker.

Styling uses styled-components transient props (`$` prefix) to keep presentation
values out of DOM attributes. JSX components use the `.jsx` extension.

Vite replaces Create React App, and Vitest plus Testing Library test the app's
behaviour. Test and build tooling belong in `devDependencies`.

Use npm and commit `package-lock.json` when dependencies change. Dependencies,
build output, coverage, and local environment files are ignored by Git.
Install dependencies with `npm ci` after cloning; `node_modules` is not tracked.
