// apps/web/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { FloatingHelp } from '@/components/public/floating-help';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Veterinaria La Codorniz | Cuidamos a tu mascota como familia',
  description: 'Clínica veterinaria líder en Tecomán, Colima. Consultas, estética, cirugías y más.',
  keywords: ['veterinaria', 'Tecomán', 'clínica veterinaria', 'mascotas', 'La Codorniz'],
  authors: [{ name: 'Veterinaria La Codorniz' }],
  openGraph: {
    title: 'Veterinaria La Codorniz',
    description: 'Cuidamos a tu mascota como familia.',
    url: 'https://veterinariacodorniz.com',
    siteName: 'Veterinaria La Codorniz',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    locale: 'es_MX',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        <FloatingHelp />
      </body>
    </html>
  );
}
