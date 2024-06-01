import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ModalProvider } from '../providers/ModalProvider';
import { ThemeProvider } from '../providers/ThemeProvider';
import './globals.css';
import { Toaster } from 'sonner';

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="buildocs-theme"
        >
          <ModalProvider />
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
