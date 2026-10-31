import { copyFile, mkdir } from 'node:fs/promises';

// GitHub Pages serves files directly, so every page needs an actual HTML entry.
// Vite's prefixed asset URLs let both entries share the same generated bundle.
const dist = new URL('../dist/', import.meta.url);
const library = new URL('components/', dist);
await mkdir(library, { recursive: true });
await copyFile(new URL('index.html', dist), new URL('index.html', library));
