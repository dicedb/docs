import Link from 'next/link';
import { blog } from '@/lib/source';

export default function BlogPage() {
  const posts = blog.getPages().sort((a, b) => {
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });

  const gradients = [
    'bg-gradient-to-br from-transparent to-yellow-500/10 hover:to-yellow-500/20',
    'bg-gradient-to-br from-transparent to-blue-500/10 hover:to-blue-500/20',
    'bg-gradient-to-br from-transparent to-green-500/10 hover:to-green-500/20',
    'bg-gradient-to-br from-transparent to-red-500/10 hover:to-red-500/20',
    'bg-gradient-to-br from-transparent to-purple-500/10 hover:to-purple-500/20',
  ];

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Blog</h1>
          <p className="text-lg text-muted-foreground">
            Latest updates and insights about DiceDB
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post, index) => (
            <Link
              key={post.url}
              href={post.url}
              className={`group space-y-3 p-6 rounded-xl border border-border hover:border-border transition-all ${gradients[index % gradients.length]}`}
            >
              <div className="space-y-2">
                <h2 className="text-xl font-bold group-hover:text-primary transition-colors">
                  {post.data.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {new Date(post.data.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  {' · '}
                  {post.data.author}
                </p>
              </div>
              {post.data.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {post.data.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
