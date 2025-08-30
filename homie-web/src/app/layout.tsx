import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import Navigation from '../components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Homie - Find Your Home',
  description: 'Find apartments, houses, and roommates in your area',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
        <head>
          <link rel="icon" href="/assets/colored-logo.png" type="image/png" />
        </head>
        <body className={inter.className}>
          <AppProvider>
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <main className="pb-16 md:pb-0">
                {children}
              </main>
            </div>
          </AppProvider>
        </body>
      </html>
  );
}
