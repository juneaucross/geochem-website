import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri';
import type { MarkdownRenderer } from '@astrojs/internal-helpers/markdown';

let processor: MarkdownRenderer | undefined;

/** Astro’s markdown pipeline (Sätteri) for body fragments after ## splits. */
export async function renderMarkdown(md: string): Promise<string> {
  processor ??= await createSatteriMarkdownProcessor({ syntaxHighlight: false });
  const { code } = await processor.render(String(md || '').trim());
  return code;
}

export type MdSection = { title: string | null; body: string };

/** Split markdown on ## headings (first block may lack a heading). */
export function splitMdSections(md: string): MdSection[] {
  const text = String(md || '').trim();
  if (!text) return [];
  const parts = text.split(/\n(?=## )/);
  const sections: MdSection[] = [];
  for (const part of parts) {
    const match = part.match(/^##\s+(.+)\n?([\s\S]*)$/);
    if (match) {
      sections.push({ title: match[1].trim(), body: match[2].trim() });
    } else if (part.trim()) {
      sections.push({ title: null, body: part.trim() });
    }
  }
  return sections;
}

export function stripLeadingTitle(md: string, title: string): string {
  if (!md || !title) return md || '';
  const re = new RegExp(
    `^##\\s+${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\n+`,
    'i',
  );
  return md.replace(re, '').trim();
}
