import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const apps = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/apps' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      tagline: z.string(),
      /** ~150 chars, used for meta description and the lead "answer" paragraph. */
      description: z.string().max(170),
      type: z.enum(['game', 'app']).default('game'),
      genre: z.string(),
      platforms: z.array(z.enum(['ios', 'android'])).min(1),
      status: z.enum(['coming-soon', 'live']).default('coming-soon'),
      price: z.string().default('Free'),
      appStoreUrl: z.url().optional(),
      playStoreUrl: z.url().optional(),
      releaseDate: z.coerce.date().optional(),
      icon: image(),
      /** Wide key art shown as a banner on the project page (any aspect ratio). */
      cover: z.object({ src: image(), alt: z.string() }).optional(),
      /** Portrait phone screenshots (ideally 1290×2796). */
      screenshots: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      accent: z.string().optional(),
      /** Path under /public, e.g. /og/my-game.png (1200x630). Falls back to the site default. */
      ogImage: z.string().optional(),
      features: z.array(z.object({ title: z.string(), body: z.string() })).default([]),
      faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
      support: z
        .object({
          lastUpdated: z.coerce.date(),
          minIos: z.string().optional(),
          minAndroid: z.string().optional(),
          /** Troubleshooting steps. Falls back to generic tips when empty. */
          tips: z.array(z.string()).default([]),
        }),
      privacy: z.object({
        lastUpdated: z.coerce.date(),
        dataCollected: z.array(z.object({ type: z.string(), purpose: z.string() })).default([]),
        thirdParties: z.array(z.object({ name: z.string(), url: z.url(), purpose: z.string().optional() })).default([]),
        /** Overrides the default "Data retention and deletion" paragraph. */
        retention: z.string().optional(),
      }),
      order: z.number().default(0),
    }),
});

export const collections = { apps };
