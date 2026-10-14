import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { Providers } from './providers';
import { TestnetBanner } from '@/components/testnet-banner';

export const metadata: Metadata = {
  title: 'Testnet Wallet',
  description: 'Non-custodial EVM wallet for testnets. Educational project.',
  robots: { index: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="min-h-dvh">
        <Providers>
          <TestnetBanner />
          <main className="container max-w-md py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
