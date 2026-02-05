'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

interface Command {
  slug: string;
  url: string;
  description: string;
}

interface CommandsListProps {
  commands: Command[];
}

export function CommandsList({ commands }: CommandsListProps) {
  const [search, setSearch] = useState('');

  const filteredCommands = useMemo(() => {
    if (!search) return commands;
    const searchLower = search.toLowerCase();
    return commands.filter((cmd) => {
      return (
        cmd.slug.toLowerCase().includes(searchLower) ||
        cmd.description.toLowerCase().includes(searchLower)
      );
    });
  }, [commands, search]);

  // Group commands by first letter
  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {};
    filteredCommands.forEach((cmd) => {
      const firstLetter = cmd.slug.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  const sortedGroups = Object.keys(groupedCommands).sort();

  return (
    <>
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search commands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {search && (
          <span className="ml-4 text-sm text-muted-foreground">
            {filteredCommands.length} result
            {filteredCommands.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Commands grouped by letter */}
      <div className="space-y-8">
        {sortedGroups.map((letter) => (
          <div key={letter} className="space-y-3">
            <h2 className="text-xl font-bold text-primary border-b border-border pb-2">
              {letter}
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {groupedCommands[letter].map((cmd) => {
                const displayName = cmd.slug.toUpperCase().replace(/-/g, ' ');
                return (
                  <Link
                    key={cmd.url}
                    href={cmd.url}
                    className="group flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all"
                  >
                    <code className="text-sm font-mono font-semibold text-primary group-hover:text-primary">
                      {displayName}
                    </code>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {filteredCommands.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No commands found matching &quot;{search}&quot;
        </div>
      )}
    </>
  );
}
