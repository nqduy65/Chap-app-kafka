'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { ApolloProvider } from '@apollo/client';
import { client } from '@/graphql/client';
import { Provider, useSocketStore } from '@/zustand/store';
import { CookiesProvider } from 'next-client-cookies/server';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloProvider client={client}>
          <Provider createStore={useSocketStore}>{children}</Provider>
        </ApolloProvider>
      </body>
    </html>
  );
}
