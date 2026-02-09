import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center px-4 pt-16 pb-12">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <div className="flex justify-center">
            <Image
              src="https://avatars.githubusercontent.com/u/112580013?s=400&u=cc152e1bb504e69a4d3bf28ec39731362a0a03c3&v=4"
              alt="DiceDB Logo"
              width={100}
              height={100}
              className="rounded-2xl shadow-lg"
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight">
              DiceDB
            </h1>
            <p className="text-2xl md:text-3xl font-light text-muted-foreground max-w-3xl mx-auto tracking-wide">
              Open-source, low-latency key/value engine built on Valkey with hierarchical storage tiers.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Link
              href="/docs"
              className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started →
            </Link>
            <a
              href="https://github.com/dicedb/dicedb"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-md hover:bg-secondary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              GitHub
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-16">
            <div
              rel="noopener noreferrer"
              className="space-y-3 p-8 rounded-xl border border-border/50 hover:border-border transition-all bg-gradient-to-br from-transparent to-yellow-500/10 hover:to-yellow-500/20 group text-left"
            >
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">Multi-tiered</h3>
              <p className="text-muted-foreground leading-relaxed font-light">
                Automatically spills evicted keys to disk and restores them on cache misses.
              </p>
            </div>
            <div className="space-y-3 p-8 rounded-xl border border-border/50 hover:border-border transition-all bg-gradient-to-br from-transparent to-blue-500/10 hover:to-blue-500/20 group text-left">
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">Rich Data Structures</h3>
              <p className="text-muted-foreground leading-relaxed font-light">
                Supports strings, hashes, lists, sets, sorted sets, and advanced data structures like HyperLogLog.
              </p>
            </div>
            <div className="space-y-3 p-8 rounded-xl border border-border/50 hover:border-border transition-all bg-gradient-to-br from-transparent to-green-500/10 hover:to-green-500/20 group text-left">
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">High Performance</h3>
              <p className="text-muted-foreground leading-relaxed font-light">
                High-performance key/value datastore supporting caching, message queues, and diverse workloads.
              </p>
            </div>
            <div
              className="space-y-3 p-8 rounded-xl border border-border/50 hover:border-border transition-all bg-gradient-to-br from-transparent to-red-500/10 hover:to-red-500/20 group text-left"
            >
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">Built on Valkey</h3>
              <p className="text-muted-foreground leading-relaxed font-light">
                Extends Valkey with Redis-compatible capabilities. Works seamlessly with all Redis and Valkey SDKs.
              </p>
            </div>
            <div className="space-y-3 p-8 rounded-xl border border-border/50 hover:border-border transition-all bg-gradient-to-br from-transparent to-purple-500/10 hover:to-purple-500/20 group text-left">
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">Open Source</h3>
              <p className="text-muted-foreground leading-relaxed font-light">
                Free and open source under BSD-3 Clause License.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}
