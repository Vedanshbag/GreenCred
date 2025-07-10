import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GreenCred - Your Carbon Offset Wallet',
  description: 'Track your carbon footprint and earn blockchain rewards.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-50 text-gray-800">
          {children}
        </main>
      </body>
    </html>
  );
}
