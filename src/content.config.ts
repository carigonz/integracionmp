import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const services = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/data/services' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    excerpt: z.string(),
    icon: z.string(),
    order: z.number().default(0),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/data/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Equipo ElectriPro'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/testimonials' }),
  schema: z.object({
    items: z.array(
      z.object({
        name: z.string(),
        role: z.string().optional(),
        company: z.string().optional(),
        quote: z.string(),
        rating: z.number().min(1).max(5),
      })
    ),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/team' }),
  schema: z.object({
    items: z.array(
      z.object({
        name: z.string(),
        role: z.string(),
        bio: z.string(),
        email: z.string().optional(),
        certifications: z.array(z.string()).default([]),
        order: z.number().default(0),
      })
    ),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/faq' }),
  schema: z.object({
    items: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
        category: z.string().optional(),
        order: z.number().default(0),
      })
    ),
  }),
});

export const collections = { services, blog, testimonials, team, faq };
