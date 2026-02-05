import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const { links, ...options } = baseOptions();
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...options}
      links={links?.filter(
        (link) =>
          link.text !== 'Blog' &&
          link.text !== 'Versions' &&
          link.text !== 'Commands',
      )}
    >
      {children}
    </DocsLayout>
  );
}
