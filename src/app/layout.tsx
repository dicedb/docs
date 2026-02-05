import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Assistant } from 'next/font/google';
import type { Metadata } from 'next';

const assistant = Assistant({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'DiceDB',
  description: 'High-performance key/value datastore built on Valkey with Redis compatibility',
  icons: {
    icon: 'https://avatars.githubusercontent.com/u/112580013?s=400&u=cc152e1bb504e69a4d3bf28ec39731362a0a03c3&v=4',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`dark ${assistant.className}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          theme={{
            enabled: false,
            forcedTheme: 'dark',
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
