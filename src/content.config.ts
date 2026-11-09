import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    dwg: z.string(),                    // drawing number, e.g. "JW-101"
    discipline: z.enum(['research', 'software', 'build']),
    year: z.string(),                   // "2019" or "2024–2026"
    status: z.enum(['released', 'in-progress', 'placeholder']),
    rev: z.string().default('A'),
    summary: z.string(),                // one sentence, <= 140 chars
    role: z.string().optional(),
    stack: z.array(z.string()).default([]),
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    figure: z.string().optional(),      // id of a figure in src/data/figures.json
    order: z.number().default(100),
    featured: z.boolean().default(false),
  }),
});

export const collections = { work };
