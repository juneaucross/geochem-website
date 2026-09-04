import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Public site images under /assets/img/ (kept in public/ for stable URLs). */
const assetImgSrc = z
  .string()
  .regex(/^\/assets\/img\/[A-Za-z0-9._-]+\.(jpe?g|png|webp|svg)$/i, {
    message: 'Expected /assets/img/<file>.(jpg|jpeg|png|webp|svg)',
  });

const imageAsset = z.object({
  src: assetImgSrc,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const imageAssetWithAlt = imageAsset.extend({
  alt: z.string().min(1),
});

const imageAssetWithCaption = imageAsset.extend({
  caption: z.string().min(1),
});

/** DOI resolver URLs (doi.org or dx.doi.org). */
const doiUrl = z
  .string()
  .url()
  .refine(
    (value) => /^(https?:\/\/)(dx\.)?doi\.org\//i.test(value),
    { message: 'DOI must be an http(s) doi.org / dx.doi.org URL' },
  );

const doiUrlOrNull = z.union([doiUrl, z.null()]);

const httpUrl = z.string().url();
const httpUrlOrNull = z.union([httpUrl, z.null()]);

const navLink = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const sectionCopy = z.object({
  id: z.string().min(1),
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  lede: z.string(),
});

const site = defineCollection({
  loader: glob({ pattern: 'site.json', base: './src/content' }),
  schema: z.object({
    brand: z.string().min(1),
    url: httpUrl,
    pi: z.object({
      name: z.string().min(1),
      email: z.string().email(),
      title: z.string().min(1),
      profileUrl: httpUrl,
      orcid: httpUrlOrNull,
    }),
    affiliation: z.object({
      department: z.string().min(1),
      institution: z.string().min(1),
      address: z.string().min(1),
      phone: z.string().min(1),
      url: httpUrl,
    }),
    hero: z.object({
      brand: z.string().min(1),
      headline: z.string().min(1),
      support: z.string().min(1),
      image: imageAssetWithAlt,
    }),
    nav: z.array(navLink).min(1),
    sections: z.array(sectionCopy).min(1),
    established: z.string().min(1),
    sourceNote: z.string().min(1),
  }),
});

const markdownPage = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
});

const about = defineCollection({
  loader: glob({ pattern: 'about.md', base: './src/content' }),
  schema: markdownPage,
});

const join = defineCollection({
  loader: glob({ pattern: 'join.md', base: './src/content' }),
  schema: markdownPage,
});

const labsStableIsotope = defineCollection({
  loader: glob({ pattern: 'labs-stable-isotope.md', base: './src/content' }),
  schema: markdownPage.extend({
    section: z.literal('labs'),
  }),
});

const labsRaman = defineCollection({
  loader: glob({ pattern: 'labs-raman.md', base: './src/content' }),
  schema: markdownPage.extend({
    section: z.literal('labs'),
  }),
});

const research = defineCollection({
  loader: glob({ pattern: 'research.json', base: './src/content' }),
  schema: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    themes: z
      .array(
        z.object({
          id: z.string().min(1),
          title: z.string().min(1),
          dois: z.array(doiUrl).min(1),
        }),
      )
      .min(1),
  }),
});

const teamLink = z.object({
  label: z.string().min(1),
  href: httpUrl,
});

const team = defineCollection({
  loader: glob({ pattern: 'team.json', base: './src/content' }),
  schema: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    groupPhoto: imageAssetWithCaption,
    members: z
      .array(
        z.object({
          name: z.string().min(1),
          role: z.string().min(1),
          status: z.enum(['current', 'alumni', 'note']),
          url: httpUrl.optional(),
          address: z.string().min(1).optional(),
          education: z.array(z.string().min(1)).optional(),
          research: z.string().min(1).optional(),
          thesis: z.string().min(1).optional(),
          note: z.string().min(1).optional(),
          links: z.array(teamLink).optional(),
        }),
      )
      .min(1),
  }),
});

const publications = defineCollection({
  loader: glob({ pattern: 'publications.json', base: './src/content' }),
  schema: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    note: z.string().min(1),
    items: z
      .array(
        z.object({
          year: z.number().int(),
          citation: z.string().min(1),
          doi: doiUrlOrNull,
          url: httpUrl.optional(),
          status: z.string().min(1).optional(),
          studentAuthors: z.array(z.string().min(1)).optional(),
        }),
      )
      .min(1),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: 'services.json', base: './src/content' }),
  schema: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    contactEmail: z.string().email(),
    intro: z.string().min(1),
    offerings: z
      .array(
        z.object({
          category: z.string().min(1),
          items: z
            .array(
              z.object({
                name: z.string().min(1),
                price: z.string().min(1),
                deliverable: z.string().min(1),
              }),
            )
            .min(1),
        }),
      )
      .min(1),
  }),
});

const updates = defineCollection({
  loader: glob({ pattern: 'updates.json', base: './src/content' }),
  schema: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    entries: z
      .array(
        z.object({
          date: z.string().min(1),
          label: z.string().min(1),
          text: z.string().min(1),
          links: z
            .array(
              z.object({
                label: z.string().min(1),
                href: httpUrl,
              }),
            )
            .optional(),
        }),
      )
      .min(1),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: 'gallery.json', base: './src/content' }),
  schema: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    note: z.string().min(1),
    items: z
      .array(
        imageAssetWithCaption.extend({
          id: z.string().min(1),
        }),
      )
      .min(1),
  }),
});

export const collections = {
  site,
  about,
  join,
  'labs-stable-isotope': labsStableIsotope,
  'labs-raman': labsRaman,
  research,
  team,
  publications,
  services,
  updates,
  gallery,
};
