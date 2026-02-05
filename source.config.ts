import { defineConfig, defineDocs, defineCollections, frontmatterSchema, metaSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export const blogPosts = defineDocs({
  dir: 'content/blog',
  docs: {
    schema: frontmatterSchema.extend({
      author: z.string(),
      date: z.string().date().or(z.date()),
    }),
  },
});

// Schema for commands - title is optional since it's derived from filename
const commandSchema = z.object({
  title: z.string().optional().default(''),
  description: z.string().optional().default(''),
  synopsis: z.string().optional().default(''),
  since: z.string().optional().default(''),
  dicedb_since: z.string().optional().default(''),
  acl_categories: z.array(z.string()).optional().default([]),
  icon: z.string().optional(),
  full: z.boolean().optional(),
});

export const commands = defineDocs({
  dir: 'content/commands',
  docs: {
    schema: commandSchema,
  },
});

const versionSchema = z.object({
  title: z.string().optional().default(''),
  description: z.string().optional().default(''),
  version: z.string(),
  valkey_version: z.string(),
  icon: z.string().optional(),
  full: z.boolean().optional(),
});

export const versions = defineDocs({
  dir: 'content/versions',
  docs: {
    schema: versionSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
