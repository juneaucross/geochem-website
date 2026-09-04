/**
 * Prefix a site-root path with Astro `base` (`import.meta.env.BASE_URL`).
 * Leaves absolute http(s)/data URLs unchanged. Idempotent if already prefixed.
 */
export function withBase(path: string): string {
  if (!path || /^https?:\/\//i.test(path) || path.startsWith('data:')) {
    return path;
  }
  const base = import.meta.env.BASE_URL;
  if (path.startsWith(base)) return path;
  return path.startsWith('/') ? `${base}${path.slice(1)}` : `${base}${path}`;
}
