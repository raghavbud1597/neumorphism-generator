export function createSitePaths(base = '/') {
  const prefix = base.replace(/^\/+|\/+$/g, '');
  const home = prefix ? `/${prefix}/` : '/';
  const components = `${home}components/`;

  return { home, components, styleGuide: `${components}#style-guide` };
}

const base = import.meta.env?.BASE_URL ?? '/';
export const sitePaths = createSitePaths(base);

export function isComponentLibraryPath(pathname, appBase = base) {
  return pathname.replace(/\/+$/, '') === createSitePaths(appBase).components.replace(/\/$/, '');
}
