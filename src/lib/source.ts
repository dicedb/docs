import { docs, blogPosts, commands, versions } from 'fumadocs-mdx:collections/server';
import { type InferPageType, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const blog = loader({
  baseUrl: '/blog',
  source: blogPosts.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const commandsSource = loader({
  baseUrl: '/commands',
  source: commands.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const versionsSource = loader({
  baseUrl: '/versions',
  source: versions.toFumadocsSource(),
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title}

${processed}`;
}
