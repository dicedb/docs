import defaultMdxComponents from 'fumadocs-ui/mdx';
import { versionsSource } from '@/lib/source';

export default async function VersionsPage() {
  const allVersions = versionsSource.getPages().sort((a, b) => {
    // Sort descending so newest version is first
    return b.data.version.localeCompare(a.data.version, undefined, {
      numeric: true,
    });
  });

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Versions</h1>
          <p className="text-lg text-muted-foreground">
            DiceDB release history and changelog
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-sm font-semibold">
                  DiceDB Version
                </th>
                <th className="px-6 py-4 text-sm font-semibold">
                  Based on Valkey
                </th>
                <th className="px-6 py-4 text-sm font-semibold">
                  What&apos;s New
                </th>
              </tr>
            </thead>
            <tbody>
              {allVersions.map(async (v) => {
                const Mdx = v.data.body;
                return (
                  <tr
                    key={v.data.version}
                    className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono font-medium align-top">
                      {v.data.version}
                    </td>
                    <td className="px-6 py-4 font-mono text-muted-foreground align-top">
                      {v.data.valkey_version}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground prose prose-sm prose-neutral dark:prose-invert max-w-none">
                      <Mdx components={defaultMdxComponents} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
