/** Short label for a DOI resolver URL. */
export function doiLabel(url: string): string {
  try {
    const u = new URL(url);
    return u.pathname.replace(/^\/+/, '') || url;
  } catch {
    return url.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '');
  }
}
