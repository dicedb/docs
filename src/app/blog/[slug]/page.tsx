import { notFound } from 'next/navigation';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { blog } from '@/lib/source';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage(props: PageProps) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  const Mdx = page.data.body;

  return (
    <article className="w-full max-w-4xl mx-auto px-4 py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4 border-b border-border pb-8">
          <h1 className="text-4xl md:text-5xl font-bold">{page.data.title}</h1>
          {page.data.description && (
            <p className="text-xl text-muted-foreground">
              {page.data.description}
            </p>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{page.data.author}</span>
            <span>·</span>
            <time dateTime={page.data.date.toString()}>
              {new Date(page.data.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </div>

        {/* Table of Contents */}
        {page.data.toc && page.data.toc.length > 0 && (
          <div className="rounded-lg border border-border p-4">
            <InlineTOC items={page.data.toc} />
          </div>
        )}

        {/* Content */}
        <div className="blog-content">
          <Mdx components={defaultMdxComponents} />
        </div>
      </div>
    </article>
  );
}

export async function generateStaticParams() {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
