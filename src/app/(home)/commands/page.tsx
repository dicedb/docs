import { commandsSource } from '@/lib/source';
import { CommandsList } from './commands-list';

export default function CommandsPage() {
  const allCommands = commandsSource.getPages().sort((a, b) => {
    const nameA = a.slugs[0] || '';
    const nameB = b.slugs[0] || '';
    return nameA.localeCompare(nameB);
  });

  // Extract the data we need for the client component
  const commandsData = allCommands.map((cmd) => ({
    slug: cmd.slugs[0] || '',
    url: cmd.url,
    description: cmd.data.description || '',
  }));

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Commands</h1>
          <p className="text-muted-foreground text-lg">

            DiceDB is built on top of <a
              href="https://valkey.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Valkey
            </a>. In addition to commands that have been <a
              href="/docs/commands/valkey"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >inherited from Valkey</a>, DiceDB also introduces a set of its own
          commands listed below. These commands are designed to support
          capabilities that are unique to DiceDB.
          </p>
        </div>
        <CommandsList commands={commandsData} />
      </div>
    </main>
  );
}
