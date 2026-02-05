import { notFound } from 'next/navigation';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { commandsSource } from '@/lib/source';
import type { Metadata } from 'next';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CommandPage(props: PageProps) {
  const params = await props.params;
  const page = commandsSource.getPage([params.slug]);

  if (!page) notFound();

  const Mdx = page.data.body;
  const commandName = page.data.title || params.slug.toUpperCase().replace(/-/g, ' ');
  const { synopsis, since, dicedb_since, acl_categories } = page.data;

  return (
    <article className="w-full max-w-4xl mx-auto px-4 py-12">
      <div className="space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/commands" className="flex items-center gap-1.5 text-fd-primary hover:text-fd-primary/80 transition-colors">
            <span>&larr;</span>
            <span>Commands</span>
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">{commandName}</span>
        </nav>

        {/* Header */}
        <div className="space-y-4 border-b border-border pb-8">
          <h1 className="text-4xl md:text-5xl font-bold">
            {commandName}
          </h1>
          {synopsis && (
            <p className="text-xl text-muted-foreground">
              {synopsis}
            </p>
          )}

          {/* Version info and ACL tags */}
          {(since || dicedb_since || (acl_categories && acl_categories.length > 0)) && (
            <ul className="list-disc list-inside space-y-2 pt-2 text-sm text-fd-muted-foreground">
              {(dicedb_since || since) && (
                <li>
                  Since{' '}
                  {dicedb_since && <span className="text-fd-foreground">DiceDB {dicedb_since}</span>}
                  {dicedb_since && since && ' and '}
                  {since && <span className="text-fd-foreground">Valkey {since}</span>}
                </li>
              )}
              {acl_categories && acl_categories.length > 0 && (
                <li>
                  <span>ACL Categories:{' '}</span>
                  <span className="inline-flex flex-wrap gap-1.5 align-middle">
                    {acl_categories.map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center rounded-md bg-fd-secondary px-2 py-0.5 text-xs font-medium text-fd-secondary-foreground"
                      >
                        {cat}
                      </span>
                    ))}
                  </span>
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <Mdx components={defaultMdxComponents} />
        </div>

        {/* Back link */}
        <div className="pt-8 border-t border-border">
          <Link
            href="/commands"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Back to all commands
          </Link>
        </div>
      </div>
    </article>
  );
}

export async function generateStaticParams() {
  return commandsSource.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const page = commandsSource.getPage([params.slug]);

  if (!page) notFound();

  const commandName = page.data.title || params.slug.toUpperCase().replace(/-/g, ' ');

  return {
    title: `${commandName} - DiceDB Commands`,
    description: page.data.synopsis || page.data.description || `Documentation for the ${commandName} command in DiceDB`,
  };
}
