import { Footer } from '@/components/footer';
import Image from 'next/image';
import { BookOpen, Newspaper, Terminal, Tag } from 'lucide-react';

export function baseOptions() {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2">
          <Image
            src="https://avatars.githubusercontent.com/u/112580013?s=400&u=cc152e1bb504e69a4d3bf28ec39731362a0a03c3&v=4"
            alt="DiceDB"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="font-bold text-foreground text-lg">DiceDB</span>
        </div>
      ),
    },
    links: [
      {
        text: 'Docs',
        url: '/docs',
        icon: <BookOpen className="size-4" />,
      },
      {
        text: 'Commands',
        url: '/commands',
        icon: <Terminal className="size-4" />,
      },
      {
        text: 'Blog',
        url: '/blog',
        icon: <Newspaper className="size-4" />,
      },
      {
        text: 'Versions',
        url: '/versions',
        icon: <Tag className="size-4" />,
      },
    ],
    githubUrl: 'https://github.com/dicedb/dicedb',
    footer: <Footer />,
  };
}
