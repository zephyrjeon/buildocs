import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '../../providers/theme-provider';
import '../globals.css';
import { ModalProvider } from '../../providers/modal-provider';
import { RootStoreContext, rootStore } from '@/stores/RootStore';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Buildocs',
  description: 'Documentation made eaiest with Buildocs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {/* <RootStoreContext.Provider value={rootStore}> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="buildocs-theme"
        >
          <ModalProvider />
          {children}
        </ThemeProvider>
        {/* </RootStoreContext.Provider> */}
      </body>
    </html>
  );
}
