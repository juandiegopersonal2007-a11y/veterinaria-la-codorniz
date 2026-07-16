// apps/web/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { FloatingHelp } from '@/components/public/floating-help';
import { Navbar } from '@/components/public/navbar';
import { Footer } from '@/components/public/footer';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'La Codorniz - Tienda de Mascotas',
    template: '%s | La Codorniz'
  },
  description: 'Tu tienda de mascotas favorita en Tecomán, Colima. Alimentos, juguetes, accesorios y estética canina y felina.',
  keywords: ['tienda de mascotas', 'Tecomán', 'alimentos para perros', 'alimentos para gatos', 'estética canina', 'juguetes para mascotas'],
  authors: [{ name: 'La Codorniz' }],
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <FloatingHelp />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
